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
  pacienteId: number;
  pacienteNombre: string;
  pacienteIdentificacion: string;
  pacienteTelefono: string;
  pacienteCorreo: string;
  pacienteDireccion: string;
  pacienteAlergias: string;
  medicoNumeroTarjetaProfesional: string;
  medicoNombre: string;
  medicoEspecialidad: string;
  fechaCita: string;
  horaCita: string;
  motivoConsulta: string;
  estado: string;
  fechaCreacion: string;
}

interface Medico {
  id: number;
  numeroIdentificacion: string;
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
  selector: 'app-gestion-citas-medico',
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
  templateUrl: './gestion-citas-medico.html',
  styleUrls: ['./gestion-citas-medico.css']
})
export class GestionCitasMedicoComponent implements OnInit {
  usuarioActual: Medico | null = null;
  citas: Cita[] = [];
  loading: boolean = true;

  // Propiedades para los contadores
  citasPendientes: number = 0;
  citasAceptadas: number = 0;
  citasTotales: number = 0;

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
      detail: 'Obteniendo citas asignadas...',
      life: 2000
    });

    this.citasService.obtenerCitasPorMedico(this.usuarioActual.numeroTarjetaProfesional).subscribe({
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
    this.citasTotales = this.citas.length;
    this.citasPendientes = this.citas.filter(c => c.estado === 'Pendiente').length;
    this.citasAceptadas = this.citas.filter(c => c.estado === 'Aceptada').length;
  }

  aceptarCita(cita: Cita) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas aceptar la cita con ${cita.pacienteNombre} programada para el ${this.formatearFecha(cita.fechaCita)} a las ${cita.horaCita}?`,
      header: 'Confirmar Aceptación',
      icon: 'pi pi-check-circle',
      accept: () => {
        this.cambiarEstadoCita(cita.id, 'Aceptada');
      }
    });
  }

  rechazarCita(cita: Cita) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas rechazar la cita con ${cita.pacienteNombre} programada para el ${this.formatearFecha(cita.fechaCita)} a las ${cita.horaCita}?`,
      header: 'Confirmar Rechazo',
      icon: 'pi pi-times-circle',
      accept: () => {
        this.cambiarEstadoCita(cita.id, 'Rechazada');
      }
    });
  }

  cambiarEstadoCita(citaId: number, nuevoEstado: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Procesando',
      detail: `Actualizando estado de la cita...`,
      life: 3000
    });

    this.citasService.cambiarEstadoCita(citaId, nuevoEstado).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: nuevoEstado === 'Aceptada' ? 'Cita Aceptada' : 'Cita Rechazada',
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
          detail: 'No se pudo actualizar el estado de la cita. Intenta nuevamente.',
          life: 5000
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
      this.router.navigate(['/medico-dashboard']);
    }, 1500);
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

  puedeGestionar(estado: string): boolean {
    return estado === 'Pendiente';
  }

  getNombreCompleto(): string {
    if (!this.usuarioActual) return 'Médico';
    return `Dr. ${this.usuarioActual.nombres} ${this.usuarioActual.apellidos}`;
  }

  // Método para obtener información resumida del paciente
  getInfoPaciente(cita: Cita): string {
    return `Tel: ${cita.pacienteTelefono} | ID: ${cita.pacienteIdentificacion}`;
  }

  // Método para ver detalles completos del paciente
  verDetallesPaciente(cita: Cita) {
    const detalles = `
      <strong>Información del Paciente:</strong>
      <br><br>
      <strong>Nombre:</strong> ${cita.pacienteNombre}
      <br>
      <strong>Identificación:</strong> ${cita.pacienteIdentificacion}
      <br>
      <strong>Teléfono:</strong> ${cita.pacienteTelefono}
      <br>
      <strong>Correo:</strong> ${cita.pacienteCorreo}
      <br>
      <strong>Dirección:</strong> ${cita.pacienteDireccion || 'No especificada'}
      <br>
      <strong>Alergias:</strong> ${cita.pacienteAlergias || 'Ninguna registrada'}
    `;

    this.messageService.add({
      severity: 'info',
      summary: 'Detalles del Paciente',
      detail: detalles,
      life: 8000
    });
  }
}
