/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TimecaptureComponent } from './timecapture.component';

describe('TimecaptureComponent', () => {
  let component: TimecaptureComponent;
  let fixture: ComponentFixture<TimecaptureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimecaptureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimecaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
