import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/core/services/task.service';
import { LoggingService } from 'src/app/core/services/logging.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.css']
})
export class TasksTableComponent implements OnInit {
  public settings = {
    columns: {
      Id: {
        title: 'ID'
      },
      TaskName: {
        title: 'Task Name'
      },
      Duration: {
        title: 'Duration'
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: true
    },
    attr:
    {
      class : 'table table-bordered table-hover'
    },
    pager:
    {
      display: true,
      perPage: 10
    },
    delete:
    {
      deleteButtonContent: '<span class=\'btn btn-primary\'>Delete</span>'
    }
  };

  public data = [
  ];
  constructor(private taskService: TaskService, private logging: LoggingService, private spinner : NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.taskService.listTasks()
    .pipe(map(taskData =>
      {
        const taskArray = [];
        for (const key in taskData)
        {
          if (taskData.hasOwnProperty(key))
          {
            taskArray.push(
              {
                ...taskData[key], rowNumber: key
              }
            );
          }
        }
        return taskArray;
      }))
    .subscribe(
      result =>
      {
        this.data = result;
        this.logging.logDebug('TasksResult => ', result);
        this.spinner.hide();
      },
      err =>
      {
        this.logging.logError('ListTasks Error' , err);
        this.spinner.hide();
      }
    );
  }

  onTaskRowSelect(event)
  {
    this.taskService.taskShowModalEventEmitter.next(true);
    this.taskService.selectedTaskEmitter.next({...event.data});
    this.logging.logDebug('ListTasks RowSelect', event);
  }

  onDeleteTask($event)
  {

  }
}
