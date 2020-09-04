import { logging } from 'protractor';
import { LoggingService } from './../../../core/services/logging.service';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent implements OnInit {
  public settings = {
    columns: {
      id: {
        title: 'ID'
      },
      firstName: {
        title: 'First Name'
      },
      lastName: {
        title: 'Last Name'
      },
      userName: {
        title: 'User Name'
      },
      email: {
        title: 'Email'
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    attr:
    {
      class : 'table table-bordered table-hover'
    },
    pager:
    {
      display: true,
      perPage: 10
    }
  };

  public data = [
  ];

  constructor(private authService: AuthService, private logging: LoggingService, private spinner : NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.authService.listUsers()
    .pipe(map(userData =>
      {
        const userArray = [];
        for (const key in userData)
        {
          if (userData.hasOwnProperty(key))
          {
            userArray.push(
              {
                ...userData[key], rowNumber: key
              }
            );
          }
        }
        return userArray;
      }))
    .subscribe(
      result =>
      {
        this.data = result;
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

  onUserRowSelect(event)
  {
    this.authService.employeeShowModalEmitter.next(true);
    this.authService.selectedEmployeeEmitter.next({...event.data});
    this.logging.logDebug('ListUsers RowSelect', event);
  }

}
