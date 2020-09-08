import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TimecaptureService {
  timecaptureShowModalEmitter = new Subject<any>();
constructor(private http: HttpService) { }

CreateUpdateCapturedTime(capturedTime): Observable<any>
 {
   return this.http.post('capturedtime/createupdatecapturedtime', capturedTime);
 }
 deleteCapturedTime(Id): Observable<any>
 {
   return this.http.post('capturedtime/deletecapturedtime', Id);
 }

 listCapturedTimesPerUser(params): Observable<any>
 {
   return this.http.post('capturedtime/CapturedTimesPerUser', params);
 }

}
