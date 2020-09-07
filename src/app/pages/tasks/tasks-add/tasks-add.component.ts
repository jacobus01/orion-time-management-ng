import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TaskModel } from 'src/app/core/models/task.model';
import { LoggingService } from 'src/app/core/services/logging.service';
import { NgForm } from '@angular/forms';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-tasks-add',
  templateUrl: './tasks-add.component.html',
  styleUrls: ['./tasks-add.component.css']
})
export class TasksAddComponent implements OnInit {
  selectedTask: TaskModel;
  @ViewChild('taskModal')
  private modalRef: TemplateRef<any>;
  formHeading = 'Add Task';
  closeResult: string;
  modalOptions: NgbModalOptions;
  submitButtonText = 'Add';
  @ViewChild('f') employeeForm: NgForm;
  constructor(
    private logging: LoggingService,
    private toastr: ToastrService,
    private taskService: TaskService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    };
  }

  ngOnInit() {
    this.taskService.taskShowModalEventEmitter.subscribe(result => {
      if (result) {
        this.formHeading = 'Edit Task';
        this.submitButtonText = 'Edit';
        this.modalService.open(this.modalRef, this.modalOptions).result.then((resultmodel) => {
          this.closeResult = `Closed with: ${resultmodel}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
    }, err => {
      this.logging.logError('Error showing roleModal', err);
    });
    this.taskService.selectedTaskEmitter.subscribe(result => {
      this.selectedTask = result;
      this.logging.logDebug('loading task model on add edit form', result);
    }, err => {
      this.logging.logError('Error loading task model on modal', err);
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

  open(content) {
    this.formHeading = 'Add Task';
    this.submitButtonText = 'Add';
    this.selectedTask = undefined;
    this.setEmptyTaskObject();
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmit(form: NgForm)
  {
    this.logging.logDebug('Submitted Task Form =>', form);
    this.selectedTask.TaskName = form.value.TaskName;
    this.selectedTask.Duration = form.value.Duration;


    this.logging.logDebug('Selected Role =>', this.selectedTask);
    this.taskService.CreateUpdateRole(this.selectedTask).subscribe(result => {
      this.logging.logDebug('result from submitted task form', result);
      this.toastr.success('Task Submitted Successfully', 'Success');
      this.modalService.dismissAll();
    }, err => {
      this.logging.logError('Error submitting the Task', err);
      this.modalService.dismissAll();
    });
  }

  setEmptyTaskObject() {
    this.selectedTask = new TaskModel(
      0, '', 0
    );
  }

}
