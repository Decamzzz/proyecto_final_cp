import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizacionDatosComponent } from './update-data-user';

describe('UpdateDataUser', () => {
  let component: ActualizacionDatosComponent;
  let fixture: ComponentFixture<ActualizacionDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizacionDatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizacionDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
