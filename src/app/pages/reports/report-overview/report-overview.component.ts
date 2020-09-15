import { AccessgroupService } from './../../../core/services/accessgroup.service';
import { RoleService } from './../../../core/services/role.service';
import { ReportOverviewService } from './../../../core/services/report-overview.service';
import { LoggingService } from './../../../core/services/logging.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-report-overview',
  templateUrl: './report-overview.component.html',
  styleUrls: ['./report-overview.component.css']
})
export class ReportOverviewComponent implements OnInit {
  roles = [];
  accessGroups = [];
  totalEmployees = 0;
  employeesPerRole = [];
  employeesPerAccessGroup = [];
  activeEmployees = 0;
  totalPay = 0;
  totalHours = 0;
  currentMonth = new Date();
  constructor(private rptOvervwService: ReportOverviewService,
    private roleService: RoleService,
    private accessgroupService: AccessgroupService,
    private logging: LoggingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.currentMonth.setHours(0);
    this.currentMonth.setMinutes(0);
    this.currentMonth.setSeconds(0);
    this.currentMonth.setMilliseconds(0);
    this.spinner.show();
    // Roles
    this.roleService.listRoles()
      .pipe(map(roleData => {
        const roleArray = [];
        for (const key in roleData) {
          if (roleData.hasOwnProperty(key)) {
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
        result => {
          this.roles = result;
          this.logging.logDebug('RolesResult => ', result);
          this.spinner.hide();
        },
        err => {
          this.logging.logError('ListRoles Error', err);
          this.spinner.hide();
        }
      );

    this.spinner.show();
    this.accessgroupService.listAccessGroups()
      .pipe(map(accessgroupData => {
        const accessgroupArray = [];
        for (const key in accessgroupData) {
          if (accessgroupData.hasOwnProperty(key)) {
            accessgroupArray.push(
              {
                ...accessgroupData[key], rowNumber: key
              }
            );
          }
        }
        return accessgroupArray;
      }))
      .subscribe(
        result => {
          this.accessGroups = result;
          this.logging.logDebug('AccessGroup Result => ', result);
          this.spinner.hide();
        },
        err => {
          this.logging.logError('AccessGroup Error', err);
          this.spinner.hide();
        }
      );


    this.spinner.show();
    this.rptOvervwService.EmployeesWithSubs()
      .pipe(map(userData => {
        const userArray = [];
        for (const key in userData) {
          if (userData.hasOwnProperty(key)) {
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
        result => {
          const usersPerPole = [];
          this.roles.forEach(role => {
            usersPerPole.push({
              RoleName: role.RoleName,
              EmnployeesPerRole: result.filter(u => u.RoleName === role.RoleName).length
            });
          });
          this.employeesPerRole = usersPerPole;
          this.logging.logDebug('EmployeesPerAccessGroup Result => ', result);

          const usersPerAccessGroup = [];
          this.accessGroups.forEach(accessGroup => {
            usersPerAccessGroup.push({
              AccessGroupName: accessGroup.AccessGroupName,
              EmnployeesPerAccessGroup: result.filter(u => u.AccessGroupName === accessGroup.AccessGroupName).length
            });
          });

          this.employeesPerAccessGroup = usersPerAccessGroup;
          this.logging.logDebug('EmployeesPerAccessGroup Result => ', result);
          this.spinner.hide();
        },
        err => {
          this.logging.logError('EmployeesPerRoleAndAccessGroup Error', err);
          this.spinner.hide();
        });

    this.rptOvervwService.TotalEmployees().subscribe(result => {
      this.totalEmployees = result.TotalEmployees;
      this.logging.logDebug('TotalEmployees Result => ', result);
      this.spinner.hide();
    },
      err => {
        this.logging.logError('TotalEmployees Error', err);
        this.spinner.hide();
      });

    this.rptOvervwService.TotalHours(this.currentMonth).subscribe(result => {
      this.totalHours = result.TotalHours;
      this.logging.logDebug('Total Hours Result => ', result);
      this.spinner.hide();
    },
      err => {
        this.logging.logError('Total Hours Error', err);
        this.spinner.hide();
      });

    this.rptOvervwService.TotalPay(this.currentMonth).subscribe(result => {
      this.totalPay = result.TotalPay;
      this.logging.logDebug('Total Pay Result => ', result);
      this.spinner.hide();
    },
      err => {
        this.logging.logError('Total Pay Error', err);
        this.spinner.hide();
      });
  }

}
