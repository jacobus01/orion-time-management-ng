import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimecaptureService {
  timecaptureShowModalEmitter = new Subject<any>();
constructor() { }

}
