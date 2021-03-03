import { ErrorHandler, Injectable } from '@angular/core';
import { environment} from '../../../environments/environment';

@Injectable(
  {providedIn: 'root'}
)
export class GlobalErrorHandlerService implements ErrorHandler {

    handleError(error) {
      if (environment.enableGlobalErrors){
        const msg = '-------\n-Error-\n-------';
        console.log(
         `%c${msg}`,
         `color: red; font-weight: bold; font-size: 5rem
         ; text-shadow: 0 0 20px rgba(0,0,0,0.2);`
        );
      }
      else{
        console.error(error);
      }
   }
}
