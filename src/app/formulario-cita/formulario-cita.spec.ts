import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendacionCitasComponent } from './formulario-cita';

describe('FormularioCita', () => {
  let component: AgendacionCitasComponent;
  let fixture: ComponentFixture<AgendacionCitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendacionCitasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendacionCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
