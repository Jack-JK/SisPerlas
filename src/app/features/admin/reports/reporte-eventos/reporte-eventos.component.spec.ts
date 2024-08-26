import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEventosComponent } from './reporte-eventos.component';

describe('ReporteEventosComponent', () => {
  let component: ReporteEventosComponent;
  let fixture: ComponentFixture<ReporteEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteEventosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
