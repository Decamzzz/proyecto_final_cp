import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

// Importa el servicio
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    MessageModule,
    FieldsetModule,
    SelectModule,
    HttpClientModule,
    ToastModule
  ],
  providers: [MessageService],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;

  roles = [
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Médico', value: 'Medico' },
    { label: 'Paciente', value: 'Paciente' },
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private loginService: LoginService,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      seleccionRol: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const { usuario, contrasena, seleccionRol } = this.loginForm.value;
      
      // Llama al servicio de login con el rol
      this.loginService.login(usuario, contrasena, seleccionRol).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Login exitoso:', response);
          
          if (response.success) {
            this.showSuccess('Login exitoso!');

            setTimeout(() => {
              this.redirigirSegunRol(seleccionRol);
            }, 1500);
            
            // Redirigir según el rol seleccionado
          } else {
            this.showError(response.message || 'Error en el login');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en login:', error);
          
          // Manejo de errores
          if (error.status === 401) {
            this.showError('Credenciales incorrectas');
          } else if (error.status === 404) {
            this.showError('Usuario no encontrado para el rol seleccionado');
          } else if (error.error && error.error.message) {
            this.showError(error.error.message);
          } else {
            this.showError('Error del servidor. Intenta más tarde.');
          }
        },
        complete: () => {
          this.isLoading = false;
          console.log('Proceso de login completado');
        }
      });
      
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      this.showError('Por favor completa todos los campos correctamente.');
    }
  }

  onRegister() {
    console.log('Redirigir a registro');
    this.router.navigate(['registro']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private redirigirSegunRol(rol: string) {
    console.log('Redirigiendo según rol:', rol);
    switch(rol) {
      case 'Administrador':
        this.router.navigate(['/admin-dashboard']);
        console.log('Redirigiendo a admin-dashboard');
        break;
      case 'Medico':
        this.router.navigate(['/medico-dashboard']);
        console.log('Redirigiendo a medico-dashboard');
        break;
      case 'Paciente':
        this.router.navigate(['/paciente-dashboard']);
        console.log('Redirigiendo a paciente-dashboard');
        break;
      default:
        this.router.navigate(['/dashboard']);
        console.log('Redirigiendo a default-dashboard');
    }
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
