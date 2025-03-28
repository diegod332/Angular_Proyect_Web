import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role']; // Obtiene el rol esperado de la configuración de la ruta
    const user = this.authService.getUser(); // Obtiene los datos del usuario autenticado

    if (this.authService.isLoggedIn() && (!expectedRole || user?.role === expectedRole)) {
      return true; // Permite el acceso si el usuario está autenticado y tiene el rol adecuado
    } else {
      this.router.navigate(['/login']); // Redirige al login si no está autenticado o no tiene el rol adecuado
      return false;
    }
  }
}