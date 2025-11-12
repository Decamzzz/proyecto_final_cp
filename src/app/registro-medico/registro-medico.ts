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
    DividerModule
  ],
  templateUrl: './registro-medico.html',
  styleUrls: ['./registro-medico.css']
})
export class RegistroMedicoComponent {
  registroForm: FormGroup;
  showPassword: boolean = false;
  maxDate: Date;

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
    private router: Router
  ) {
    // Fecha máxima: hoy - 18 años
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear());

    this.registroForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', [Validators.required]],
      numeroIdentificacion: ['', [Validators.required, Validators.minLength(5)]],
      numeroTarjetaProfesional: ['', [Validators.required, Validators.minLength(5)]],
      consultorio: ['', [Validators.required]],
      especializacion: [''],
      telefono: ['', [Validators.required]],
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
      console.log('Formulario válido:', this.registroForm.value);
      // Aquí iría la lógica de registro
      alert('Registro exitoso');
      this.router.navigate(['/login']);
    } else {
      Object.keys(this.registroForm.controls).forEach(key => {
        this.registroForm.get(key)?.markAsTouched();
      });
    }
  }

  onVolver() {
    this.router.navigate(['']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
