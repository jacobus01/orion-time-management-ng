import { ToastrService } from 'ngx-toastr';
import { TimecaptureService } from './../../../core/services/timecapture.service';
import { LoggingService } from './../../../core/services/logging.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-timecapture-calendar',
  templateUrl: './timecapture-calendar.component.html',
  styleUrls: ['./timecapture-calendar.component.css']
})
export class TimecaptureCalendarComponent implements OnInit, OnDestroy {
  view: CalendarView = CalendarView.Week;

  viewDate: Date = new Date();

  daysInWeek = 7;

  private destroy$ = new Subject();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private logging: LoggingService,
    private timecaptureService: TimecaptureService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const CALENDAR_RESPONSIVE = {
      small: {
        breakpoint: '(max-width: 576px)',
        daysInWeek: 2,
      },
      medium: {
        breakpoint: '(max-width: 768px)',
        daysInWeek: 3,
      },
      large: {
        breakpoint: '(max-width: 960px)',
        daysInWeek: 5,
      },
    };

    this.breakpointObserver
      .observe(
        Object.values(CALENDAR_RESPONSIVE).map(({ breakpoint }) => breakpoint)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        const foundBreakpoint = Object.values(CALENDAR_RESPONSIVE).find(
          ({ breakpoint }) => !!state.breakpoints[breakpoint]
        );
        if (foundBreakpoint) {
          this.daysInWeek = foundBreakpoint.daysInWeek;
        } else {
          this.daysInWeek = 7;
        }
        this.cd.markForCheck();
      });
  }
  hourSegmentClicked(date)
  {
    this.logging.logDebug('Timecapture hoursegment click =>', date);
    this.timecaptureService.timecaptureShowModalEmitter.next(date);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
