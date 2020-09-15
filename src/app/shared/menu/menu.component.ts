import { LoggingService } from './../../core/services/logging.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AccessgroupService } from 'src/app/core/services/accessgroup.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  showMenu = false;
  username = 'User';
  showEmployee = false;
  showRoles = false;
  showTasks = false;
  userAccessGroupName: string;
  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthService, private accessGroupService: AccessgroupService, private router: Router, private toastr: ToastrService, private logging: LoggingService) {
    if (localStorage.getItem('token') !== null)
    {
      this.logging.logDebug('User Access Token', localStorage.getItem('token'));
      this.showMenu = true;
      this.username = localStorage.getItem('userName');
      this.accessGroupService.getAccessgroupByUserId(Number.parseInt(localStorage.getItem('userId'))).subscribe(
        result1 => {
          this.userAccessGroupName = result1.AccessGroupName;
          this.logging.logDebug('User Access Level =>', result1.AccessGroupName);
          if (this.userAccessGroupName === 'Admin') {
            this.showEmployee = true;
            this.showRoles = true;
            this.showTasks = true;
          }
          else{
            this.showEmployee = false;
            this.showRoles = false;
            this.showTasks = false;
          }
        }
      );
    }
    else
    {
      this.logging.logDebug('User menu check =>', 'token is null');
      this.showMenu = false;
    }
    // tslint:disable-next-line: radix

  }

  ngOnInit() {
    this.authService.menuVisibleEmitter.subscribe(result => {
      this.showMenu = result;
      this.username = localStorage.getItem('userName');
      this.accessGroupService.getAccessgroupByUserId(Number.parseInt(localStorage.getItem('userId'))).subscribe(
        result1 => {
          this.userAccessGroupName = result1.AccessGroupName;
          this.logging.logDebug('User Access Level =>', result1.AccessGroupName);
          if (this.userAccessGroupName === 'Admin') {
            this.showEmployee = true;
            this.showRoles = true;
            this.showTasks = true;
          }
          else{
            this.showEmployee = false;
            this.showRoles = false;
            this.showTasks = false;
          }
        }
      );
    }, err => {
      this.logging.logError('menuVisible error =>', err);
    }, () => {
      this.logging.logDebug('menuEmmiter Done =>', 'Done');

    });


  }

  onLogoff() {
    localStorage.removeItem('token');
    this.authService.menuVisibleEmitter.next(false);
    this.router.navigate(['login']);
    this.toastr.success('You have successfully logged off","Log Off Successful');
  }

}
