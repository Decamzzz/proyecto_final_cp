import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizacionDatosMedicoComponent } from './actualizacion-datos-medico';

describe('ActualizacionDatosMedico', () => {
  let component: ActualizacionDatosMedicoComponent;
  let fixture: ComponentFixture<ActualizacionDatosMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizacionDatosMedicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizacionDatosMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
