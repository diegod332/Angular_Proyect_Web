import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var bootstrap: any; // Declarar Bootstrap para usar su API

@Component({
  selector: 'app-servicios-dentales',
  standalone: false,
  templateUrl: './servicios-dentales.component.html',
  styleUrls: ['../../admin.component.css'],
})
export class ServiciosDentalesComponent implements OnInit {
  cargando: boolean = false; 
  servicios: any[] = []; 
  servicioActual: any = { serviceName: '', price: 0 }; // Servicio actual para agregar o editar
  esEditar: boolean = false; // Indica si se está editando un servicio
<<<<<<< HEAD

  private apiURL = 'http://localhost:3004/api/services'; // Ruta base para servicios
=======
  searchTerm: string = ''; 
  private apiURL = 'http://localhost:3004/api/services'; 
>>>>>>> f344b30bace9e387ec4ee7931b02fc3ad5d1bd10

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  get filteredServicios(): any[] {
    if (!this.searchTerm.trim()) {
      return this.servicios; 
    }
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    return this.servicios.filter((servicio) =>
      servicio.serviceName.toLowerCase().includes(lowerCaseTerm) || // Filtra por nombre del servicio
      servicio.price.toString().includes(lowerCaseTerm) // Filtra por precio
    );
  }

  ngOnInit(): void {
    this.obtenerServicios();
  }

  esNombreValido(nombre: string): boolean {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(nombre);
  }
  

  // Obtener todos los servicios
  obtenerServicios(): void {
    this.http.get<any>(this.apiURL).subscribe({
      next: (response) => {
        this.servicios = response.data; 
      },
      error: (err) => {
        console.error('Error al obtener servicios:', err);
        if (err.status === 404) {
          this.servicios = [];
        } else if (err.status === 500) {
          console.error('Error interno del servidor.');
        } else {
          console.error('Error inesperado:', err.message);
        }
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
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo letras y espacios
  
    // Validación: El nombre debe tener al menos 3 caracteres
    if (!this.servicioActual.serviceName || this.servicioActual.serviceName.trim().length < 3) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre inválido',
        text: 'El nombre del servicio debe tener al menos 3 caracteres.',
      });
      return;
    }
  
    // Validación: El nombre solo puede contener letras y espacios
    if (!nombreRegex.test(this.servicioActual.serviceName)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre inválido',
        text: 'El nombre solo puede contener letras y espacios.',
      });
      return;
    }
  
    // Validación: El nombre debe ser único
    const nombreDuplicado = this.servicios.some(
      (servicio) =>
        servicio.serviceName.toLowerCase() === this.servicioActual.serviceName.toLowerCase() &&
        servicio._id !== this.servicioActual._id 
    );
  
    if (nombreDuplicado) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre duplicado',
        text: 'Ya existe un servicio con este nombre. Por favor, elige otro.',
      });
      return;
    }
  
    // Validación: El precio debe estar entre 1 y 100000
    if (this.servicioActual.price < 1 || this.servicioActual.price > 100000) {
      Swal.fire({
        icon: 'error',
        title: 'Precio inválido',
        text: 'El precio debe estar entre 1 y 100000.',
      });
      return;
    }
  
    if (this.esEditar) {
      // Actualizar servicio existente
      this.http.put(`${this.apiURL}/${this.servicioActual._id}`, this.servicioActual).subscribe({
        next: () => {
<<<<<<< HEAD
          this.obtenerServicios(); // Actualizar la lista de servicios
          this.cerrarModal('servicioModal');
=======
          this.obtenerServicios(); 
          this.cerrarModal();
          Swal.fire({
            icon: 'success',
            title: 'Servicio actualizado',
            text: 'El servicio se actualizó correctamente.',
          });
>>>>>>> f344b30bace9e387ec4ee7931b02fc3ad5d1bd10
        },
        error: (err) => {
          console.error('Error al actualizar servicio:', err);
        },
      });
    } else {
      // Crear nuevo servicio
      this.http.post(this.apiURL, this.servicioActual).subscribe({
        next: () => {
<<<<<<< HEAD
          this.obtenerServicios(); // Actualizar la lista de servicios
          this.cerrarModal('servicioModal');
=======
          this.obtenerServicios(); 
          this.cerrarModal();
          Swal.fire({
            icon: 'success',
            title: 'Servicio creado',
            text: 'El servicio se creó correctamente.',
          });
>>>>>>> f344b30bace9e387ec4ee7931b02fc3ad5d1bd10
        },
        error: (err) => {
          console.error('Error al crear servicio:', err);
        },
      });
    }
  }
<<<<<<< HEAD

=======
  // Eliminar un servicio
>>>>>>> f344b30bace9e387ec4ee7931b02fc3ad5d1bd10
  eliminarServicio(id: string): void {
    if (!id) {
      console.error('El ID del servicio no está definido.');
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
            this.servicios = this.servicios.filter((servicio) => servicio._id !== id);
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El servicio ha sido eliminado correctamente.',
            });
          },
          error: (err) => {
            console.error('Error al eliminar servicio:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al eliminar el servicio. Por favor, inténtalo de nuevo.',
            });
          },
        });
      }
    });
  }
<<<<<<< HEAD

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

=======
>>>>>>> f344b30bace9e387ec4ee7931b02fc3ad5d1bd10
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