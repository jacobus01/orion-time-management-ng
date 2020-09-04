import { LoggingService } from './../../core/services/logging.service';
import { RoleModel } from './../../core/models/role.model';
import { RoleService } from './../../core/services/role.service';
import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-role-dropdown',
  templateUrl: './role-dropdown.component.html',
  styleUrls: ['./role-dropdown.component.css']
})
export class RoleDropdownComponent implements OnInit {
  roles: RoleModel[] = [];
  @Input() selectedId = -1;
  constructor(private roleService: RoleService,
    private logging: LoggingService,
    private spinner: NgxSpinnerService) { }

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
  }


}
