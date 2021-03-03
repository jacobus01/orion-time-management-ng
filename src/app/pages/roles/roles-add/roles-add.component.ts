import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RoleModel } from 'src/app/core/models/role.model';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from 'src/app/core/services/role.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { LoggingService } from 'src/app/core/services/logging.service';

@Component({
  selector: 'app-roles-add',
  templateUrl: './roles-add.component.html',
  styleUrls: ['./roles-add.component.css']
})
export class RolesAddComponent implements OnInit {
  selectedRole: RoleModel;
  @ViewChild('roleModal')
  private modalRef: TemplateRef<any>;
  formHeading = 'Add Role';
  closeResult: string;
  modalOptions: NgbModalOptions;
  submitButtonText = 'Add';
  @ViewChild('f') employeeForm: NgForm;
  constructor(
    private logging: LoggingService,
    private toastr: ToastrService,
    private roleService: RoleService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    };
  }

  ngOnInit() {
    this.roleService.roleShowModalEventEmitter.subscribe(result => {
      if (result) {
        this.formHeading = 'Edit Role';
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
    this.roleService.selectedRoleEmitter.subscribe(result => {
      this.selectedRole = result;
      this.logging.logDebug('loading role model on add edit form', result);
    }, err => {
      this.logging.logError('Error loading role model on modal', err);
    });
  }

  open(content) {
    this.formHeading = 'Add Employee';
    this.submitButtonText = 'Add';
    this.selectedRole = undefined;
    this.setEmptyRoleObject();
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



  onSubmit(form: NgForm)
  {
    this.logging.logDebug('Submitted Task Form =>', form);
    this.selectedRole.RoleName = form.value.RoleName;
    this.selectedRole.Rate = form.value.Rate;


    this.logging.logDebug('Selected Role =>', this.selectedRole);
    this.roleService.CreateUpdateRole(this.selectedRole).subscribe(result => {
      this.logging.logDebug('result from submitted role form', result);
      this.toastr.success('Role Submitted Successfully', 'Success');
      this.modalService.dismissAll();
      this.roleService.refreshRoleTableEmitter.next('ref');
    }, err => {
      this.logging.logError('Error submitting the Role', err);
      this.modalService.dismissAll();
    });
  }

  setEmptyRoleObject() {
    this.selectedRole = new RoleModel(
      0, '', 0
    );
  }
}
