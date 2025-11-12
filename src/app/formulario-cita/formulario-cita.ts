import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-agendacion-citas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    TextareaModule,
    DividerModule
  ],
  templateUrl: './formulario-cita.html',
  styleUrl: './formulario-cita.css'
})
export class AgendacionCitasComponent {
  agendacionForm: FormGroup;
  minDate: Date;
  
  horasDisponibles = [
    { label: '08:00 AM', value: '08:00' },
    { label: '09:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '11:00 AM', value: '11:00' },
    { label: '02:00 PM', value: '14:00' },
    { label: '03:00 PM', value: '15:00' },
    { label: '04:00 PM', value: '16:00' },
    { label: '05:00 PM', value: '17:00' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.minDate = new Date();
    
    this.agendacionForm = this.fb.group({
      tarjetaProfesional: ['', [Validators.required, Validators.minLength(5)]],
      fechaCita: ['', [Validators.required]],
      horaCita: ['', [Validators.required]],
      motivoConsulta: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.agendacionForm.valid) {
      console.log('Solicitud de cita:', this.agendacionForm.value);
      // Aquí iría la lógica para enviar la solicitud
      alert('Solicitud de cita enviada exitosamente');
      this.router.navigate(['/dashboard']);
    } else {
      Object.keys(this.agendacionForm.controls).forEach(key => {
        this.agendacionForm.get(key)?.markAsTouched();
      });
    }
  }

  onVolver() {
    this.router.navigate(['/dashboard']); // O la ruta que corresponda
  }
}
