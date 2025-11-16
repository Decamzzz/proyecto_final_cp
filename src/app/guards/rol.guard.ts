import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthUserService } from '../services/auth-user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authUserService: AuthUserService, private router: Router) {}

  canActivate(route: any): boolean {
    const rolesPermitidos = route.data['roles'] as Array<string>;
    const usuario = this.authUserService.getUsuarioActual();

    if (usuario && rolesPermitidos.includes(usuario.rol)) {
      return true;
    } else {
      this.router.navigate(['/acceso-denegado']);
      return false;
    }
  }
}