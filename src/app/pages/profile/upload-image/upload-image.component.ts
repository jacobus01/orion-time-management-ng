import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  public progress: number;
  public message: string;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http: HttpClient, private toastr: ToastrService, private auth: AuthService) { }
  ngOnInit() {
  }
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    const fileToUpload = files[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload, localStorage.getItem('userId'));
    this.http.post(environment.baseURL + '/image/UploadImage', formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        }
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
          this.toastr.success('Profile Picture Uploaded', 'Uploaded Successful');
          this.auth.profileImageUploadedEmitter.next(true);
        }
      });
  }

}
