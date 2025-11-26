import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputMaskModule } from 'primeng/inputmask';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';

// Servicios
import { AdminService } from '../services/admin.service';
import { MessageService } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'app-registro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    InputMaskModule,
    TextareaModule,
    DividerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './registro-medico.html',
  styleUrls: ['./registro-medico.css']
})
export class RegistroMedicoComponent {
  registroForm: FormGroup;
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private messageService: MessageService
  ) {
    this.registroForm = this.fb.group({
      NumeroIdentificacion: ['', [Validators.required, Validators.minLength(5)]],
      Nombres: ['', [Validators.required, Validators.minLength(2)]],
      Apellidos: ['', [Validators.required, Validators.minLength(2)]],
      Correo: ['', [Validators.required, Validators.email]],
      Contrasena: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmarContrasena: ['', [Validators.required]],
      Telefono: ['', [Validators.required]],
      Especialidad: [''],
      NumeroTarjetaProfesional: ['', [Validators.required, Validators.minLength(5)]],
      Consultorio: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('Contrasena');
    const confirmPassword = form.get('confirmarContrasena');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.loading = true;

      // Preparar datos EXACTAMENTE como los espera la tabla Medicos
      const formData = this.registroForm.value;
      const medicoData = {
        NumeroIdentificacion: formData.NumeroIdentificacion,
        Nombres: formData.Nombres,
        Apellidos: formData.Apellidos,
        Correo: formData.Correo,
        Contrasena: formData.Contrasena,
        Telefono: formData.Telefono,
        Especialidad: formData.Especialidad,
        NumeroTarjetaProfesional: formData.NumeroTarjetaProfesional,
        Consultorio: formData.Consultorio
      };

      console.log('Datos enviados al backend:', medicoData);

      // Pequeña espera para mostrar el toast de procesamiento
      setTimeout(() => {
        this.adminService.registrarMedico(medicoData).subscribe({
          next: (response: any) => {
            this.loading = false;
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: '¡Registro Exitoso!',
                detail: 'El médico ha sido registrado correctamente en el sistema.',
                life: 4000
              });
              
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Registro Incompleto',
                detail: response.message || 'El registro no se completó correctamente.',
                life: 4000
              });
            }
          },
          error: (error) => {
            this.loading = false;
            console.error('Error completo:', error);
            
            let errorMessage = 'No se pudo registrar el médico. Intente nuevamente.';
            let errorSummary = 'Error de Registro';
            
            if (error.status === 409) {
              errorSummary = 'Médico Ya Registrado';
              errorMessage = 'El número de tarjeta profesional ya está registrado en el sistema.';
            } else if (error.status === 400) {
              errorSummary = 'Datos Inválidos';
              errorMessage = 'Los datos proporcionados no son válidos. Verifique la información.';
            } else if (error.status === 500) {
              errorSummary = 'Error del Servidor';
              errorMessage = 'Error interno del servidor. Contacte al administrador.';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }
            
            this.messageService.add({
              severity: 'error',
              summary: errorSummary,
              detail: errorMessage,
              life: 5000
            });
          }
        });
      }, 1000); // Espera inicial de 1 segundo
      
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.registroForm.controls).forEach(key => {
        this.registroForm.get(key)?.markAsTouched();
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
      this.router.navigate(['/admin-dashboard']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.messageService.add({
      severity: 'info',
      summary: 'Visibilidad de Contraseña',
      detail: this.showPassword ? 'Contraseña visible' : 'Contraseña oculta',
      life: 2000
    });
  }

  // Método para mostrar errores de validación específicos
  mostrarError(campo: string): string {
    const control = this.registroForm.get(campo);
    if (control && control.touched && control.errors) {
      if (control.errors['required']) {
        return 'Este campo es requerido';
      }
      if (control.errors['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['email']) {
        return 'Formato de email inválido';
      }
      if (control.errors['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
    }
    return '';
  }
}
