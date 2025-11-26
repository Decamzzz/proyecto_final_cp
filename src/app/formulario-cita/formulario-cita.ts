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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Servicios
import { CitasService } from '../services/citas.service';
import { LoginService } from '../services/login.service';

@Component({
  standalone: true,
  selector: 'app-agendacion-citas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    TextareaModule,
    DividerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './formulario-cita.html',
  styleUrls: ['./formulario-cita.css']
})
export class AgendacionCitasComponent {
  agendacionForm: FormGroup;
  minDate: Date;
  loading: boolean = false;
  
  horasDisponibles = [
    { label: '08:00 AM - 09:00 AM', value: '08:00 AM - 09:00 AM' },
    { label: '09:00 AM - 10:00 AM', value: '09:00 AM - 10:00 AM' },
    { label: '10:00 AM - 11:00 AM', value: '10:00 AM - 11:00 AM' },
    { label: '11:00 AM - 12:00 PM', value: '11:00 AM - 12:00 PM' },
    { label: '02:00 PM - 03:00 PM', value: '02:00 PM - 03:00 PM' },
    { label: '03:00 PM - 04:00 PM', value: '03:00 PM - 04:00 PM' },
    { label: '04:00 PM - 05:00 PM', value: '04:00 PM - 05:00 PM' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private citasService: CitasService,
    private loginService: LoginService,
    private messageService: MessageService
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
      this.loading = true;

      const usuarioActual = this.loginService.getUsuarioActual();
      if (!usuarioActual) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.',
          life: 5000
        });
        this.loading = false;
        return;
      }

      // Obtener solo el valor string de horaCita
      const horaCitaValue = typeof this.agendacionForm.value.horaCita === 'object' 
        ? this.agendacionForm.value.horaCita.value 
        : this.agendacionForm.value.horaCita;

      // Formatear la fecha correctamente (solo fecha, sin hora)
      const fechaCita = new Date(this.agendacionForm.value.fechaCita);
      const fechaFormateada = fechaCita.toISOString().split('T')[0]; // Solo YYYY-MM-DD

      const citaData = {
        pacienteId: usuarioActual.id,
        medicoNumeroTarjetaProfesional: this.agendacionForm.value.tarjetaProfesional,
        fechaCita: fechaFormateada, // Solo la fecha
        horaCita: horaCitaValue, // Solo el string, no el objeto
        motivoConsulta: this.agendacionForm.value.motivoConsulta
      };

      console.log('Datos corregidos a enviar:', JSON.stringify(citaData, null, 2));

      this.citasService.agendarCita(citaData).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Cita Agendada',
              detail: response.message,
              life: 5000
            });
            
            setTimeout(() => {
              this.router.navigate(['/paciente-dashboard']);
            }, 2000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
              life: 5000
            });
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error completo al agendar cita:', error);
          console.error('Detalles del error:', error.error);
          
          let errorMessage = 'No se pudo agendar la cita. Intente nuevamente.';
          if (error.error?.errors) {
            const validationErrors = error.error.errors;
            errorMessage = 'Errores de validación: ' + JSON.stringify(validationErrors);
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    } else {
      Object.keys(this.agendacionForm.controls).forEach(key => {
        this.agendacionForm.get(key)?.markAsTouched();
      });
      
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Incompleto',
        detail: 'Por favor complete todos los campos requeridos correctamente.',
        life: 4000
      });
    }
  }

  onVolver() {
    this.router.navigate(['/paciente-dashboard']);
  }
}
