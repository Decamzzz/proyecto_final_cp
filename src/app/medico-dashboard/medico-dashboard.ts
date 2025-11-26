import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

// Servicios
import { LoginService } from '../services/login.service';
import { MedicoService } from '../services/medico.service';

interface Medico {
  id: number;
  numeroIdentificacion: string
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  especialidad: string;
  numeroTarjetaProfesional: any;
  consultorio: string;
  rol: string;
}

@Component({
  standalone: true,
  selector: 'app-medico-dashboard',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    FormsModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './medico-dashboard.html',
  styleUrls: ['./medico-dashboard.css']
})
export class MedicoDashboardComponent implements OnInit {
  usuarioActual: Medico | null = null;
  showEliminarDialog: boolean = false;
  contrasenaConfirmacion: string = '';
  eliminando: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private medicoService: MedicoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.loginService.getUsuarioActual();
    if (!this.usuarioActual) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sesión expirada',
        detail: 'Por favor inicie sesión nuevamente.',
        life: 3000
      });
      this.router.navigate(['/login']);
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Bienvenido Doctor',
        detail: `Sesión iniciada como ${this.getNombreCompleto()}`,
        life: 4000
      });
    }
  }

  irAActualizarDatos() {
    this.messageService.add({
      severity: 'info',
      summary: 'Actualización de Datos',
      detail: 'Redirigiendo al formulario de actualización...',
      life: 2000
    });

    setTimeout(() => {
      this.router.navigate(['/actualizacion-datos-medico']);
    }, 1500);
  }

  gestionarCitas() {
    this.messageService.add({
      severity: 'info',
      summary: 'Gestión de Citas',
      detail: 'Cargando panel de gestión de citas médicas...',
      life: 2000
    });

    setTimeout(() => {
      this.router.navigate(['/gestion-citas-medico']);
    }, 1500);
  }

  solicitarEliminarCuenta() {
    this.showEliminarDialog = true;
    this.messageService.add({
      severity: 'warn',
      summary: 'Eliminación de Cuenta',
      detail: 'Está a punto de eliminar su cuenta médica.',
      life: 3000
    });
  }

eliminarCuenta() {
  if (!this.usuarioActual) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo identificar al usuario actual.',
      life: 4000
    });
    return;
  }

  this.eliminando = true;

  const datosEnviar = {
    numeroTarjetaProfesional: this.usuarioActual.numeroTarjetaProfesional, 
    contrasena: this.contrasenaConfirmacion
  };

  console.log('Datos a enviar al backend:', datosEnviar);

  this.messageService.add({
    severity: 'info',
    summary: 'Procesando',
    detail: 'Verificando credenciales y eliminando cuenta médica...',
    life: 3000
  });

  // Usar número de tarjeta profesional en lugar de ID
  this.medicoService.eliminarCuentaMedico(
    this.usuarioActual.numeroTarjetaProfesional, 
    this.contrasenaConfirmacion
  ).subscribe({
    next: (response: any) => {
      this.eliminando = false;
      if (response.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Cuenta Médica Eliminada',
          detail: response.message || 'Tu cuenta médica ha sido eliminada exitosamente.',
          life: 5000
        });
        
        // Mostrar detalles de lo eliminado si están disponibles
        if (response.datosEliminados) {
          setTimeout(() => {
            this.messageService.add({
              severity: 'info',
              summary: 'Resumen de Eliminación',
              detail: `Se eliminó al Dr. ${response.datosEliminados.medico} (${response.datosEliminados.especialidad}) y ${response.datosEliminados.citasEliminadas} citas asociadas.`,
              life: 6000
            });
          }, 1000);
        }
        
        setTimeout(() => {
          this.loginService.logout();
          this.router.navigate(['/login']);
        }, 4000);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error en eliminación',
          detail: response.message || 'No se pudo eliminar la cuenta médica.',
          life: 5000
        });
      }
    },
    error: (error) => {
      this.eliminando = false;
      console.error('Error al eliminar cuenta médica:', error);
      
      if (error.status === 401) {
        this.messageService.add({
          severity: 'error',
          summary: 'Credenciales incorrectas',
          detail: 'El número de tarjeta profesional o contraseña son incorrectos.',
          life: 5000
        });
      } else if (error.status === 404) {
        this.messageService.add({
          severity: 'error',
          summary: 'Médico no encontrado',
          detail: 'No se encontró la cuenta médica especificada.',
          life: 5000
        });
      } else if (error.error && error.error.message) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error del sistema',
          detail: error.error.message,
          life: 5000
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error del servidor',
          detail: 'No se pudo eliminar la cuenta médica. Intenta más tarde.',
          life: 5000
        });
      }
    }
  });

  this.showEliminarDialog = false;
  this.contrasenaConfirmacion = '';
}

  cerrarSesion() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas cerrar sesión?',
      header: 'Cerrar Sesión Médica',
      icon: 'pi pi-sign-out',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cerrando sesión',
          detail: 'Saliendo del panel médico...',
          life: 2000
        });

        setTimeout(() => {
          this.loginService.logout();
          this.messageService.add({
            severity: 'success',
            summary: 'Sesión cerrada',
            detail: 'Has cerrado sesión exitosamente.',
            life: 3000
          });
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        }, 1000);
      }
    });
  }

  getNombreCompleto(): string {
    if (!this.usuarioActual) return 'Médico';
    return `${this.usuarioActual.nombres} ${this.usuarioActual.apellidos}`;
  }

  // Cerrar dialog y limpiar
  cerrarDialogEliminar() {
    this.showEliminarDialog = false;
    this.contrasenaConfirmacion = '';
    this.eliminando = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Operación cancelada',
      detail: 'La eliminación de cuenta ha sido cancelada.',
      life: 3000
    });
  }
}
