import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActualizacionUserService {

  private apiUrl = "https://localhost:7104/api/Users";

  constructor(private http: HttpClient) { }

  actualizarUsuario(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar`, datos);
  }

  // Opcional: Obtener datos del usuario por ID
  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtener/${id}`);
  }
}
