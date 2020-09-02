import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor(private toastr: ToastrService) { }

  logDebug(description: string, message) {
    if(environment.enableDebugLogging)
    {
      console.log(description, message);
    }
  }

  logError(description: string, message) {
    console.error(description, message);
    this.toastr.error(message, description);
  }

}
