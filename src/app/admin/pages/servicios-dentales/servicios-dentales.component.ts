import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

declare var bootstrap: any; // Declarar Bootstrap para usar su API

@Component({
  selector: 'app-servicios-dentales',
  standalone: false,
  templateUrl: './servicios-dentales.component.html',
  styleUrls: ['../../admin.component.css'],
})
export class ServiciosDentalesComponent implements OnInit {
  cargando: boolean = false; // Indicador de carga
  servicios: any[] = []; // Lista de servicios
  servicioActual: any = { serviceName: '', price: 0 }; // Servicio actual para agregar o editar
  esEditar: boolean = false; // Indica si se está editando un servicio

  private apiURL = 'http://localhost:3004/api/services'; // Ruta base para servicios

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerServicios();
  }

  // Obtener todos los servicios
  obtenerServicios(): void {
    this.http.get<any>(this.apiURL).subscribe({
      next: (response) => {
        this.servicios = response.data;
      },
      error: (err) => {
        console.error('Error al obtener servicios:', err);
      },
    });
  }

  abrirModalNuevo(): void {
    this.servicioActual = { serviceName: '', price: 0 }; // Limpia el servicio actual
    this.esEditar = false; // Modo agregar
    this.mostrarModal('servicioModal');
  }

  abrirModalEditar(servicio: any): void {
    this.servicioActual = { ...servicio }; // Copia el servicio seleccionado
    this.esEditar = true; // Modo editar
    this.mostrarModal('servicioModal');
  }

  guardarServicio(): void {
    if (this.esEditar) {
      // Actualizar servicio existente
      this.http.put(`${this.apiURL}/${this.servicioActual._id}`, this.servicioActual).subscribe({
        next: () => {
          this.obtenerServicios(); // Actualizar la lista de servicios
          this.cerrarModal('servicioModal');
        },
        error: (err) => {
          console.error('Error al actualizar servicio:', err);
        },
      });
    } else {
      // Crear nuevo servicio
      this.http.post(this.apiURL, this.servicioActual).subscribe({
        next: () => {
          this.obtenerServicios(); // Actualizar la lista de servicios
          this.cerrarModal('servicioModal');
        },
        error: (err) => {
          console.error('Error al crear servicio:', err);
        },
      });
    }
  }

  eliminarServicio(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      this.http.delete(`${this.apiURL}/${id}`).subscribe({
        next: () => {
          this.obtenerServicios(); // Actualizar la lista de servicios
        },
        error: (err) => {
          console.error('Error al eliminar servicio:', err);
        },
      });
    }
  }

  mostrarModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  cerrarModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

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