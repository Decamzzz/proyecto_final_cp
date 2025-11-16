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
    return this.http.post(`${this.apiUrl}/login`, body).pipe(
      tap((response: any) => {
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

  // Guardar usuario en localStorage
  private guardarUsuarioEnStorage(user: any, rol: string): void {
    const usuarioData = {
      ...user,
      rol: rol,
      fechaLogin: new Date().toISOString()
    };
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