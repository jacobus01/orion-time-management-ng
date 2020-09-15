import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportOverviewService {

  constructor(private http: HttpService) {
  }

  TotalEmployees(): Observable<any> {
    return this.http.get('applicationuser/totalemployees');
  }
  EmployeesWithSubs(): Observable<any> {
    return this.http.get('applicationuser/employeeswithsubs');
  }

  TotalHours(date): Observable<any> {
    return this.http.post('capturedtime/totalhours', {Response: (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())});
  }

  TotalPay(date): Observable<any> {
    return this.http.post('capturedtime/totalpay', {Response: (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())});
  }

}
