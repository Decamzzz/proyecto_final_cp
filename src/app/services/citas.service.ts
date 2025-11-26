import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private apiUrl = 'https://localhost:7104/api/Citas';

  constructor(private http: HttpClient) {}

  // Agendar nueva cita
  agendarCita(citaData: any): Observable<any> {
    return this.http.post(this.apiUrl, citaData);
  }

  // Obtener citas por paciente
  obtenerCitasPorPaciente(pacienteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  // Obtener citas por médico
  obtenerCitasPorMedico(numeroTarjetaProfesional: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/medico/${numeroTarjetaProfesional}`);
  }

  // Cancelar cita
  cancelarCita(citaId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${citaId}/cancelar`, {});
  }

  // Cambiar estado de cita (médico)
  cambiarEstadoCita(citaId: number, nuevoEstado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${citaId}/estado`, { nuevoEstado });
  }
}
