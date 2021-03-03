import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  logDebug(description: string, message) {
    console.log(description, message);
  }

  logError(description: string, message) {
    console.error(description, message);
  }
  logSuccess(description: string, message) {
    console.info(description, message);
  }

  logWarn(description: string, message) {
    console.warn(description, message);
  }

  logInfo(description: string, message) {
    console.info(description, message);
  }

}
