import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizacionDatosAdminComponent } from './actualizar-datos-admin';

describe('ActualizarDatosAdmin', () => {
  let component: ActualizacionDatosAdminComponent;
  let fixture: ComponentFixture<ActualizacionDatosAdminComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizacionDatosAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizacionDatosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
