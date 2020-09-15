import { ReportOverviewComponent } from './pages/reports/report-overview/report-overview.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './pages/employees/employees.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { RolesComponent } from './pages/roles/roles.component';
import { TimecaptureComponent } from './pages/timecapture/timecapture.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';


const routes: Routes = [
  {path: '' , component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard]},
  {path: 'roles', component: RolesComponent, canActivate: [AuthGuard]},
  {path: 'tasks', component: TasksComponent, canActivate: [AuthGuard]},
  {path: 'timecapture', component: TimecaptureComponent, canActivate: [AuthGuard]},
  {path: 'reportOverview', component: ReportOverviewComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
