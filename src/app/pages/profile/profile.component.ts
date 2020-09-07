import { HttpService } from './../../core/services/http.service';
import { NgxSpinnerService} from 'ngx-spinner';
import { LoggingService } from './../../core/services/logging.service';
import { EmployeeModel } from './../../core/models/employee.model';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  path;
  userDetail: EmployeeModel =new EmployeeModel(
    0, '', '', false, '', '', '', '', new Date().toDateString(), false, 0, 0, false
  );
  constructor(private authService: AuthService, private cdRef: ChangeDetectorRef, private logging: LoggingService, private spinner: NgxSpinnerService, private http: HttpService) {
    this.getProfilePic();
    this.authService.profileImageUploadedEmitter.subscribe(result => {
      if (result) {
        console.log('refreshProfilePic');
        this.getProfilePic();
        this.cdRef.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.authService.getUserById(localStorage.getItem('userId')).subscribe(result => {
      this.spinner.show();
      this.userDetail = result;
      this.spinner.hide();
    },
    err =>
    {
      this.logging.logError('Profile Detail Error =>', err);
      this.spinner.hide();
    });

  }

  getProfilePic() {
    this.http.get('applicationuser/hasprofilepic?id=' + localStorage.getItem('userId')).subscribe(
      result =>
      {
        if (!result.message)
        {
          this.path = '/assets/img/noprofile.jpg';
        }
        else
        {
          this.logging.logDebug('has profile pic =>', result);
          this.path = environment.baseURL + '/applicationuser/profilepic?id=' + localStorage.getItem('userId');
        }
      }
    );

    const rdmDate = new Date();
    const rdm = rdmDate.getMilliseconds();
  }

}
