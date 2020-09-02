import { LoggingService } from './../../../core/services/logging.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeeModel } from './../../../core/models/employee.model';
declare var $: any;

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {
  selectedEmployee: EmployeeModel = new EmployeeModel(
    0,'','','','','','','',false,0,0,false
  );
  constructor(private authService: AuthService, private logging: LoggingService) {

   }

  ngOnInit() {
    this.authService.employeeShowModalEmitter.subscribe(result =>
      {
        if (result)
        {
          $('#myModal').modal('show');
        }
      }, err => {
        this.logging.logError('Error showing modal', err);
      });
    this.authService.selectedEmployeeEmitter.subscribe(result =>
        {
          this.logging.logDebug('loading employee model on add edit form', result);
          this.selectedEmployee = new EmployeeModel(
            result.id,
            result.userName,
            result.password,
            result.email,
            result.employeeNumber,
            result.firstName,
            result.lastName,
            result.appointmentDate,
            result.isActive,
            result.roleId,
            result.accessGroupId,
            result.lockoutEnabled);
        }, err => {
          this.logging.logError('Error loading employee model on modal', err);
        });
  }

  onAddClicked()
  {
    this.selectedEmployee = new EmployeeModel(
      0,'','','','','','','',false,0,0,false
    );
  }

  onSubmit(form: NgForm)
  {

  }
}
