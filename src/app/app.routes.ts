import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegistroComponent } from './registro/registro';
import { NgModule } from '@angular/core';
import { RegistroMedicoComponent } from './registro-medico/registro-medico';
import { AgendacionCitasComponent } from './formulario-cita/formulario-cita';
import { ActualizacionDatosComponent } from './update-data-user/update-data-user';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'registroMedico', component:RegistroMedicoComponent},
  { path: 'formularioCita', component:AgendacionCitasComponent},
  { path: 'actualizacionUser', component:ActualizacionDatosComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }