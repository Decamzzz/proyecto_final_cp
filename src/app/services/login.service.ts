import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = "https://localhost:7104/api/Users";

  constructor(private http: HttpClient) { }

  // Método para login que maneja diferentes roles
  login(usuario: string, contrasena: string, rol: string): Observable<any> {
    const body = { 
      Username: usuario,
      Password: contrasena,
      Rol: rol
    };
    console.log('🔍 DEBUG - Enviando al backend:', body);
    return this.http.post(`${this.apiUrl}/login`, body).pipe(
      tap((response: any) => {
        console.log('🔍 DEBUG - Respuesta COMPLETA del backend:', response);
        console.log('🔍 DEBUG - User object recibido:', response.user);
        if (response.success) {
          // Guardar información del usuario en localStorage
          this.guardarUsuarioEnStorage(response.user, rol);
        }
      })
    );
  }

  // Método para registro
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  private guardarUsuarioEnStorage(user: any, rol: string): void {
    const usuarioData = {
      id: user.Id || user.id, // Asegurar que tenga id
      numeroIdentificacion: user.NumeroIdentificacion || user.numeroIdentificacion,
      numeroTarjetaProfesional: user.NumeroTarjetaProfesional || user.numeroTarjetaProfesional,
      especialidad: user.Especialidad || user.especialidad,
      consultorio: user.Consultorio || user.consultorio,
      Username: user.Username || user.username,
      nombres: user.Nombres || user.nombres,
      apellidos: user.Apellidos || user.apellidos,
      correo: user.Correo || user.correo,
      telefono: user.Telefono || user.telefono,
      direccion: user.Direccion || user.direccion,
      alergias: user.Alergias || user.alergias,
      rol: rol,
      fechaLogin: new Date().toISOString()
    };
    
    console.log('🔍 DEBUG - Guardando usuario en storage:', usuarioData);
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioData));
}

  // Obtener usuario del localStorage
  getUsuarioActual(): any {
    const usuario = localStorage.getItem('usuarioActual');
    return usuario ? JSON.parse(usuario) : null;
  }

  // Verificar si hay un usuario logueado
  isLoggedIn(): boolean {
    return this.getUsuarioActual() !== null;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('usuarioActual');
  }

  // Obtener el rol del usuario actual
  getRolUsuario(): string | null {
    const usuario = this.getUsuarioActual();
    return usuario ? usuario.rol : null;
  }
}