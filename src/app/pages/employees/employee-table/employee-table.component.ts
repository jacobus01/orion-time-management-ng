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
      Id: {
        title: 'ID'
      },
      FirstName: {
        title: 'First Name'
      },
      LastName: {
        title: 'Last Name'
      },
      UserName: {
        title: 'User Name'
      },
      Email: {
        title: 'Email'
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: true
    },
    attr:
    {
      class : 'table table-bordered table-hover'
    },
    pager:
    {
      display: true,
      perPage: 10
    },
    delete:
    {
      deleteButtonContent: "<span class='btn btn-primary'>Delete</span>"
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

  onDeleteEmployee($event)
  {

  }

}
