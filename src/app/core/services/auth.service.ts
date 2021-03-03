import { UtilsService } from './utils.service';
import { Observable, observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
menuVisibleEmitter = new Subject<boolean>();
menuUsernameEmitter = new Subject<string>();
employeeShowModalEmitter = new Subject<boolean>();
selectedEmployeeEmitter = new Subject<any>();
profileImageUploadedEmitter = new Subject<boolean>();

refreshEmployeeTableEmitter = new Subject<string>();

constructor(private http: HttpService, private utils: UtilsService) {
 }

 login(credentials): Observable<any>
 {
    return this.http.post('applicationuser/login', credentials);
 }

 refresh(credentials): Observable<any>
 {
    this.utils.logInfo("Refreshing Token",'Refreshing Token','Info Refresh Token', 'AuthService');
    return this.http.post('applicationuser/refresh', credentials);

 }

 listUsers(): Observable<any>
 {
   return this.http.get('applicationuser/users');
 }
 getUserById(userId): Observable<any>
 {
   return this.http.post('applicationuser/user', userId);
 }

 CreateUpdateUser(user): Observable<any>
 {
   return this.http.post('applicationuser/createupdateuser', user);
 }

 getProfilePic(userId)
 {
   return `${environment.baseURL}/applicationuser/profilepic?id=${userId}`;
 }

 DeleteUser(userId): Observable<number>
 {
   return this.http.post('applicationuser/deleteuser', userId);
 }

 IsUserNameUnused(UserName): Observable<any>
 {
   return this.http.post('applicationuser/usernameunused', UserName);
 }

}
