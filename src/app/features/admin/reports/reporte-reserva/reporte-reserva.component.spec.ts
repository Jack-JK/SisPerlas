import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteReservaComponent } from './reporte-reserva.component';

describe('ReporteReservaComponent', () => {
  let component: ReporteReservaComponent;
  let fixture: ComponentFixture<ReporteReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
