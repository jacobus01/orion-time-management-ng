import { BrowserModule } from '@angular/platform-browser';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DpDatePickerModule} from 'ng2-date-picker';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './shared/menu/menu.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { EmployeeTableComponent } from './pages/employees/employee-table/employee-table.component';
import { EmployeeAddComponent } from './pages/employees/employee-add/employee-add.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { TasksTableComponent } from './pages/tasks/tasks-table/tasks-table.component';
import { TasksAddComponent } from './pages/tasks/tasks-add/tasks-add.component';
import { RolesComponent } from './pages/roles/roles.component';
import { RolesTableComponent } from './pages/roles/roles-table/roles-table.component';
import { RolesAddComponent } from './pages/roles/roles-add/roles-add.component';
import { TimecaptureComponent } from './pages/timecapture/timecapture.component';
import { TimecaptureCalendarComponent } from './pages/timecapture/timecapture-calendar/timecapture-calendar.component';
import { TimecaptureAddComponent } from './pages/timecapture/timecapture-add/timecapture-add.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { UploadImageComponent } from './pages/profile/upload-image/upload-image.component';
import { ProfileComponent } from './pages/profile/profile.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    EmployeesComponent,
    EmployeeTableComponent,
    EmployeeAddComponent,
    RolesComponent,
    RolesTableComponent,
    RolesAddComponent,
    TasksComponent,
    TasksTableComponent,
    TasksAddComponent,
    TimecaptureComponent,
    TimecaptureCalendarComponent,
    UploadImageComponent,
    ProfileComponent,
    TimecaptureAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    Ng2SmartTableModule,
    DpDatePickerModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: true,
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }