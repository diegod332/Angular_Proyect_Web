import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any; // Declarar Bootstrap para usar su API

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrls: ['../../admin.component.css'],
})
export class ClientesComponent {
  private apiURL = 'http://localhost:3004/api/clients'; // Ruta base para clientes
  cargando: boolean = false; // Variable para mostrar el indicador de carga
  clientes: any[] = []; // Lista de clientes
  clienteActual: any = {}; // Cliente actual para agregar/editar
  esEditar: boolean = false; // Indica si se está editando un cliente

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {}

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
      complete: () => {
        this.cargando = false; // Asegura que el indicador de carga se detenga
      },
    });
  }

  abrirModalNuevo(): void {
    this.clienteActual = {}; // Limpia el cliente actual
    this.esEditar = false; // Modo agregar
    this.mostrarModal('clienteModal');
  }

  abrirModalEditar(cliente: any): void {
    this.clienteActual = { ...cliente }; // Copia el cliente seleccionado
    this.esEditar = true; // Modo editar
    this.mostrarModal('clienteModal');
  }

  obtenerClientes(): void {
    this.http.get<any>(this.apiURL).subscribe({
      next: (response) => {
        this.clientes = response.data;
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
      },
    });
  }

  guardarCliente(): void {
    if (this.esEditar) {
      // Actualizar cliente existente
      this.http.put(`${this.apiURL}/${this.clienteActual.id}`, this.clienteActual).subscribe({
        next: () => {
          this.obtenerClientes(); // Actualizar la lista de clientes
          this.cerrarModal('clienteModal');
        },
        error: (err) => {
          console.error('Error al actualizar cliente:', err);
        },
      });
    } else {
      // Crear nuevo cliente
      this.http.post(this.apiURL, this.clienteActual).subscribe({
        next: () => {
          this.obtenerClientes(); // Actualizar la lista de clientes
          this.cerrarModal('clienteModal');
        },
        error: (err) => {
          console.error('Error al crear cliente:', err);
        },
      });
    }
  }

  eliminarCliente(id: number): void {
    this.http.delete(`${this.apiURL}/${id}`).subscribe({
      next: () => {
        this.obtenerClientes(); // Actualizar la lista de clientes
      },
      error: (err) => {
        console.error('Error al eliminar cliente:', err);
      },
    });
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
}