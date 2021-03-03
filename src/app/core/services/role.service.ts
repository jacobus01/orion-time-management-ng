import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  roleShowModalEventEmitter = new Subject<boolean>();
  selectedRoleEmitter = new Subject<any>();
  refreshRoleTableEmitter = new Subject<string>();
  constructor(private http: HttpService) { }

  listRoles(): Observable<any> {
    return this.http.get('role/roles');
  }

  getRoleById(Id: number): Observable<any> {
    return this.http.post('role/role', Id);
  }

  GetRolePerUserId(UserId: number): Observable<any> {
    return this.http.post('role/roleperUser', UserId);
  }

  CreateUpdateRole(role): Observable<any>
 {
   return this.http.post('role/createupdaterole', role);
 }

}
