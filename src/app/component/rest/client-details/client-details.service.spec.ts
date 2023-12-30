import { TestBed } from '@angular/core/testing';

import { ClientDetailsService } from './client-details.service';

describe('ClientDetailsService', () => {
  let service: ClientDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
