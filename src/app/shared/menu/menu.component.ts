import { EmployeeModel } from './../../core/models/employee.model';
import { LoggingService } from './../../core/services/logging.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  showMenu = false;
  username = 'User';
  constructor(private authService : AuthService, private router: Router, private toastr: ToastrService, private logging: LoggingService) {
    authService.menuVisibleEmitter.subscribe(result =>
      {
        this.showMenu = result;
        this.username = localStorage.getItem('userName');
      }, err => {
        this.logging.logError('menuVisible error =>', err);
      });
   }

  ngOnInit() {
  }

  onLogoff()
  {
    localStorage.removeItem('token');
    this.authService.menuVisibleEmitter.next(false);
    this.router.navigate(['login']);
    this.toastr.success('You have successfully logged off","Log Off Successful');
  }

}
