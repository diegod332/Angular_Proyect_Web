import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var bootstrap: any; // Declarar Bootstrap para usar su API

@Component({
  selector: 'app-inventario',
  standalone: false,
  templateUrl: './inventario.component.html',
  styleUrls: ['../../admin.component.css'],
})
export class InventarioComponent implements OnInit {
  cargando: boolean = false; 
  insumos: any[] = []; // Lista de insumos
  insumoActual: any = { name: '', quantity: 0, expirationDate: '', price: 0 }; // Insumo actual para agregar o editar
  esEditar: boolean = false; // Indica si se está editando un insumo
  minDate: string = ''; // Fecha mínima para el campo de caducidad
  searchTerm: string = ''; // Término de búsqueda

<<<<<<< HEAD
  private apiURL = 'http://localhost:3004/api/supplies'; // Ruta base para insumos
=======
  private apiURL = 'http://localhost:3004/api/supplies'; 
>>>>>>> f344b30bace9e387ec4ee7931b02fc3ad5d1bd10

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  esNombreValido(nombre: string): boolean {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(nombre);
  }
  

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; 
  }

  

  get filteredInsumos(): any[] {
    if (!this.searchTerm.trim()) {
      return this.insumos;
    }
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    return this.insumos.filter((insumo) =>
      insumo.name.toLowerCase().includes(lowerCaseTerm) || // Filtra por nombre
      insumo.quantity.toString().includes(lowerCaseTerm) || // Filtra por cantidad
      insumo.expirationDate.includes(lowerCaseTerm) || // Filtra por fecha de caducidad
      insumo.price.toString().includes(lowerCaseTerm) // Filtra por precio
    );
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Fecha mínima para el campo de caducidad
    this.obtenerInsumos();
  }

  obtenerInsumos(): void {
    this.http.get<any>(this.apiURL).subscribe({
      next: (response) => {
        this.insumos = response.data.map((insumo: any) => ({
          ...insumo,
          expirationDate: this.formatDate(insumo.expirationDate), // Convierte la fecha al formato YYYY-MM-DD
        }));
      },
      error: (err) => {
        if (err.status === 404) {
          this.insumos = [];
        } else {
          console.error('Error al obtener insumos:', err);
        }
      },
    });
  }

  abrirModalNuevo(): void {
<<<<<<< HEAD
    this.insumoActual = { name: '', quantity: 0, expirationDate: '', price: 0 }; // Limpia el insumo actual
    this.esEditar = false; // Modo agregar
    this.mostrarModal('insumoModal');
=======
    this.insumoActual = { name: '', quantity: 0, expirationDate: '', price: 0 };
    this.esEditar = false; 
    const modal = document.getElementById('insumoModal') as HTMLDivElement;
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    }
>>>>>>> f344b30bace9e387ec4ee7931b02fc3ad5d1bd10
  }

  abrirModalEditar(insumo: any): void {
<<<<<<< HEAD
    this.insumoActual = { ...insumo }; // Copia el insumo seleccionado
    this.esEditar = true; // Modo editar
    this.mostrarModal('insumoModal');
=======
    this.insumoActual = {
      ...insumo,
      expirationDate: this.formatDate(insumo.expirationDate),
    };
    this.esEditar = true; 
    const modal = document.getElementById('insumoModal') as HTMLDivElement;
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  cerrarModal(): void {
    const modal = document.getElementById('insumoModal') as HTMLDivElement;
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    }
>>>>>>> f344b30bace9e387ec4ee7931b02fc3ad5d1bd10
  }

  guardarInsumo(): void {
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo letras y espacios
  
    // Validación: El nombre debe tener al menos 3 caracteres
    if (!this.insumoActual.name || this.insumoActual.name.trim().length < 3) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre inválido',
        text: 'El nombre del insumo debe tener al menos 3 caracteres.',
      });
      return;
    }
  
    // Validación: El nombre solo puede contener letras y espacios
    if (!nombreRegex.test(this.insumoActual.name)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre inválido',
        text: 'El nombre solo puede contener letras y espacios.',
      });
      return;
    }
  
    // Validación: El nombre debe ser único
    const nombreDuplicado = this.insumos.some(
      (insumo) =>
        insumo.name.toLowerCase() === this.insumoActual.name.toLowerCase() &&
        insumo._id !== this.insumoActual._id 
    );
  
    if (nombreDuplicado) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre duplicado',
        text: 'Ya existe un insumo con este nombre. Por favor, elige otro.',
      });
      return;
    }
  
    // Validación: La cantidad debe estar entre 1 y 100000
if (this.insumoActual.quantity < 1 || this.insumoActual.quantity > 100000) {
  Swal.fire({
    icon: 'error',
    title: 'Cantidad inválida',
    text: 'La cantidad debe estar entre 1 y 100000.',
  });
  return;
}
  
    // Validación: La fecha de caducidad debe ser posterior a la fecha actual
    const today = new Date().toISOString().split('T')[0];
    if (!this.insumoActual.expirationDate || this.insumoActual.expirationDate < today) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha inválida',
        text: 'La fecha de caducidad debe ser posterior a la fecha actual.',
      });
      return;
    }
  
    // Validación: El precio debe estar entre 1 y 100000
if (this.insumoActual.price < 1 || this.insumoActual.price > 100000) {
  Swal.fire({
    icon: 'error',
    title: 'Precio inválido',
    text: 'El precio debe estar entre 1 y 100000.',
  });
  return;
}

    this.insumoActual.expirationDate = this.formatDate(this.insumoActual.expirationDate);
  
    if (this.esEditar) {
      // Editar insumo
      this.http.put(`${this.apiURL}/${this.insumoActual._id}`, this.insumoActual).subscribe({
        next: () => {
<<<<<<< HEAD
          this.obtenerInsumos(); // Actualizar la lista de insumos
          this.cerrarModal('insumoModal');
=======
          this.obtenerInsumos();
          this.cerrarModal();
          Swal.fire({
            icon: 'success',
            title: 'Insumo actualizado',
            text: 'El insumo se actualizó correctamente.',
          });
>>>>>>> f344b30bace9e387ec4ee7931b02fc3ad5d1bd10
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
<<<<<<< HEAD
          this.cerrarModal('insumoModal');
=======
          this.cerrarModal();
          Swal.fire({
            icon: 'success',
            title: 'Insumo creado',
            text: 'El insumo se creó correctamente.',
          });
>>>>>>> f344b30bace9e387ec4ee7931b02fc3ad5d1bd10
        },
        error: (err) => {
          console.error('Error al crear insumo:', err);
        },
      });
    }
  }
  eliminarInsumo(id: string): void {
    if (!id) {
      console.error('El ID del insumo no está definido.');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiURL}/${id}`).subscribe({
          next: () => {
            this.insumos = this.insumos.filter((insumo) => insumo._id !== id);
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El insumo ha sido eliminado.',
            });
          },
          error: (err) => {
            console.error('Error al eliminar insumo:', err);
          },
        });
      }
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

  cerrarSesion(): void {
    this.cargando = true;
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        this.cargando = false;
      },
    });
  }
}