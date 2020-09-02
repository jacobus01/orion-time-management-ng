import { LoggingService } from './../../../core/services/logging.service';
import { TimecaptureService } from './../../../core/services/timecapture.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-timecapture-add',
  templateUrl: './timecapture-add.component.html',
  styleUrls: ['./timecapture-add.component.css']
})
export class TimecaptureAddComponent implements OnInit {

  constructor(private timecaptureService: TimecaptureService, private logging: LoggingService) { }

  ngOnInit() {
    this.timecaptureService.timecaptureShowModalEmitter.subscribe(result => {
      this.logging.logDebug('timecapture show modal event received', result);
      $('#timeModal').modal('show');
    }, err => {
      this.logging.logError('error showing timecapture add form', err);
    });
  }

}
