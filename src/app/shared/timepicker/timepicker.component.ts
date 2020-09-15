import { Component, OnInit, Input, OnChanges, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.css']
})
export class TimepickerComponent implements OnInit, OnChanges {
  selectedTime = '00:00';
  @Input() selectedDate: Date;
  @Input() pickedDateEventEmitter = new Subject<any>();
  @Input() useSecond: boolean;
  isMouseDown = false;
  tpClass = 'form-control';
  mousePosY = 0;
  prevTime = '00:00';
  constructor() {
  }

  ngOnInit() {
    if (this.selectedDate === undefined) {
      console.log('init selectedDate', this.selectedDate);
      const initTime = new Date();
      const hours = this.formatHours(initTime.getHours()) + ':00';
      this.selectedTime = hours;
      this.prevTime = hours;
    }
    else {
      this.formatTime(this.selectedDate.getHours(), this.selectedDate.getMinutes());
    }
  }

  ngOnChanges(changes) {
    console.log(changes);
    if (changes.editing) {
    }
  }

  formatHours(hours) {
    return hours > 9 ? '' + hours : '0' + hours;
  }

  OnMouseDown(event) {
    this.isMouseDown = true;
    console.log('mousedown event', event);
    this.mousePosY = event.clientY;
    this.prevTime = this.selectedTime;
  }
  OnMouseMove(event) {
    if (this.isMouseDown) {
      if (this.mousePosY > event.clientY) {
        this.setImputVal(true);
      }
      else {
        this.setImputVal(false);
      }
      this.mousePosY = event.clientY;
    }
  }

  OnMouseUp(event) {
    this.isMouseDown = false;
  }
  // TODO Not detecting
  OnBlur(val) {
    console.log('blur event=>', val);
    if (!this.validateTime(val)) {
      this.selectedTime = val;

    }
    else {

      val = this.prevTime;

    }
  }
  OnkeyPress(event: Event) {
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':'];



    console.log('keypress event=>', event);
    event.preventDefault();
  }

  OnUpClick() {
    this.setImputVal(true);
  }

  OnDownClick() {
    this.setImputVal(false);
  }

  setImputVal(IsIncrement: boolean) {
    let hour = Number.parseInt(this.selectedTime.substring(0, 2));
    let min = Number.parseInt(this.selectedTime.substring(3, 5));
    console.log('hour', this.selectedTime.substring(0, 2));
    console.log('min', this.selectedTime.substring(3, 5));
    if (IsIncrement) {
      if (min === 30) {
        if (hour < 23) {
          hour = hour + 1;
          min = 0;
        }
      }
      else {
        min = 30;
      }
    }
    else {
      if (min === 30) {
        min = 0;
      }
      else {
        if (hour >= 1) {
          hour = hour - 1;
          min = 30;
        }
      }
    }
    this.formatTime(hour, min);
  }

  formatTime(hour: number, min: number) {

    this.selectedTime = (hour > 9 ? '' + hour : '0' + hour) + ':' + (min > 9 ? '' + min : '0' + min);


    this.selectedDate.setHours(hour);
    this.selectedDate.setMinutes(min);
    this.pickedDateEventEmitter.next(this.selectedDate);
  }

  validateTime(time) {
    console.log('validate time value=>', time);
    if (time !== undefined && time.length === 5) {
      console.log('length checked', true);
      const isHour = !Number.isNaN(time.substring(0, 2));
      console.log('isHour', isHour);
      const isMin = !Number.isNaN(time.substring(3, 5));
      console.log('isMin', isMin);
      const seperator = time.substring(2, 3);
      console.log('seperator', seperator);
      if (seperator === ':' && isHour && isMin) {
        console.log('Return validtime true', true);
        return true;
      }
    }
    return false;
  }
}
