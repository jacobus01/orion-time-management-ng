import { ToastrService } from 'ngx-toastr';
import { RoleService } from 'src/app/core/services/role.service';
import { RoleModel } from 'src/app/core/models/role.model';
import { CapturedTimeModel } from './../../../core/models/capturedtime.model';
import { TaskService } from './../../../core/services/task.service';
import { TaskModel } from './../../../core/models/task.model';
import { TimecaptureStateManagementService } from './../timecapture-state-management.service';
import { LoggingService } from './../../../core/services/logging.service';
import { TimecaptureService } from './../../../core/services/timecapture.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { userInfo } from 'os';
import { EmployeeModel } from 'src/app/core/models/employee.model';
declare var $: any;

@Component({
  selector: 'app-timecapture-add',
  templateUrl: './timecapture-add.component.html',
  styleUrls: ['./timecapture-add.component.css']
})
export class TimecaptureAddComponent implements OnInit {
  @ViewChild('timeModal')
  private modalRef: TemplateRef<any>;
  @ViewChild('f') timeCaptureForm: NgForm;
  closeResult: string;
  modalOptions: NgbModalOptions;
  tasks: TaskModel[];
  selectedTask: TaskModel;
  selectedCapturedTime: CapturedTimeModel;
  @Input() selectedEmployee: EmployeeModel;
  @Input() selectedEmployeeRole: RoleModel;
  startTime = new Date();
  endTime = new Date();
  configTaskDropdown ={
    displayKey:"TaskName", //if objects array passed which key to be displayed defaults to description
    search:true,  //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Select', // text to be displayed when no item is selected defaults to Select,

    limitTo: 7, // number thats limits the no of options displayed in the UI (if zero, options will not be limited
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder:'Search', // label thats displayed in search input,
    searchOnKey: 'TaskName' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    }

  constructor(private timecaptureStateManagementService: TimecaptureStateManagementService,
    private logging: LoggingService,
    private modalService: NgbModal,
    private taskService: TaskService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    };
  }

  ngOnInit() {
    this.getEmptyCapturedTime();
    this.taskService.listTasks()
    .pipe(map(tasksData =>
      {
        const tasksArray = [];
        for (const key in tasksData)
        {
          if (tasksData.hasOwnProperty(key))
          {
            tasksArray.push(
              {
                ...tasksData[key], rowNumber: key
              }
            );
          }
        }
        return tasksArray;
      }))
    .subscribe(
      result =>
      {
        this.tasks = result;
        this.logging.logDebug('TasksResult => ', result);
        this.spinner.hide();
      },
      err =>
      {
        this.logging.logError('ListTasks Error' , err);
        this.spinner.hide();
      }
    );

    this.timecaptureStateManagementService.timeCaptureShowModalEmitter.subscribe(result => {
      this.logging.logDebug('timecapture show modal event received', result);
      this.startTime = result.date;
      this.endTime = result.date;
      this.selectedCapturedTime.Rate = this.selectedEmployeeRole.Rate;
      this.modalService.open(this.modalRef, this.modalOptions).result.then((resultmodel) => {
        this.closeResult = `Closed with: ${resultmodel}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }, err => {
      this.logging.logError('error showing timecapture add form', err);
    });
  }

  open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onTaskSelectionChanged($event)
  {
    this.selectedCapturedTime.Duration = $event.value.Duration;
    this.logging.logDebug("onthetaskselectchange=> ",$event);
  }

  onSubmit(form: NgForm)
  {
    this.logging.logDebug('Submitted CapturedTime Form =>', form);
    this.selectedCapturedTime.UserId = this.selectedEmployee.Id;
    this.selectedCapturedTime.StartTime = this.startTime.getFullYear() + "-" + (this.startTime.getMonth() + 1) + "-" + this.startTime.getDate() + " " + this.startTime.getHours() + ":" + this.startTime.getMinutes() + ":" + this.startTime.getSeconds();
    this.selectedCapturedTime.EndTime = this.endTime.getFullYear() + "-" + (this.endTime.getMonth() + 1) + "-" + this.endTime.getDate() + " " + this.endTime.getHours() + ":" + this.endTime.getMinutes() + ":" + this.endTime.getSeconds();
    this.selectedCapturedTime.Rate = form.value.Rate;
    this.selectedCapturedTime.TaskId = this.selectedTask.Id;

    this.logging.logDebug('Selected CapturedTime =>', this.selectedCapturedTime);
    this.timecaptureStateManagementService.createUpdateCapturedTime(this.selectedCapturedTime).subscribe(result => {
      this.timecaptureStateManagementService.createCapturedTimeCalendarEvent({...this.selectedCapturedTime, eventName: this.selectedTask.TaskName});
      this.logging.logDebug('result from submitted time capture form', result);
      this.toastr.success('Captured Time Submitted Successfully', 'Success');
      this.modalService.dismissAll();
    }, err => {
      this.logging.logError('Error submitting the CapturedTime', err);
      this.modalService.dismissAll();
    });
  }
  OnStartTimeChange($event)
  {
    this.logging.logDebug('startTimeChange=>', $event);
  }

  OnEndTimeChange($event)
  {
    this.logging.logDebug('endTimeChange=>', $event);
  }

  getEmptyCapturedTime()
  {
    let date = new Date(Date.now());
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    this.selectedCapturedTime = new CapturedTimeModel(
      0,0,0,0,date.toString(),date.toString()
    );
  }

}
