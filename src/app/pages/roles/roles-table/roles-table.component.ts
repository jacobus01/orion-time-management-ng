import { Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/core/services/role.service';
import { LoggingService } from 'src/app/core/services/logging.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.css']
})
export class RolesTableComponent implements OnInit {

  public settings = {
    columns: {
      Id: {
        title: 'ID'
      },
      RoleName: {
        title: 'Role Name'
      },
      Rate: {
        title: 'Rate'
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
      perPage: 10
    },
    delete:
    {
      deleteButtonContent: '<span class=\'btn btn-primary\'>Delete</span>'
    }
  };

  public data = [
  ];
  constructor(private roleService: RoleService, private logging: LoggingService, private spinner : NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.roleService.listRoles()
    .pipe(map(roleData =>
      {
        const roleArray = [];
        for (const key in roleData)
        {
          if (roleData.hasOwnProperty(key))
          {
            roleArray.push(
              {
                ...roleData[key], rowNumber: key
              }
            );
          }
        }
        return roleArray;
      }))
    .subscribe(
      result =>
      {
        this.data = result;
        this.logging.logDebug('RolesResult => ', result);
        this.spinner.hide();
      },
      err =>
      {
        this.logging.logError('ListRoles Error' , err);
        this.spinner.hide();
      }
    );
  }

  onRoleRowSelect(event)
  {
    this.roleService.roleShowModalEventEmitter.next(true);
    this.roleService.selectedRoleEmitter.next({...event.data});
    this.logging.logDebug('ListRoles RowSelect', event);
  }

  onDeleteRole($event)
  {

  }

}
