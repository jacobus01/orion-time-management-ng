import { ToastrService } from 'ngx-toastr';
import { LoggingService } from './../../../core/services/logging.service';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Ng2SmartTableComponent } from 'ng2-smart-table';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent implements OnInit {
  public settings = {
    mode: 'external',
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
      class : 'blueTable'
    },
    pager:
    {
      display: true,
      perPage: 5
    },
    delete:
    {
      deleteButtonContent: "<span class='btn btn-primary'>Delete</span>"
    },
    reset: false
  };
  public employeeTable: Ng2SmartTableComponent
  public data = [
  ];

  constructor(private authService: AuthService, private logging: LoggingService, private spinner : NgxSpinnerService, private toastr: ToastrService) {
    this.authService.refreshEmployeeTableEmitter.subscribe(
      result =>
      {
        if (result === 'ref')
        {
          this.refreshTable();
        }
      }
    );
   }

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
    // Logic for table refresh
  }

  refreshTable()
  {
    if (this.authService.refreshEmployeeTableEmitter.subscribe(result =>
      {
        this.logging.logDebug('Refresh employees' , result);
        return result;
      },
      err =>
      {
        this.logging.logError('Refresh Employee Table Error' , err);
        this.spinner.hide();
      }))
      {
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
            })).subscribe(
              result =>
              {
                this.logging.logDebug('Refresh Employee Table Result => ', result);
                this.spinner.hide();
                this.data = result;
              },
            err =>
            {
              this.logging.logError('Refresh Employee Table Error => ', err);
              this.spinner.hide();
            });
      }
  }

  onUserRowSelect(event)
  {
    this.authService.employeeShowModalEmitter.next(true);
    this.authService.selectedEmployeeEmitter.next({...event.data});
    this.logging.logDebug('ListUsers RowSelect', event);
  }

  onDeleteEmployee(event)
  {
    this.logging.logDebug('Delete Employee Event => ', event);
    if(event.data.Id === 1)
    {
      this.toastr.warning('This user cannot be deleted', 'Read-Only User')
    }
    this.spinner.show();
    this.authService.DeleteUser(event.data.Id).subscribe(
      result =>
      {
        this.logging.logDebug('Delete Employee Result => ', result);
        this.toastr.success('Employee ' + event.data.FirstName + ' ' + event.data.LastName + ' deleted successfully', 'Employee Deleted');
        this.spinner.hide();
        this.authService.refreshEmployeeTableEmitter.next('ref');
      },
    err =>
    {
      this.logging.logError('Delete Employee Error => ', err);
      this.spinner.hide();
    });
  }

}
