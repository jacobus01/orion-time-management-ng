/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DevComponent } from './dev.component';

describe('DevComponent', () => {
  let component: DevComponent;
  let fixture: ComponentFixture<DevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
