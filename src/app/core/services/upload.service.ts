import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpService) { }


  upload(formData): Observable<any> {
    return this.http.post('image/UploadImage', formData, { reportProgress: true, observe: 'events' });
  }
}
