import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value): string {
    if (this.validateTime(value))
    {
      return value;
    }
    return value;
  }

  validateTime(time) {
    const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return time.match(timeReg);
  }

}
