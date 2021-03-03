import { ToastrService } from 'ngx-toastr';
import { LoggingService } from './../../core/services/logging.service';
import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private logging: LoggingService, private authService: AuthService,
    private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) {

  }

  ngOnInit() {
    if (localStorage.getItem('token') != null) {
      this.router.navigateByUrl('/');
      this.authService.menuVisibleEmitter.next(true);
    }
  }

  onSubmit(form: NgForm) {
    this.spinner.show();
    this.logging.logDebug('LoginForm => ', form.value);
    console.log('Submitted');
    this.authService.login(form.value).subscribe(
      result => {
        this.logging.logDebug('LoginResult => ', result);
        localStorage.setItem('token', result.token);
        localStorage.setItem('userName', result.user.UserName);
        localStorage.setItem('userId', result.user.Id);
        localStorage.setItem("refreshToken", result.refreshToken);
        this.authService.menuVisibleEmitter.next(true);
        this.router.navigateByUrl('/');
        this.spinner.hide();
        this.toastr.success("You have successfully logged in.", "Login Succeeded");
      },
      err => {
        if (err.status === 400) {

          this.logging.logError('Login Error', err.error.message);
        }
        else if (err.status === 401){
          this.logging.logError('Login Error', 'Your session has expired and you have been logged out');
        }

        this.spinner.hide();
      }
    );
    form.reset();
  }

}
