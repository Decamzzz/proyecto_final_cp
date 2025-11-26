import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCitasMedicoComponent } from './gestion-citas-medico';

describe('GestionCitasMedicoComponent', () => {
  let component: GestionCitasMedicoComponent;
  let fixture: ComponentFixture<GestionCitasMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCitasMedicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCitasMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
