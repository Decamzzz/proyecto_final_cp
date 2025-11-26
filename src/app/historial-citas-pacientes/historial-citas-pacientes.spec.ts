import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCitasPacientes } from './historial-citas-pacientes';

describe('HistorialCitasPacientes', () => {
  let component: HistorialCitasPacientes;
  let fixture: ComponentFixture<HistorialCitasPacientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialCitasPacientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialCitasPacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
