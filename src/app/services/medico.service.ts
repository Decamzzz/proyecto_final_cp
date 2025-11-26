import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl = 'https://localhost:7104/api/Medico';

  constructor(private http: HttpClient) {}

  eliminarCuentaMedico(numeroTarjetaProfesional: any, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/eliminar-cuenta`, {
      numeroTarjetaProfesional: numeroTarjetaProfesional,
      contrasena: contrasena
    });
  }

    // Agregar estos métodos al servicio existente
  actualizarPerfilMedico(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar-perfil`, datos);
  }

  cambiarContrasenaMedico(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cambiar-contrasena`, datos);
  }

  obtenerPerfilMedico(numeroTarjetaProfesional: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil/${numeroTarjetaProfesional}`);
  }
}
