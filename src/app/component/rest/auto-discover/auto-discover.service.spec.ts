import { TestBed } from '@angular/core/testing';

import { AutoDIscoverService } from './auto-discover.service';

describe('AutoDIscoverService', () => {
  let service: AutoDIscoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoDIscoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
