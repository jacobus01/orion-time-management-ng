import { Component, ElementRef, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Orion Time Management';
  scrHeight: any;
  scrWidth: any;
  showDevTools:boolean = false;


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    $(document).ready(function() {
      $('#ctr').attr('style','height: ' + 1500 + ' px;');
    });
   $
    console.log(this.scrHeight, this.scrWidth);
  }

  ngOnInit()
  {

  }

   constructor() {
  //   this.getScreenSize();
  }
}
