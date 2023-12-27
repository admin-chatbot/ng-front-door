import { TestBed } from '@angular/core/testing';

import { ServiceParameterService } from './service-parameter.service';

describe('ServiceParameterService', () => {
  let service: ServiceParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
