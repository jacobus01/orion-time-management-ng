import { RoleService } from 'src/app/core/services/role.service';
import { logging } from 'protractor';
import { TimecaptureStateManagementService } from './timecapture-state-management.service';
import { LoggingService } from './../../core/services/logging.service';
import { EmployeeModel } from './../../core/models/employee.model';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { RoleModel } from 'src/app/core/models/role.model';

@Component({
  selector: 'app-timecapture',
  templateUrl: './timecapture.component.html',
  styleUrls: ['./timecapture.component.css']
})
export class TimecaptureComponent implements OnInit {
  employees: EmployeeModel[];
  loadCalendar = false;
  selectedEmployee: EmployeeModel;
  selectedEmployeeRole: RoleModel;
  configEmployeeDropdown = {
    displayKey:"FullName", //if objects array passed which key to be displayed defaults to description
    search: true,  //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select...', // text to be displayed when no item is selected defaults to Select,

    limitTo: 7, // number thats limits the no of options displayed in the UI (if zero, options will not be limited
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    searchOnKey: 'FullName' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    }
  constructor(private logging: LoggingService,
    private spinner: NgxSpinnerService,
    private roleService: RoleService,
    private timecaptureStateManagementService: TimecaptureStateManagementService
    ) { }

  ngOnInit() {
    this.logging.logDebug("init selected user=>" , this.selectedEmployee);
    this.spinner.show();
    this.timecaptureStateManagementService.getEmployees()
    .pipe(map(userData =>
      {
        const userArray = [];
        for (const key in userData)
        {
          if (userData.hasOwnProperty(key))
          {
            userArray.push(
              {
                ...userData[key], rowNumber: key, FullName: userData[key].FirstName + ' ' + userData[key].LastName
              }
            );
          }
        }
        return userArray;
      }))
    .subscribe(
      result =>
      {
        this.employees = result;
        this.logging.logDebug('UsersResult => ', result);
        this.spinner.hide();
      },
      err =>
      {
        this.logging.logError('ListUsers Error' , err);
        this.spinner.hide();
      }
    );
  }

  employeeSelectionChanged($event)
  {
    this.spinner.show();
    this.selectedEmployee = $event.value;
    this.logging.logDebug("ontheemployeeselectchange=> ",$event);
    this.loadCalendar = true;

    this.roleService.getRoleById(1)
    .subscribe(
      result =>
      {
        this.selectedEmployeeRole = result;
        this.logging.logDebug('GetRoleResult => ', result);
        this.spinner.hide();
      },
      err =>
      {
        this.logging.logError('GetRoleResult Error' , err);
        this.spinner.hide();
      }
    );
  }

}
