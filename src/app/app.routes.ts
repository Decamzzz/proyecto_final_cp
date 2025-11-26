import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegistroComponent } from './registro/registro';
import { ActualizacionDatosComponent } from './update-data-user/update-data-user'; 
import { AuthGuard } from './guards/authUser.guard'; 
import { RoleGuard } from './guards/rol.guard'; 
import { AgendacionCitasComponent } from './formulario-cita/formulario-cita';
import { RegistroMedicoComponent } from './registro-medico/registro-medico';
import { ActualizacionDatosMedicoComponent } from './actualizacion-datos-medico/actualizacion-datos-medico';
import { ActualizacionDatosAdminComponent } from './actualizar-datos-admin/actualizar-datos-admin';

export const routes: Routes = [
  { path: 'agendacion-citas', component: AgendacionCitasComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'registro-medico', component: RegistroMedicoComponent },

  { 
  path: 'actualizacion-datos-admin', 
  component: ActualizacionDatosAdminComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['Administrador'] }
  },
  { 
  path: 'actualizacion-datos-medico', 
  component: ActualizacionDatosMedicoComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['Medico'] }
  },

  { 
  path: 'gestion-citas-medico', 
  loadComponent: () => import('./gestion-citas-medico/gestion-citas-medico')
    .then(c => c.GestionCitasMedicoComponent),
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['Medico'] }
  },
  { 
  path: 'historial-citas', 
  loadComponent: () => import('./historial-citas-pacientes/historial-citas-pacientes')
    .then(c => c.HistorialCitasComponent),
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['Paciente'] }
  },
  
  // Rutas protegidas para pacientes
  { 
    path: 'paciente-dashboard', 
    loadComponent: () => import('./paciente-dashboard/paciente-dashboard')
      .then(c => c.PacienteDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Paciente'] }
  },
  { 
    path: 'actualizacion-datos', 
    component: ActualizacionDatosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Paciente'] }
  },
  
  // Rutas protegidas para médicos
  { 
    path: 'medico-dashboard', 
    loadComponent: () => import('./medico-dashboard/medico-dashboard')
      .then(c => c.MedicoDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Medico'] }
  },
  
  // Rutas protegidas para administradores
  { 
    path: 'admin-dashboard', 
    loadComponent: () => import('./admin-dashboard/admin-dashboard')
      .then(c => c.AdminDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Administrador'] }
  },
  
  { path: '**', redirectTo: '/' }
];