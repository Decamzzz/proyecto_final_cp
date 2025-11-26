import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = "https://localhost:7104/api/Admin";

  constructor(private http: HttpClient) { }

  actualizarAdmin(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar-admin`, datos);
  }

  registrarMedico(medicoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/medicos`, medicoData);
  }
}
