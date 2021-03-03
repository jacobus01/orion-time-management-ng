import { UtilsService } from './../../core/services/utils.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DateFormatPipe, DifferencePipe, FromUnixPipe } from 'ngx-moment';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.css']
})
export class DevComponent implements OnInit, OnDestroy {

  currentDateTime?: Date
  currentToken?: string;
  currentUserName?: string;
  currentUserId?: string;
  currentRefreshToken?: string;
  currentDecodedToken?;
  decodedUserId?: string;
  decodedValidAudience?: string;
  decodedValidIssuer?: string;
  decodedExpirationTime?
  ttl?;
  countdown?;
  private subscription: Subscription;

  constructor(private utils: UtilsService,
     private jwtHelper: JwtHelperService,
     private fromUnixPipe : FromUnixPipe,
     private dateFormatPipe : DateFormatPipe,
     private differencePipe : DifferencePipe) { }

  ngOnInit() {
    this.currentToken = localStorage.getItem('token');
    this.currentUserName = localStorage.getItem('userName');
    this.currentUserId = localStorage.getItem('userId');
    this.currentRefreshToken = localStorage.getItem("refreshToken");
    this.currentDecodedToken = this.jwtHelper.decodeToken(this.currentToken);
    this.decodedUserId = this.currentDecodedToken.UserID;
    this.decodedValidAudience = this.currentDecodedToken.aud;
    this.decodedValidIssuer = this.currentDecodedToken.iss;
    this.decodedExpirationTime = this.currentDecodedToken.exp;
    this.subscription = interval(1000)
    .subscribe(x => { this.getTimeDifference(); });


  }

  private getTimeDifference () {
    const currDateTime = this.dateFormatPipe.transform( new Date().toString(),'YYYY-MM-DD HH:mm:ss');
    const expDate = this.dateFormatPipe.transform(this.fromUnixPipe.transform(this.decodedExpirationTime), 'YYYY-MM-DD HH:mm:ss');

    this.ttl = this.differencePipe.transform(expDate,currDateTime,'seconds',true);
    this.countdown = new Date(parseInt(this.ttl) * 1000).toISOString().substr(11, 8)
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
 }

  testAllNotifications()
  {
    this.utils.logDebug('This is a test Debug Notification', 'Test Debug', 'Test Debug', 'Dev Tools Component');
    this.utils.logInfo('This is a test Info Notification', 'Test Info', 'Test Info', 'Dev Tools Component');
    this.utils.logWarn('This is a test Warning Notification', 'Test Warning', 'Test Warning', 'Dev Tools Component');
    this.utils.logSuccess('This is a test Success Notification', 'Test Success', 'Test Success', 'Dev Tools Component');
    this.utils.logError('This is a test Error Notification', 'Test Error', 'Test Error', 'Dev Tools Component');
  }

}
