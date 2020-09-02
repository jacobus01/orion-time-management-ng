import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.css']
})
export class RolesTableComponent implements OnInit {

  public settings = {
    columns: {
      id: {
        title: 'ID'
      },
      roleName: {
        title: 'Role Name'
      },
      rate: {
        title: 'Rate'
      }
    }
  };

  public data = [
    {
      id: 1,
      roleName: "Casual Employee Level 1",
      rate: "R500.00"
    },
    {
      id: 2,
      roleName: "Casual Employee Level 2",
      rate: "R700.00"
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
