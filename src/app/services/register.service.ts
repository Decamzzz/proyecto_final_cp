import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private apiUrl = "https://localhost:7104/api/Users";

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  // Login
  login(numeroIdentificacion: string, contrasena: string): Observable<any> {
    const body = {
      Username: numeroIdentificacion,
      Password: contrasena
    };
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  // Registro
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Métodos para mostrar toasts
  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 5000
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }

  showInfo(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: message,
      life: 3000
    });
  }
}
