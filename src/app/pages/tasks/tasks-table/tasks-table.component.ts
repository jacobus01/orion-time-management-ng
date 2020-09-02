import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.css']
})
export class TasksTableComponent implements OnInit {
  public settings = {
    columns: {
      id: {
        title: 'ID'
      },
      taskName: {
        title: 'Task Name'
      },
      duration: {
        title: 'Duration'
      }
    }
  };

  public data = [
    {
      id: 1,
      taskName: "task 1",
      duration: "8"
    },
    {
      id: 2,
      taskName: "task 2",
      duration: "4"
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
