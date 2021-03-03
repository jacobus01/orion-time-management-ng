import { environment } from './../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { LoggingService } from './logging.service';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  loggingDebugging: boolean = false;
  toastDebugging: boolean = false;
  loggingInfo: boolean = false;
  toastInfo: boolean = false;
  loggingWarn: boolean = false;
  toastWarn: boolean = false;
  loggingSuccess: boolean = false;
  toastSuccess: boolean = false;
  loggingError: boolean = false;
  toastError: boolean = false;
  useGlobalError: boolean = false;

  constructor(private logging: LoggingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    this.loggingDebugging = environment.enableDebugLogging;
    this.toastDebugging = environment.enableDebugToast;
    this.loggingInfo = environment.enableInfoLogging;
    this.toastInfo = environment.enableInfoToast;
    this.loggingWarn = environment.enableWarnLogging;
    this.toastWarn = environment.enableWarnToast;
    this.loggingSuccess = environment.enableSuccessLogging;
    this.toastSuccess = environment.enableSuccessToast;
    this.loggingError = environment.enableErrorLogging;
    this.toastError = environment.enableErrorToast;

  }

  showLoader() {
    this.spinner.show();
  }
  hideLoader() {
    this.spinner.hide();
  }

  logDebug(description: string, message, title: string = 'Debug', asset: string = '', forceToast: boolean = false, forceLog: boolean = false) {
    if (this.loggingInfo || forceLog) {
      this.logging.logDebug(title + ': ' + 'Asset => ' + asset + ' | ' + description, message);
    }
    if (this.toastInfo || forceToast) {
      this.toastr.info(title, 'Asset => ' + asset + ' | ' + description + ' | ' + message.toString());
    }
  }

  logInfo(description: string, message, title: string = 'Info', asset: string = '', forceToast: boolean = false, forceLog: boolean = false) {
    if (this.loggingInfo || forceLog) {
      this.logging.logInfo(title + ': ' + 'Asset => ' + asset + ' | ' + description, message);
    }
    if (this.toastInfo || forceToast) {
      this.toastr.info(title, 'Asset => ' + asset + ' | ' + description + ' | ' + message.toString());
    }
  }

  logWarn(description: string, message, title: string = 'Warning', asset: string = '', forceToast: boolean = false, forceLog: boolean = false) {
    if (this.loggingInfo || forceLog) {
      this.logging.logWarn(title + ': ' + 'Asset => ' + asset + ' | ' + description, message);
    }
    if (this.toastInfo || forceToast) {
      this.toastr.warning(title, 'Asset => ' + asset + ' | ' + description + ' | ' + message.toString());
    }
  }

  logSuccess(description: string, message, title: string = 'Success', asset: string = '', forceToast: boolean = false, forceLog: boolean = false) {
    if (this.loggingInfo || forceLog) {
      this.logging.logSuccess(title + ': ' + 'Asset => ' + asset + ' | ' + description, message);
    }
    if (this.toastInfo || forceToast) {
      this.toastr.success(title, 'Asset => ' + asset + ' | ' + description + ' | ' + message.toString());
    }
  }

  logError(description: string, message, title: string = 'Error', asset: string = '', forceToast: boolean = false, forceLog: boolean = false) {
    if (this.loggingInfo || forceLog) {
      this.logging.logError(title + ': ' + 'Asset => ' + asset + ' | ' + description, message);
    }
    if (this.toastInfo || forceToast) {
      this.toastr.error(title, 'Asset => ' + asset + ' | ' + description + ' | ' + message.toString());
    }
  }

  logCustom(description: string, message, title: string = '', asset: string = '', forceToast: boolean = false, forceLog: boolean = false) {
    if (this.loggingInfo || forceLog) {
      this.logging.logInfo(title + ': ' + 'Asset => ' + asset + ' | ' + description, message);
    }
    if (this.toastInfo || forceToast) {
      this.toastr.show(title, 'Asset => ' + asset + ' | ' + description + ' | ' + message.toString());
    }
  }
}
