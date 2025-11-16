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
import { MessageService } from 'primeng/api';

// Servicio
import { RegistroService } from '../services/register.service';

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
  providers: [MessageService, RegistroService],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  registroForm: FormGroup;
  showPassword: boolean = false;
  maxDate: Date;
  isLoading: boolean = false;

  generos = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Femenino', value: 'femenino' }
  ];

  gruposSanguineos = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registroService: RegistroService,
    private messageService: MessageService
  ) {
    // Fecha máxima: hoy
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear());

    this.registroForm = this.fb.group({
      // Campos de identificación
      numeroIdentificacion: ['', [Validators.required, Validators.minLength(5)]],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      
      // Campos de acceso
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', [Validators.required]],
      
      // Información personal
      fechaNacimiento: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      direccion: [''],
      genero: ['', [Validators.required]],
      grupoSanguineo: ['', [Validators.required]],
      alergias: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contrasena');
    const confirmPassword = form.get('confirmarContrasena');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.isLoading = true;
      
      const formData = { ...this.registroForm.value };
      
      // CONVERTIR LOS DATOS ANTES DE ENVIAR
      const datosParaEnviar = {
        // Campos de identificación
        NumeroIdentificacion: formData.numeroIdentificacion,
        Nombres: formData.nombres,
        Apellidos: formData.apellidos,
        
        // Campos de acceso
        Correo: formData.correo,
        Contrasena: formData.contrasena,
        ConfirmarContrasena: formData.confirmarContrasena,
        
        // Información personal - CONVERTIR formatos
        FechaNacimiento: this.convertirFecha(formData.fechaNacimiento),
        Telefono: formData.telefono,
        Direccion: formData.direccion || '',
        Genero: formData.genero?.value || formData.genero, // Extraer el value si es objeto
        GrupoSanguineo: formData.grupoSanguineo?.value || formData.grupoSanguineo, // Extraer el value si es objeto
        Alergias: formData.alergias || ''
      };

      console.log('Datos convertidos para enviar:', datosParaEnviar);
      
      this.registroService.register(datosParaEnviar).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.registroService.showSuccess(response.message);
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.registroService.showError(response.message);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error completo en registro:', error);
          console.error('Detalles del error:', error.error);
          
          // Mostrar errores específicos del backend
          if (error.error && error.error.errors) {
            const validationErrors = error.error.errors;
            Object.keys(validationErrors).forEach(key => {
              this.registroService.showError(`${key}: ${validationErrors[key].join(', ')}`);
            });
          } else if (error.error && error.error.message) {
            this.registroService.showError(error.error.message);
          } else {
            this.registroService.showError('Error del servidor. Intenta más tarde.');
          }
        }
      });
      
    } else {
      Object.keys(this.registroForm.controls).forEach(key => {
        this.registroForm.get(key)?.markAsTouched();
      });
      this.registroService.showError('Por favor completa todos los campos requeridos correctamente.');
    }
  }

  // Método para convertir fecha
  private convertirFecha(fecha: any): string {
    if (!fecha) return '';
    
    if (fecha instanceof Date) {
      // Convertir a formato YYYY-MM-DD que entiende C#
      return fecha.toISOString().split('T')[0];
    }
    
    // Si ya es string, devolverlo tal cual
    return fecha;
  }

  onVolver() {
    this.router.navigate(['']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
