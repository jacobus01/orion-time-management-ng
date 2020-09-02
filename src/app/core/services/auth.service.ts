import { Observable, observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
menuVisibleEmitter = new Subject<boolean>();
menuUsernameEmitter = new Subject<string>();
employeeShowModalEmitter = new Subject<boolean>();
selectedEmployeeEmitter = new Subject<any>();

constructor(private http: HttpService) {
 }

 login(credentials): Observable<any>
 {
    return this.http.post('applicationuser/login', credentials);
 }

 listUsers(): Observable<any>
 {
   return this.http.get('applicationuser/users');
 }

 getProfilePic(): Observable<any>
 {
   return this.http.get('applicationuser/profilepic');
 }

}
