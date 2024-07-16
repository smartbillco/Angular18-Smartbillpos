import { TestBed } from '@angular/core/testing';

import { InvoiceProcessingService } from './invoice-processing.service';

describe('InvoiceProcessingService', () => {
  let service: InvoiceProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
