import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class RandomGuard implements CanActivate, CanLoad {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/pages']);
            return false; // Bloquea el acceso si está autenticado
        }
        return true; // Permite el acceso si no está autenticado
    }
    

    canLoad() {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
        }
        return this.authService.isLoggedIn();
    }
}
