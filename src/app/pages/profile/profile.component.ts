import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

  }
  getpath()
  {
    const userid = localStorage.getItem('userId');
    return 'http://localhost:52368/ApplicationUser/profilepic?id=' + userid;
  }
}
