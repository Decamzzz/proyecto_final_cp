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
import { ActualizacionUserService } from '../services/actualizacion-user.service';

interface Usuario {
  id: number;
  numeroIdentificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
  alergias: string;
  rol: string;
}

@Component({
  standalone: true,
  selector: 'app-paciente-dashboard',
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
  templateUrl: './paciente-dashboard.html',
  styleUrls: ['./paciente-dashboard.css']
})
export class PacienteDashboardComponent implements OnInit {
  usuarioActual: Usuario | null = null;
  showEliminarDialog: boolean = false;
  contrasenaConfirmacion: string = '';
  eliminando: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private actualizacionService: ActualizacionUserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.loginService.getUsuarioActual();
    if (!this.usuarioActual) {
      this.router.navigate(['/login']);
    }
  }

  irAActualizarDatos() {
    this.router.navigate(['/actualizacion-datos']);
  }

  agendarCita() {
    this.messageService.add({
      severity: 'info',
      summary: 'Agendar Cita',
      detail: 'Redirigiendo al formulario de agendamiento...',
      life: 2000
    });

    setTimeout(() => {
      this.router.navigate(['/agendacion-citas']);
    }, 1500);
  }

  verCitas() {
    this.messageService.add({
      severity: 'info',
      summary: 'Historial de Citas',
      detail: 'Cargando tu historial de citas médicas...',
      life: 2000
    });

    setTimeout(() => {
      this.router.navigate(['/historial-citas']);
    }, 1500);
  }

  solicitarEliminarCuenta() {
    this.showEliminarDialog = true;
  }

  eliminarCuenta() {
    if (!this.usuarioActual) return;

    this.eliminando = true;

    this.actualizacionService.eliminarCuenta(this.usuarioActual.id, this.contrasenaConfirmacion)
      .subscribe({
        next: (response: any) => {
          this.eliminando = false;
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Cuenta eliminada',
              detail: 'Tu cuenta y todos tus datos han sido eliminados exitosamente.',
              life: 5000
            });
            
            // Cerrar sesión y redirigir después de mostrar el mensaje
            setTimeout(() => {
              this.loginService.logout();
              this.router.navigate(['/login']);
            }, 3000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message || 'No se pudo eliminar la cuenta.',
              life: 5000
            });
          }
        },
        error: (error) => {
          this.eliminando = false;
          console.error('Error al eliminar cuenta:', error);
          
          if (error.status === 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Contraseña incorrecta',
              detail: 'La contraseña que ingresaste es incorrecta.',
              life: 5000
            });
          } else if (error.status === 404) {
            this.messageService.add({
              severity: 'error',
              summary: 'Usuario no encontrado',
              detail: 'No se encontró la cuenta a eliminar.',
              life: 5000
            });
          } else if (error.error && error.error.message) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
              life: 5000
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error del servidor',
              detail: 'No se pudo eliminar la cuenta. Intenta más tarde.',
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
      header: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      accept: () => {
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
      }
    });
  }

  getNombreCompleto(): string {
    if (!this.usuarioActual) return 'Usuario';
    return `${this.usuarioActual.nombres} ${this.usuarioActual.apellidos}`;
  }

  // Cerrar dialog y limpiar
  cerrarDialogEliminar() {
    this.showEliminarDialog = false;
    this.contrasenaConfirmacion = '';
    this.eliminando = false;
  }
}