import { ToastrService } from 'ngx-toastr';
import { RoleModel } from 'src/app/core/models/role.model';
import { CapturedTimeModel } from './../../../core/models/capturedtime.model';
import { TaskService } from './../../../core/services/task.service';
import { TaskModel } from './../../../core/models/task.model';
import { TimecaptureStateManagementService } from './../timecapture-state-management.service';
import { LoggingService } from './../../../core/services/logging.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeModel } from 'src/app/core/models/employee.model';
import { Subject } from 'rxjs';
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
  StartTimeEmitter: Subject<Date>;
  EndTimeEmitter: Subject<Date>;
  isDelete = false;
  closeResult: string;
  modalOptions: NgbModalOptions;
  tasks: TaskModel[];
  canDelete = false;
  selectedTask: TaskModel;
  startTimeObj = { hour: 0, minute: 0 };
  endTimeObj = { hour: 0, minute: 0 };
  modalHeader = 'Add Time Worked';
  btnText = 'Add';
  selectedCapturedTime: CapturedTimeModel;
  @Input() selectedEmployee: EmployeeModel;
  @Input() selectedEmployeeRole: RoleModel;
  startTime = new Date();
  endTime = new Date();
  configTaskDropdown = {
    displayKey: 'TaskName', // if objects array passed which key to be displayed defaults to description
    search: true,  // true/false for the search functionlity defaults to false,
    // tslint:disable-next-line: max-line-length
    height: 'auto', // height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,

    limitTo: 7, // number thats limits the no of options displayed in the UI (if zero, options will not be limited
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    // tslint:disable-next-line: max-line-length
    searchOnKey: 'TaskName' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  };

  constructor(public timecaptureStateManagementService: TimecaptureStateManagementService,
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
    this.getEmptyCapturedTime();

  }

  ngOnInit() {
    this.spinner.show();
    this.getEmptyCapturedTime();
    this.taskService.listTasks()
      .pipe(map(tasksData => {
        const tasksArray = [];
        for (const key in tasksData) {
          if (tasksData.hasOwnProperty(key)) {
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
        result => {
          this.tasks = result;
          this.logging.logDebug('TasksResult => ', result);
          this.spinner.hide();
        },
        err => {
          this.logging.logError('ListTasks Error', err);
          this.spinner.hide();
        }
      );
    /* for calendar segments */
    this.timecaptureStateManagementService.timeCaptureHourSegmentShowModalEmitter.subscribe(result => {
      this.modalHeader = 'Add Time Worked';
      this.btnText = 'Add';
      this.canDelete = false;
      this.logging.logDebug('id from event Emitter', result.Id);
      this.logging.logDebug('timecapture show modal event received', result);
      this.selectedCapturedTime.Id = result.Id === undefined ? 0 : result.Id; // this value musn't be undefined
      this.logging.logDebug('result.date', result.date);
      this.selectedCapturedTime.TaskId = result.TaskId;
      this.startTime = new Date(result.date);
      this.startTimeObj = { hour: result.date.getHours(), minute: result.date.getMinutes() };
      this.endTime = new Date(result.date);
      this.endTimeObj = { hour: result.date.getHours(), minute: result.date.getMinutes() };
      this.selectedCapturedTime.Rate = this.selectedEmployeeRole.Rate;
      this.modalService.open(this.modalRef, this.modalOptions).result.then((resultmodel) => {
        this.closeResult = `Closed with: ${resultmodel}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }, err => {
      this.logging.logError('error showing timecapture add form', err);
    });
    /* for events */
    this.timecaptureStateManagementService.timeCaptureHandleEventShowModalEmitter.subscribe(result => {
      this.modalHeader = 'Edit Time Worked';
      this.btnText = 'Edit';
      this.canDelete = true;
      this.logging.logDebug('id from event Emitter', result.meta.id);
      this.logging.logDebug('timecapture show modal event received', result);
      this.selectedCapturedTime.Id = result.meta.id;
      this.selectedCapturedTime.UserId = result.meta.userId;
      this.selectedCapturedTime.TaskId = result.meta.taskId;
      this.selectedTask = this.tasks.find(t => t.Id === result.meta.taskId);
      this.startTime = new Date(result.start);
      this.startTimeObj = { hour: result.start.getHours(), minute: result.start.getMinutes() };
      this.endTime = new Date(result.end);
      this.selectedCapturedTime.Color = result.meta.colorId;
      this.endTimeObj = { hour: result.end.getHours(), minute: result.end.getMinutes() };
      this.selectedCapturedTime.Rate = result.meta.rate;
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

  onTaskSelectionChanged($event) {
    this.selectedCapturedTime.Duration = $event.value.Duration;
    this.logging.logDebug('onthetaskselectchange=> ', $event);
  }

  onSubmit(form: NgForm) {
    if (this.isDelete) {
      this.Delete();
    }
    else {
      this.logging.logDebug('Submitted CapturedTime Form =>', form);
      this.selectedCapturedTime.UserId = this.selectedEmployee.Id;
      this.startTime.setHours(this.startTimeObj.hour);
      this.startTime.setMinutes(this.startTimeObj.minute);
      this.startTime.setSeconds(0);
      this.startTime.setMilliseconds(0);
      this.endTime.setHours(this.endTimeObj.hour);
      this.endTime.setMinutes(this.endTimeObj.minute);
      this.endTime.setSeconds(0);
      this.endTime.setMilliseconds(0);
      this.selectedCapturedTime.StartTime = this.FormatDateForAPI(this.startTime);
      this.selectedCapturedTime.EndTime =  this.FormatDateForAPI(this.endTime);
      this.selectedCapturedTime.Rate = form.value.Rate;
      this.selectedCapturedTime.TaskId = this.selectedTask.Id;
      this.selectedCapturedTime.Color = Math.floor(Math.random() * 4);
      this.logging.logDebug('Selected CapturedTime EndDate =>', this.selectedCapturedTime.EndTime);
      this.logging.logDebug('Selected CapturedTime =>', this.selectedCapturedTime);
      this.timecaptureStateManagementService.createUpdateCapturedTime(this.selectedCapturedTime).subscribe(result => {
        if (this.selectedCapturedTime.Id === 0) {
          this.selectedCapturedTime.Id = result.newId;
        }
        this.timecaptureStateManagementService.createCapturedTimeCalendarEvent(
          { ...this.selectedCapturedTime, eventName: this.selectedTask.TaskName });
        this.logging.logDebug('result from submitted time capture form', result);
        this.toastr.success('Captured Time Submitted Successfully', 'Success');
        this.modalService.dismissAll();
      }, err => {
        this.logging.logError('Error submitting the CapturedTime', err);
        this.modalService.dismissAll();
      });
    }
  }
  private FormatDateForAPI(date): string {
    return date.getFullYear() + '-' + (date.getMonth() + 1)
    + '-' + date.getDate() + ' ' + date.getHours()
    + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  OnStartTimeChange($event) {
    this.logging.logDebug('startTimeChange=>', $event);
  }

  OnEndTimeChange($event) {
    this.logging.logDebug('endTimeChange=>', $event);
  }
  OnViewDateChanged($event) {
    this.logging.logDebug('viewTimeChange=>', $event);
  }
  nav($event) {
    this.logging.logDebug('navChange=>', $event);
  }
  click(event) {
    this.logging.logDebug('clickChange=>', event);
  }

  getEmptyCapturedTime() {
    const date = new Date(Date.now());
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    this.selectedCapturedTime = new CapturedTimeModel(
      0, 0, 0, 0, date.toString(), date.toString(), 0
    );
  }

  Delete() {
    this.logging.logDebug('Selected CapturedTime =>', this.selectedCapturedTime);
    this.logging.logDebug('Selected CapturedTime Id', this.selectedCapturedTime.Id);
    this.timecaptureStateManagementService.deleteCapturedTime(this.selectedCapturedTime.Id).subscribe(result => {
      this.timecaptureStateManagementService.deleteCapturedTimeCalendarEvent(
        { ...this.selectedCapturedTime, meta: { id: this.selectedCapturedTime.Id },
        eventName: this.selectedTask.TaskName });
      this.logging.logDebug('result from deleted time capture', result);
      this.toastr.success('Captured Time Deleted Successfully', 'Success');
      this.modalService.dismissAll();
      this.isDelete = false;
    }, err => {
      this.logging.logError('Error deleting the CapturedTime', err);
      this.modalService.dismissAll();
      this.isDelete = false;
    });
  }
  OnDelete(action) {
    this.isDelete = true;
    this.logging.logDebug('delete clicked', action);
  }
}
