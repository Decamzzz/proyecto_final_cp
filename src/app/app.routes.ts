import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegistroComponent } from './registro/registro';
import { ActualizacionDatosComponent } from './update-data-user/update-data-user'; 
import { AuthGuard } from './guards/authUser.guard'; 
import { RoleGuard } from './guards/rol.guard'; 

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  
  // Rutas protegidas para pacientes
  { 
    path: 'paciente-dashboard', 
    loadComponent: () => import('./update-data-user/update-data-user')
      .then(c => c.ActualizacionDatosComponent),
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
      .then(c => c.MedicoDashboard),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Medico'] }
  },
  
  // Rutas protegidas para administradores
  { 
    path: 'admin-dashboard', 
    loadComponent: () => import('./admin-dashboard/admin-dashboard')
      .then(c => c.AdminDashboard),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Administrador'] }
  },
  
  { path: '**', redirectTo: '/login' }
];