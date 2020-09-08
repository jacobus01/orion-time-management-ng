import { CapturedTimeModel } from './../../core/models/capturedtime.model';
import { LoggingService } from './../../core/services/logging.service';
import { EmployeeModel } from './../../core/models/employee.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from 'rxjs';
import { TimecaptureService } from 'src/app/core/services/timecapture.service';

@Injectable({
  providedIn: 'root'
})
export class TimecaptureStateManagementService {
  selectedEmployee: EmployeeModel;
  timeCaptureHourSegmentShowModalEmitter = new Subject<any>();
  timeCaptureHandleEventShowModalEmitter = new Subject<any>();
  selectedEmployeeEmitter = new Subject<any>();
  capturedTimeCreatedEmitter = new Subject<any>();
  capturedTimeDeletedEmitter = new Subject<any>();
  constructor(private auth: AuthService,
    private timeCapture: TimecaptureService,
    private logging: LoggingService,
    private spinner: NgxSpinnerService
  ) { }

  getEmployees(): Observable<any> {
    return this.auth.listUsers();
  }

  createUpdateCapturedTime(capturedTime): Observable<any> {
    return this.timeCapture.CreateUpdateCapturedTime(capturedTime);
  }
  deleteCapturedTime(Id): Observable<any> {
    return this.timeCapture.deleteCapturedTime(Id);
  }

  createCapturedTimeCalendarEvent(capturedTimeCalendarEvent) {
    this.capturedTimeCreatedEmitter.next(capturedTimeCalendarEvent);
  }
  deleteCapturedTimeCalendarEvent(capturedTimeCalendarEvent) {
    this.capturedTimeDeletedEmitter.next(capturedTimeCalendarEvent);
  }

  listCapturedTimesPerUser(params): Observable<any> {
    return this.timeCapture.listCapturedTimesPerUser(params);
  }

}


