import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AccessgroupService {

constructor(private http: HttpService) { }

listAccessGroups(): Observable<any>
{
  return this.http.get('accessgroup/accessgroups');
}

getAccessgroupByUserId(userId: number): Observable<any> {
  return this.http.post('accessgroup/accessgroupbyuser', userId);
}

}
