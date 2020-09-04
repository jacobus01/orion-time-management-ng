import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

constructor(private http: HttpService) { }

listRoles(): Observable<any>
{
  return this.http.get('role/roles');
}

}
