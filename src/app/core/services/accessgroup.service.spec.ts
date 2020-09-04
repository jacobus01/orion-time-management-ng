/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccessgroupService } from './accessgroup.service';

describe('Service: Accessgroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessgroupService]
    });
  });

  it('should ...', inject([AccessgroupService], (service: AccessgroupService) => {
    expect(service).toBeTruthy();
  }));
});
