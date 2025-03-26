import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

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

  private apiURL = 'http://localhost:3004/api/supplies'; // Cambia la URL según tu configuración

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
    this.insumoActual = { name: '', quantity: 0, expirationDate: '', price: 0 };
    this.esEditar = false;
    const modal = document.getElementById('insumoModal') as HTMLDivElement;
    modal.style.display = 'block';
    modal.classList.add('show');
  }

  // Abrir el modal para editar un insumo existente
  abrirModalEditar(insumo: any): void {
    this.insumoActual = { ...insumo };
    this.esEditar = true;
    const modal = document.getElementById('insumoModal') as HTMLDivElement;
    modal.style.display = 'block';
    modal.classList.add('show');
  }

  // Cerrar el modal
  cerrarModal(): void {
    const modal = document.getElementById('insumoModal') as HTMLDivElement;
    modal.style.display = 'none';
    modal.classList.remove('show');
  }

  // Guardar un insumo (crear o editar)
  guardarInsumo(): void {
    if (this.esEditar) {
      // Editar insumo
      this.http.put(`${this.apiURL}/${this.insumoActual._id}`, this.insumoActual).subscribe({
        next: () => {
          this.obtenerInsumos(); // Actualizar la lista de insumos
          this.cerrarModal();
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
          this.cerrarModal();
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
