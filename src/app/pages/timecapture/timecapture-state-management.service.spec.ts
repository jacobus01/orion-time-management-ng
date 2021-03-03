/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { TimecaptureStateManagementService } from './timecapture-state-management.service';

describe('Service: TimecaptureStateManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimecaptureStateManagementService]
    });
  });

  it('should ...', inject([TimecaptureStateManagementService], (service: TimecaptureStateManagementService) => {
    expect(service).toBeTruthy();
  }));
});
