import { RoleModel } from './../../../core/models/role.model';
import { RoleService } from 'src/app/core/services/role.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { logging } from 'protractor';
import { TimecaptureService } from './../../../core/services/timecapture.service';
import { ToastrService } from 'ngx-toastr';
import { LoggingService } from './../../../core/services/logging.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-report',
  templateUrl: './time-report.component.html',
  styleUrls: ['./time-report.component.css']
})
export class TimeReportComponent implements OnInit {
  ReportPeriod: Date = new Date();
  totalHours = 0;
  totalPay = 0;
  role: RoleModel;
  constructor(private logging: LoggingService, private spinner: NgxSpinnerService, private roleService: RoleService, private toastr: ToastrService, private capturedTimeService: TimecaptureService) {
    this.role = new RoleModel(0, '', 0);
  }

  ngOnInit() {
    this.spinner.show();
    this.roleService.GetRolePerUserId(Number.parseInt(localStorage.getItem("userId"))).subscribe(
      result => {
        if (result !== null) {
          this.role = result;
        }

        this.logging.logDebug('RolePerUser result', result);
        this.spinner.hide();
      }, err => {
      this.logging.logError('RolePerUser Error', err);
      this.spinner.hide();
    }
    );
  }

  DateChange(event) {
    this.spinner.show();
    this.capturedTimeService.TotalHoursPerUser(event.value, localStorage.getItem("userId")).subscribe(result => {
      this.totalHours = result.TotalHours;
      this.logging.logDebug('TotalHoursPerUser result', result);
      this.spinner.hide();
    }, err => {
      this.logging.logError('TotalHoursPerUser Error', err);
      this.spinner.hide();
    });

    this.spinner.show();
    this.capturedTimeService.TotalPayPerUser(event.value, localStorage.getItem("userId")).subscribe(result => {
      this.totalPay = result.TotalPay;
      this.logging.logDebug('TotalPayPerUser result', result);
      this.spinner.hide();
    }, err => {
      this.logging.logError('TotalPayPerUser Error', err);
      this.spinner.hide();
    });
  }

}
