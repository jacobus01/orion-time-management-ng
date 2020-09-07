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
  userDetail: EmployeeModel;
  constructor(private authService: AuthService, private cdRef: ChangeDetectorRef, private logging: LoggingService, private spinner: NgxSpinnerService) {
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
    const rdmDate = new Date();
    const rdm = rdmDate.getMilliseconds();
    this.path = environment.baseURL + '/applicationuser/profilepic?id=' + localStorage.getItem('userId') + '&rdm=' + rdm;
  }

}
