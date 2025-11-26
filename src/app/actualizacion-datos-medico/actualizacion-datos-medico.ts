import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Servicios
import { MedicoService } from '../services/medico.service';
import { LoginService } from '../services/login.service';

interface Medico {
  id: number;
  numeroIdentificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  especialidad: string;
  numeroTarjetaProfesional: string;
  consultorio: string;
}

@Component({
  standalone: true,
  selector: 'app-actualizacion-datos-medico',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    TextareaModule,
    DividerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './actualizacion-datos-medico.html',
  styleUrls: ['./actualizacion-datos-medico.css']
})
export class ActualizacionDatosMedicoComponent implements OnInit {
  actualizacionForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  medicoActual: Medico | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private medicoService: MedicoService,
    private loginService: LoginService,
    private messageService: MessageService
  ) {
    this.actualizacionForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasenaActual: ['', [Validators.required]],
      nuevaContrasena: ['', [Validators.minLength(8)]],
      confirmarContrasena: [''],
      telefono: ['', [Validators.required]],
      consultorio: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.cargarDatosMedico();
  }

  passwordMatchValidator(form: FormGroup) {
    const nuevaContrasena = form.get('nuevaContrasena');
    const confirmarContrasena = form.get('confirmarContrasena');
    
    if (nuevaContrasena && confirmarContrasena && nuevaContrasena.value !== confirmarContrasena.value) {
      confirmarContrasena.setErrors({ passwordMismatch: true });
    } else {
      confirmarContrasena?.setErrors(null);
    }
  }

  cargarDatosMedico() {
    const medico = this.loginService.getUsuarioActual();
    if (medico) {
      this.medicoActual = medico as Medico;
      
      this.actualizacionForm.patchValue({
        correo: medico.correo,
        telefono: medico.telefono,
        consultorio: medico.consultorio || ''
      });
    } else {
      this.showError('No se pudo cargar la información del médico');
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.actualizacionForm.valid && this.medicoActual) {
      this.isLoading = true;

      const formData = { ...this.actualizacionForm.value };
      
      const datosActualizacion = {
        numeroTarjetaProfesional: this.medicoActual.numeroTarjetaProfesional,
        nombres: this.medicoActual.nombres,
        apellidos: this.medicoActual.apellidos,
        correo: formData.correo?.trim() || '',
        contrasenaActual: formData.contrasenaActual,
        nuevaContrasena: formData.nuevaContrasena?.trim() || '',
        telefono: formData.telefono?.trim() || '',
        especialidad: this.medicoActual.especialidad,
        consultorio: formData.consultorio?.trim() || ''
      };

      console.log('Datos para actualizar médico:', datosActualizacion);

      this.medicoService.actualizarPerfilMedico(datosActualizacion).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.showSuccess(response.message);
            // Actualizar datos locales
            if (this.medicoActual) {
              this.medicoActual.correo = datosActualizacion.correo;
              this.medicoActual.telefono = datosActualizacion.telefono;
              this.medicoActual.consultorio = datosActualizacion.consultorio;
            }
            setTimeout(() => {
              this.router.navigate(['/medico-dashboard']);
            }, 2000);
          } else {
            this.showError(response.message);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error completo en actualización:', error);
          
          if (error.error && error.error.message) {
            this.showError(error.error.message);
          } else if (error.status === 401) {
            this.showError('Contraseña actual incorrecta');
          } else if (error.status === 404) {
            this.showError('Médico no encontrado');
          } else {
            this.showError('Error del servidor. Intenta más tarde.');
          }
        }
      });
    } else {
      Object.keys(this.actualizacionForm.controls).forEach(key => {
        this.actualizacionForm.get(key)?.markAsTouched();
      });
      this.showError('Por favor completa los campos requeridos correctamente.');
    }
  }

  onVolver() {
    this.router.navigate(['/medico-dashboard']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 5000
    });
  }

  private showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }
}
