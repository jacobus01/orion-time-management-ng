import { AccessgroupService } from './../../../core/services/accessgroup.service';
import { ToastrService } from 'ngx-toastr';
import { logging } from 'protractor';
import { LoggingService } from './../../../core/services/logging.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeeModel } from './../../../core/models/employee.model';
import { RoleModel } from 'src/app/core/models/role.model';
import { RoleService } from 'src/app/core/services/role.service';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccessGroupModel } from 'src/app/core/models/accessgroup.model';
import { NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {
  selectedEmployee: EmployeeModel = new EmployeeModel(
    0, '', '', false, '', '', '', '', new Date().toDateString(), false, 0, 0, false
  );
  @ViewChild('mymodal')
  private modalRef: TemplateRef<any>;

  formHeading = 'Add Employee';
  submitButtonText = 'Add';
  changeAddPassword = false;
  roles: RoleModel[] = [];
  accessGroups: AccessGroupModel[] = [];
  selectedAccessGroup: AccessGroupModel;
  selectedRole: RoleModel;
  closeResult: string;
  modalOptions: NgbModalOptions;
  configRoleDropdown ={
    displayKey:"RoleName", //if objects array passed which key to be displayed defaults to description
    search:true,  //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Select', // text to be displayed when no item is selected defaults to Select,

    limitTo: 7, // number thats limits the no of options displayed in the UI (if zero, options will not be limited
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder:'Search', // label thats displayed in search input,
    searchOnKey: 'RoleName' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    }
    configAccessGroupDropdown ={
      displayKey:"AccessGroupName", //if objects array passed which key to be displayed defaults to description
      search:true,  //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder:'Select', // text to be displayed when no item is selected defaults to Select,

      limitTo: 7, // number thats limits the no of options displayed in the UI (if zero, options will not be limited
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder:'Search', // label thats displayed in search input,
      searchOnKey: 'AccessGroupName' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
      }
  @ViewChild('f') employeeForm: NgForm;
  constructor(private authService: AuthService,
              private logging: LoggingService,
              private toastr: ToastrService,
              private roleService: RoleService,
              private accessGroupService: AccessgroupService,
              private spinner: NgxSpinnerService,
              private modalService: NgbModal) {
                this.modalOptions = {
                  backdrop: 'static',
                  backdropClass: 'customBackdrop',
                  size: 'lg'
                };
   }

  ngOnInit() {

    this.roleService.listRoles()
    .pipe(map(rolesData =>
      {
        const rolesArray = [];
        for (const key in rolesData)
        {
          if (rolesData.hasOwnProperty(key))
          {
            rolesArray.push(
              {
                ...rolesData[key], rowNumber: key
              }
            );
          }
        }
        return rolesArray;
      }))
    .subscribe(
      result =>
      {
        this.roles = result;
        this.logging.logDebug('RolesResult => ', result);
        this.spinner.hide();
      },
      err =>
      {
        this.logging.logError('ListRoles Error' , err);
        this.spinner.hide();
      }
    );

    this.accessGroupService.listAccessGroups()
    .pipe(map(accessGroupsData =>
      {
        const accessGroupsArray = [];
        for (const key in accessGroupsData)
        {
          if (accessGroupsData.hasOwnProperty(key))
          {
            accessGroupsArray.push(
              {
                ...accessGroupsData[key], rowNumber: key
              }
            );
          }
        }
        return accessGroupsArray;
      }))
    .subscribe(
      result =>
      {
        this.accessGroups = result;
        this.logging.logDebug('AccessGroupResult => ', result);
        this.spinner.hide();
      },
      err =>
      {
        this.logging.logError('listAccessGroups Error' , err);
        this.spinner.hide();
      }
    );

    this.authService.employeeShowModalEmitter.subscribe(result =>
      {
        if (result)
        {
          this.formHeading = 'Edit Employee';
          this.submitButtonText = 'Edit';
          this.changeAddPassword = false;
          this.modalService.open(this.modalRef, this.modalOptions).result.then((resultmodel) => {
            this.closeResult = `Closed with: ${resultmodel}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        }
      }, err => {
        this.logging.logError('Error showing modal', err);
      });
    this.authService.selectedEmployeeEmitter.subscribe(result =>
        {
          this.selectedAccessGroup = this.accessGroups.find(e => e.Id === result.accessGroupId);
          this.selectedRole = this.roles.find(e => e.Id === result.RoleId);
          this.logging.logDebug('loading employee model on add edit form', result);
          this.selectedEmployee = new EmployeeModel(
            result.Id,
            result.UserName,
            result.Password,
            result.ChangePasswordOnNextLogin,
            result.Email,
            result.EmployeeNumber,
            result.FirstName,
            result.LastName,
            result.AppointmentDate,
            result.IsActive,
            result.RoleId,
            result.AccessGroupId,
            result.LockoutEnabled);
        }, err => {
          this.logging.logError('Error loading employee model on modal', err);
        });
  }

  open(content)
  {
    this.formHeading = 'Add Employee';
    this.submitButtonText = 'Add';
    this.changeAddPassword = true;
    this.selectedAccessGroup = undefined;
    this.selectedRole = undefined;
    this.setEmptyEmployeeObject();
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
      return  `with: ${reason}`;
    }
  }

  roleSelectionChanged($event)
  {
    this.employeeForm.value.RoleId = $event.value;
    this.logging.logDebug("ontheroleselectchange=> ",$event);

  }
  accessGroupSelectionChanged($event)
  {
    this.employeeForm.value.AccessGroupId = $event.value;
    this.logging.logDebug("ontheaccessGroupselectchange=> ",$event);
  }

  onSubmit(form: NgForm)
  {
    this.logging.logDebug('Submitted Employee Form =>', form);
    this.selectedEmployee.UserName = form.value.UserName;
    this.selectedEmployee.EmployeeNumber = form.value.EmployeeNumber;
    this.selectedEmployee.Password = form.value.EmployeeNumber;
    this.selectedEmployee.ChangePasswordOnNextLogin = form.value.ChangePasswordOnNextLogin;
    this.selectedEmployee.Email = form.value.Email;
    this.selectedEmployee.FirstName = form.value.FirstName;
    this.selectedEmployee.LastName = form.value.LastName;
    this.selectedEmployee.AppointmentDate = form.value.AppointmentDate;
    this.selectedEmployee.IsActive = form.value.IsActive;
    this.selectedEmployee.RoleId = form.value.RoleId.Id;
    this.selectedEmployee.AccessGroupId = form.value.AccessGroupId.Id;
    this.selectedEmployee.LockoutEnabled = form.value.LockoutEnabled;


    this.logging.logDebug('Selected Employee =>', this.selectedEmployee);
    this.authService.CreateUpdateUser(this.selectedEmployee).subscribe(result => {
      this.logging.logDebug('result from submitted employee form', result);
      this.toastr.success('Employee Submitted Successfully', 'Success');
      this.modalService.dismissAll();
    }, err => {
      this.logging.logError('Error submitting the Employee', err);
      this.modalService.dismissAll();
    });
  }

  setEmptyEmployeeObject()
  {
    this.selectedEmployee = new EmployeeModel(
      0, '', '', false, '', '', '', '', new Date().toDateString(), false, 0, 0, false
    );
  }
}
