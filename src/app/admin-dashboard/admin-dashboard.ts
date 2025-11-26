import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

// Servicios
import { LoginService } from '../services/login.service';
import { AdminService } from '../services/admin.service';

interface Usuario {
  id: number;
  numeroIdentificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
}

interface Medico {
  id: number;
  numeroIdentificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  especialidad: string;
  numeroTarjetaProfesional: string;
  consultorio: string;
}

interface Admin {
  Username: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    TableModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  usuarioActual: Admin | null = null;
  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  showRegistroMedico: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private adminService: AdminService,
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

  // Navegación
  irARegistroMedico() {
    this.router.navigate(['/registro-medico']);
  }

  actualizarDatos() {
    this.router.navigate(['/actualizacion-datos-admin']);
  }

  // Cerrar sesión
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
          detail: 'Has cerrado sesión exitosamente.'
        });
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      }
    });
  }
}
