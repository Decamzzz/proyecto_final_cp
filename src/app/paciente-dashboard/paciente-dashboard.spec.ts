import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteDashboardComponent } from './paciente-dashboard';

describe('PacienteDashboard', () => {
  let component: PacienteDashboardComponent;
  let fixture: ComponentFixture<PacienteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
