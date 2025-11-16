import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  private usuarioKey = 'usuarioActual';

  constructor() { }

  setUsuarioActual(usuario: any) {
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  getUsuarioActual(): any {
    const usuario = localStorage.getItem(this.usuarioKey);
    return usuario ? JSON.parse(usuario) : null;
  }

  removeUsuarioActual() {
    localStorage.removeItem(this.usuarioKey);
  }

  isAuthenticated(): boolean {
    return this.getUsuarioActual() !== null;
  }
}
