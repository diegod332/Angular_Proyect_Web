import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

declare var bootstrap: any; // Declarar Bootstrap para usar su API

@Component({
  selector: 'app-inventario',
  standalone: false,
  templateUrl: './inventario.component.html',
  styleUrls: ['../../admin.component.css'],
})
export class InventarioComponent implements OnInit {
  cargando: boolean = false; // Indicador de carga
  insumos: any[] = []; // Lista de insumos
  insumoActual: any = { name: '', quantity: 0, expirationDate: '', price: 0 }; // Insumo actual para agregar o editar
  esEditar: boolean = false; // Indica si se está editando un insumo

  private apiURL = 'http://localhost:3004/api/supplies'; // Ruta base para insumos

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerInsumos();
  }

  // Obtener todos los insumos
  obtenerInsumos(): void {
    this.http.get<any>(this.apiURL).subscribe({
      next: (response) => {
        this.insumos = response.data;
      },
      error: (err) => {
        console.error('Error al obtener insumos:', err);
      },
    });
  }

  // Abrir el modal para agregar un nuevo insumo
  abrirModalNuevo(): void {
    this.insumoActual = { name: '', quantity: 0, expirationDate: '', price: 0 }; // Limpia el insumo actual
    this.esEditar = false; // Modo agregar
    this.mostrarModal('insumoModal');
  }

  // Abrir el modal para editar un insumo existente
  abrirModalEditar(insumo: any): void {
    this.insumoActual = { ...insumo }; // Copia el insumo seleccionado
    this.esEditar = true; // Modo editar
    this.mostrarModal('insumoModal');
  }

  // Guardar un insumo (crear o editar)
  guardarInsumo(): void {
    if (this.esEditar) {
      // Editar insumo
      this.http.put(`${this.apiURL}/${this.insumoActual._id}`, this.insumoActual).subscribe({
        next: () => {
          this.obtenerInsumos(); // Actualizar la lista de insumos
          this.cerrarModal('insumoModal');
        },
        error: (err) => {
          console.error('Error al editar insumo:', err);
        },
      });
    } else {
      // Crear nuevo insumo
      this.http.post(this.apiURL, this.insumoActual).subscribe({
        next: () => {
          this.obtenerInsumos(); // Actualizar la lista de insumos
          this.cerrarModal('insumoModal');
        },
        error: (err) => {
          console.error('Error al crear insumo:', err);
        },
      });
    }
  }

  // Eliminar un insumo
  eliminarInsumo(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este insumo?')) {
      this.http.delete(`${this.apiURL}/${id}`).subscribe({
        next: () => {
          this.obtenerInsumos(); // Actualizar la lista de insumos
        },
        error: (err) => {
          console.error('Error al eliminar insumo:', err);
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
