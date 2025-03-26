import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['../../admin.component.css'],
  standalone: false,
})
export class CitasComponent {
  cargando: boolean = false; 

  // Propiedades para los detalles de la cita
  detalleNombre: string = '';
  detalleFecha: string = '';
  detalleHora: string = '';
  detalleServicio: string = '';
  detalleEstado: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  // Método para cerrar sesión
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

  // Método para abrir el modal de "Nueva Cita"
  abrirModalNuevaCita(): void {
    const modal = document.getElementById('nuevoModal') as HTMLDivElement;
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-modal', 'true');
    }
  }

  // Método para cerrar el modal de "Nueva Cita"
  cerrarModalNuevaCita(): void {
    const modal = document.getElementById('nuevoModal') as HTMLDivElement;
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    }
  }

  // Método para abrir el modal de detalles y asignar los valores
  abrirModalVer(cita: any): void {
    this.detalleNombre = cita.nombreCompleto;
    this.detalleFecha = cita.fechaCita;
    this.detalleHora = cita.horaCita;
    this.detalleServicio = cita.servicio;
    this.detalleEstado = cita.estado;

    const modal = document.getElementById('verModal') as HTMLDivElement;
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
  }

  // Método para cerrar el modal de detalles
  cerrarModalVer(): void {
    const modal = document.getElementById('verModal') as HTMLDivElement;
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
  }
}