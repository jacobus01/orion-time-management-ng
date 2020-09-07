import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  roleShowModalEventEmitter = new Subject<boolean>();
  selectedRoleEmitter = new Subject<any>();
  constructor(private http: HttpService) { }

  listRoles(): Observable<any> {
    return this.http.get('role/roles');
  }

  getRoleById(Id: number): Observable<any> {
    return this.http.post('role/role', Id);
  }

  CreateUpdateRole(role): Observable<any>
 {
   return this.http.post('role/createupdaterole', role);
 }

}
