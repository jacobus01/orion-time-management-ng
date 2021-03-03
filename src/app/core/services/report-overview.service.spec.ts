/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ReportOverviewService } from './report-overview.service';

describe('Service: ReportOverview', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportOverviewService]
    });
  });

  it('should ...', inject([ReportOverviewService], (service: ReportOverviewService) => {
    expect(service).toBeTruthy();
  }));
});
