/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TimecaptureAddComponent } from './timecapture-add.component';

describe('TimecaptureAddComponent', () => {
  let component: TimecaptureAddComponent;
  let fixture: ComponentFixture<TimecaptureAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimecaptureAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimecaptureAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
