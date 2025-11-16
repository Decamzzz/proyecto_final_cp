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
import { ActualizacionUserService } from '../services/actualizacion-user.service';
import { AuthUserService } from '../services/auth-user.service';

interface Usuario {
  id: number;
  numeroIdentificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
  alergias: string;
}

@Component({
  standalone: true,
  selector: 'app-actualizacion-datos',
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
  templateUrl: './update-data-user.html',
  styleUrls: ['./update-data-user.css']
})
export class ActualizacionDatosComponent implements OnInit {
  actualizacionForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  usuarioActual: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actualizacionService: ActualizacionUserService,
    private authService: AuthUserService,
    private messageService: MessageService
  ) {
    this.actualizacionForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasenaActual: ['', [Validators.required]],
      nuevaContrasena: ['', [Validators.minLength(8)]],
      confirmarContrasena: [''],
      telefono: ['', [Validators.required]],
      direccion: [''],
      alergias: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.cargarDatosUsuario();
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

  cargarDatosUsuario() {
    // Obtener el usuario del servicio de autenticación
    const usuario = this.authService.getUsuarioActual();
    if (usuario) {
      this.usuarioActual = usuario;
      
      // Cargar datos actuales en el formulario
      this.actualizacionForm.patchValue({
        correo: usuario.correo,
        telefono: usuario.telefono,
        direccion: usuario.direccion || '',
        alergias: usuario.alergias || ''
      });
    } else {
      this.showError('No se pudo cargar la información del usuario');
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.actualizacionForm.valid && this.usuarioActual) {
      this.isLoading = true;

      const formData = { ...this.actualizacionForm.value };
      
      // Preparar datos para enviar
      const datosActualizacion = {
        id: this.usuarioActual.id,
        correo: formData.correo,
        contrasenaActual: formData.contrasenaActual,
        nuevaContrasena: formData.nuevaContrasena || null, // Solo enviar si se cambió
        telefono: formData.telefono,
        direccion: formData.direccion || '',
        alergias: formData.alergias || ''
      };

      console.log('Datos para actualizar:', datosActualizacion);

      this.actualizacionService.actualizarUsuario(datosActualizacion).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.showSuccess(response.message);
            // Actualizar datos locales
            if (this.usuarioActual) {
              this.usuarioActual.correo = formData.correo;
              this.usuarioActual.telefono = formData.telefono;
              this.usuarioActual.direccion = formData.direccion;
              this.usuarioActual.alergias = formData.alergias;
            }
            setTimeout(() => {
              this.router.navigate(['/paciente-dashboard']);
            }, 2000);
          } else {
            this.showError(response.message);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en actualización:', error);
          
          if (error.error && error.error.message) {
            this.showError(error.error.message);
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
    this.router.navigate(['/paciente-dashboard']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Métodos para mostrar toasts
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
