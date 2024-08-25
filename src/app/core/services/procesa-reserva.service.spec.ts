import { TestBed } from '@angular/core/testing';

import { ProcesaReservaService } from './procesa-reserva.service';

describe('ProcesaReservaService', () => {
  let service: ProcesaReservaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcesaReservaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
