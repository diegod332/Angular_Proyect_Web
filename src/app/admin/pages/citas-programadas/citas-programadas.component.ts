import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-citas-programadas',
  standalone: false,
  templateUrl: './citas-programadas.component.html',
  styleUrls: ['../../admin.component.css'],
})
export class CitasProgramadasComponent {
  cargando: boolean = false; // Variable para mostrar el indicador de carga

  constructor(private router: Router, private authService: AuthService) {}

  cerrarSesion(): void {
    this.cargando = true; // Activa el indicador de carga
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); // Redirige al login
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        this.cargando = false; // Detén el indicador de carga si hay un error
      },
    });
  }
  
}