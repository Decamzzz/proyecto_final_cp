import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

// Servicios
import { LoginService } from '../services/login.service';
import { CitasService } from '../services/citas.service';

interface Cita {
  id: number;
  medicoNumeroTarjetaProfesional: string;
  medicoNombre: string;
  medicoEspecialidad: string;
  fechaCita: string;
  horaCita: string;
  motivoConsulta: string;
  estado: string;
  fechaCreacion: string;
}

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
  selector: 'app-historial-citas',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    TagModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './historial-citas-pacientes.html',
  styleUrls: ['./historial-citas-pacientes.css']
})
export class HistorialCitasComponent implements OnInit {
  usuarioActual: Usuario | null = null;
  citas: Cita[] = [];
  loading: boolean = true;

  // Propiedades para los contadores
  citasPendientes: number = 0;
  citasAceptadas: number = 0;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private citasService: CitasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
    this.cargarCitas();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.loginService.getUsuarioActual();
    if (!this.usuarioActual) {
      this.router.navigate(['/login']);
    }
  }

  cargarCitas() {
    if (!this.usuarioActual) return;

    this.loading = true;
    this.messageService.add({
      severity: 'info',
      summary: 'Cargando',
      detail: 'Obteniendo tu historial de citas...',
      life: 2000
    });

    this.citasService.obtenerCitasPorPaciente(this.usuarioActual.id).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          this.citas = response.data;
          this.actualizarContadores();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las citas.',
            life: 4000
          });
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error cargando citas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error de conexión',
          detail: 'No se pudo conectar con el servidor.',
          life: 4000
        });
      }
    });
  }

  actualizarContadores() {
    this.citasPendientes = this.citas.filter(c => c.estado === 'Pendiente').length;
    this.citasAceptadas = this.citas.filter(c => c.estado === 'Aceptada').length;
  }

  cancelarCita(cita: Cita) {
    if (cita.estado === 'Aceptada') {
      this.messageService.add({
        severity: 'error',
        summary: 'No se puede cancelar',
        detail: 'No puedes cancelar una cita que ya ha sido aceptada por el médico.',
        life: 5000
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas cancelar la cita con ${cita.medicoNombre} programada para el ${this.formatearFecha(cita.fechaCita)} a las ${cita.horaCita}?`,
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelando cita',
          detail: 'Procesando la cancelación de tu cita...',
          life: 3000
        });

        this.citasService.cancelarCita(cita.id).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Cita Cancelada',
                detail: response.message,
                life: 4000
              });
              this.cargarCitas(); // Recargar la lista
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
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo cancelar la cita. Intenta nuevamente.',
              life: 5000
            });
          }
        });
      }
    });
}

  volverAlDashboard() {
    this.messageService.add({
      severity: 'info',
      summary: 'Volviendo al Dashboard',
      detail: 'Redirigiendo al panel principal...',
      life: 2000
    });

    setTimeout(() => {
      this.router.navigate(['/paciente-dashboard']);
    }, 1500);
  }

  agendarNuevaCita() {
    this.router.navigate(['/agendacion-citas']);
  }

  getSeverity(estado: string): any {
    switch (estado) {
      case 'Pendiente':
        return 'warning';
      case 'Aceptada':
        return 'success';
      case 'Rechazada':
        return 'danger';
      case 'Cancelada':
        return 'secondary';
      case 'Completada':
        return 'info';
      default:
        return 'secondary';
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  puedeCancelar(estado: string): boolean {
    return estado === 'Pendiente';
  }

  // Método para obtener nombre completo
  getNombreCompleto(): string {
    if (!this.usuarioActual) return 'Paciente';
    return `${this.usuarioActual.nombres} ${this.usuarioActual.apellidos}`;
  }
}