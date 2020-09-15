import { TimecaptureStateManagementService } from './../timecapture-state-management.service';
import { ToastrService } from 'ngx-toastr';
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
import { Subject } from 'rxjs';
import {
  isSameDay,
  isSameMonth,
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
  green: {
    color: '#0c9b0c',
    background: '#a0f1a0',
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
    event: CalendarEvent<{ id: number, userId: number, taskId: number, rate: number }>;
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

  events: CalendarEvent<{ id: number, userId: number, taskId: number, rate: number, colorId: number }>[] = [];

  activeDayIsOpen: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
    private logging: LoggingService,
    private timecaptureStateManagementService: TimecaptureStateManagementService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.timecaptureStateManagementService.ResetCalendar.subscribe(
      result => {
        if (result) {
          this.ResetValues();
        }
      }, err => {
        this.logging.logError('Calander Reset Error', err);
      }
    );

    this.timecaptureStateManagementService.capturedTimeCreatedEmitter.subscribe(result => {
      this.logging.logDebug('CreateNewCalendarEvent', result);
      if (this.events.filter(e => e.meta.id === result.Id).length > 0) {
        // logic for update
        this.deleteEvent(
          {
            start: new Date(result.StartTime),
            end: new Date(result.EndTime),
            title: result.eventName,
            color: result.Color !== 0 ? result.Color !== 1 ? result.Color !== 2 ? colors.green : colors.yellow : colors.red : colors.blue,
            actions: this.actions,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,
            meta: {
              id: result.Id,
              userId: result.UserId,
              taskId: result.TaskId,
              rate: result.Rate,
            }
          });
        this.addEvent(result);
      }
      else {
        // logiv for add
        this.addEvent(result);
      }

    },
      err => {
        this.logging.logError('CreateNewCalendarEvent Error', err);
      });
    this.timecaptureStateManagementService.capturedTimeDeletedEmitter.subscribe(result => {
      this.logging.logDebug('deleteCalendarEvent', result);
      this.deleteEvent(result);
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
        this.logging.logDebug('Captured times per user from database', result);
        const loadedEvents = [];
        for (const event of result) {
          this.logging.logDebug('Captured time per user from database', event);
          loadedEvents.push(
            {
              start: new Date(event.StartTime),
              end: new Date(event.EndTime),
              title: event.TaskName,
              color: event.Color !== 0 ? event.Color !== 1 ? event.Color !== 2 ? colors.green : colors.yellow : colors.red : colors.blue,
              actions: this.actions,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              meta: {
                id: event.Id,
                userId: event.UserId,
                taskId: event.TaskId,
                rate: event.Rate,
                colorId: event.Color
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

  ResetValues() {
    this.logging.logDebug('Reset Calendar', 'clear');
    this.events = [];
  }

  dayClicked({ date, events }: {
    date: Date; events:
    CalendarEvent<{ id: number, userId: number, taskId: number, colorId: number, rate: number }>[]
  }): void {
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
    this.logging.logDebug('event changed =>', event);
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent<{ id: number, userId: number, taskId: number, colorId: number, rate: number }>): void {
    this.logging.logDebug('Timecapture event click =>', event);
    this.timecaptureStateManagementService.timeCaptureHandleEventShowModalEmitter.next(event);
  }

  addEvent(newEvent): void {
    this.events = [
      ...this.events,
      {
        start: new Date(newEvent.StartTime),
        end: new Date(newEvent.EndTime),
        title: newEvent.eventName,
        color: newEvent.Color !== 0 ? newEvent.Color !== 1 ? newEvent.Color !== 2 ? colors.green : colors.yellow : colors.red : colors.blue,
        actions: this.actions,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
        meta: {
          id: newEvent.Id,
          userId: newEvent.UserId,
          taskId: newEvent.TaskId,
          rate: newEvent.Rate,
          colorId: newEvent.Color
        },
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent<{ id: number, userId: number, taskId: number, rate: number }>) {
    this.events = this.events.filter((event) => event.meta.id !== eventToDelete.meta.id);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  hourSegmentClicked(date) {
    this.logging.logDebug('Timecapture hoursegment click =>', date);
    this.timecaptureStateManagementService.timeCaptureHourSegmentShowModalEmitter.next(date);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
