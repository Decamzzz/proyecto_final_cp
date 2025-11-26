import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Servicios
import { AdminService } from '../services/admin.service';
import { LoginService } from '../services/login.service';

interface Admin {
  Username: string;
}

@Component({
  standalone: true,
  selector: 'app-actualizacion-datos-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './actualizar-datos-admin.html',
  styleUrls: ['./actualizar-datos-admin.css']
})
export class ActualizacionDatosAdminComponent implements OnInit {
  actualizacionForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  adminActual: Admin | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private loginService: LoginService,
    private messageService: MessageService
  ) {
    this.actualizacionForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      contrasenaActual: ['', [Validators.required]],
      nuevaContrasena: ['', [Validators.minLength(8)]],
      confirmarContrasena: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.cargarDatosAdmin();
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

  cargarDatosAdmin() {
    const admin = this.loginService.getUsuarioActual();
    if (admin) {
      this.adminActual = admin as Admin;
      
      this.actualizacionForm.patchValue({
        username: admin.Username || ''
      });
    } else {
      this.showError('No se pudo cargar la información del administrador');
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.actualizacionForm.valid && this.adminActual) {
      this.isLoading = true;

      const formData = { ...this.actualizacionForm.value };
      
      const datosActualizacion = {
        usernameActual: this.adminActual.Username,
        nuevoUsername: formData.username?.trim() || '',
        contrasenaActual: formData.contrasenaActual,
        nuevaContrasena: formData.nuevaContrasena?.trim() || ''
      };

      console.log('Datos para actualizar administrador:', datosActualizacion);

      this.adminService.actualizarAdmin(datosActualizacion).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.showSuccess(response.message);
            // Actualizar datos locales
            if (this.adminActual) {
              this.adminActual.Username = datosActualizacion.nuevoUsername;
            }
            setTimeout(() => {
              this.router.navigate(['/admin-dashboard']);
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
            this.showError('Administrador no encontrado');
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
    this.router.navigate(['/admin-dashboard']);
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
