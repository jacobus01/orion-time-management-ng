import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskShowModalEventEmitter = new Subject<boolean>();
  selectedTaskEmitter = new Subject<any>();
constructor(private http: HttpService) { }

listTasks(): Observable<any>
 {
   return this.http.get('task/tasks');
 }

 getTaskById(Id: number): Observable<any> {
  return this.http.post('task/task', Id);
}

CreateUpdateRole(task): Observable<any>
{
  return this.http.post('task/createupdatetask', task);
}

}
