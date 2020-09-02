import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

constructor(private http: HttpService) { }

listTasks(): Observable<any>
 {
   return this.http.get('task/tasks');
 }

}
