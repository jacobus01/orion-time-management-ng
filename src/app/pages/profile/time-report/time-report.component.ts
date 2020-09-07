import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-report',
  templateUrl: './time-report.component.html',
  styleUrls: ['./time-report.component.css']
})
export class TimeReportComponent implements OnInit {
  ReportPeriod: Date = new Date();
  constructor() { }

  ngOnInit() {
  }

}
