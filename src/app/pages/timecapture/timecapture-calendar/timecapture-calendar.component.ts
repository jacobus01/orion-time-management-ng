import { logging } from 'protractor';
import { TimecaptureStateManagementService } from './../timecapture-state-management.service';
import { ToastrService } from 'ngx-toastr';
import { TimecaptureService } from './../../../core/services/timecapture.service';
import { LoggingService } from './../../../core/services/logging.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
  Input
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EmployeeModel } from 'src/app/core/models/employee.model';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-timecapture-calendar',
  templateUrl: './timecapture-calendar.component.html',
  styleUrls: ['./timecapture-calendar.component.css']
})
export class TimecaptureCalendarComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @Input() selectedEmployee: EmployeeModel;
  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  private destroy$ = new Subject();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
    private logging: LoggingService,
    private timecaptureStateManagementService: TimecaptureStateManagementService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.timecaptureStateManagementService.capturedTimeCreatedEmitter.subscribe(result => {
      this.logging.logDebug('CreateNewCalendarEvent', result);
      this.addEvent(result);
    },
      err => {
        this.logging.logError('CreateNewCalendarEvent Error', err);
      });
    const loadStartDate = new Date();
    const loadEndDate = new Date();
    loadStartDate.setDate(1);
    loadEndDate.setDate(28);
    this.timecaptureStateManagementService.listCapturedTimesPerUser(
      {
        StartDate: loadStartDate.toDateString(),
        EndDate: loadEndDate.toDateString(),
        UserId: this.selectedEmployee.Id
      }).subscribe(result => {
        const loadedEvents = [];
        for (const event of result) {
          loadedEvents.push(
            {
              start: new Date(event.StartTime),
              end: new Date(event.EndTime),
              title: event.TaskName,
              color: colors.blue,
              actions: this.actions,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              draggable: true,
            }
          );
        }
        this.events = loadedEvents;
        this.logging.logDebug('loadCalendarEvents', result);
      },
        err => {
          this.logging.logError('loadCalendarEvents Error', err);
        });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
  }

  addEvent(newEvent): void {
    this.events = [
      ...this.events,
      {
        start: new Date(newEvent.StartTime),
        end: new Date(newEvent.EndTime),
        title: newEvent.eventName,
        color: colors.blue,
        actions: this.actions,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  hourSegmentClicked(date) {
    this.logging.logDebug('Timecapture hoursegment click =>', date);
    this.timecaptureStateManagementService.timeCaptureShowModalEmitter.next(date);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
