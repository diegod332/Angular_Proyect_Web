import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

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
  searchTerm: string = '';
  private apiURL = 'http://odontologiaintegral.site/api/services';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

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

  // Abrir el modal para agregar un nuevo servicio
  abrirModalNuevo(): void {
    this.servicioActual = { serviceName: '', price: 0 };
    this.esEditar = false;
    const modal = document.getElementById('servicioModal') as HTMLDivElement;
    modal.style.display = 'block';
    modal.classList.add('show');
  }

  // Abrir el modal para editar un servicio existente
  abrirModalEditar(servicio: any): void {
    this.servicioActual = { ...servicio };
    this.esEditar = true;
    const modal = document.getElementById('servicioModal') as HTMLDivElement;
    modal.style.display = 'block';
    modal.classList.add('show');
  }

  // Cerrar el modal
  cerrarModal(): void {
    const modal = document.getElementById('servicioModal') as HTMLDivElement;
    modal.style.display = 'none';
    modal.classList.remove('show');
  }

  // Guardar un servicio (crear o editar)
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
      // Editar servicio
      this.http.put(`${this.apiURL}/${this.servicioActual._id}`, this.servicioActual).subscribe({
        next: () => {
          this.obtenerServicios();
          this.cerrarModal();
          Swal.fire({
            icon: 'success',
            title: 'Servicio actualizado',
            text: 'El servicio se actualizó correctamente.',
          });
        },
        error: (err) => {
          console.error('Error al editar servicio:', err);
        },
      });
    } else {
      // Crear nuevo servicio
      this.http.post(this.apiURL, this.servicioActual).subscribe({
        next: () => {
          this.obtenerServicios();
          this.cerrarModal();
          Swal.fire({
            icon: 'success',
            title: 'Servicio creado',
            text: 'El servicio se creó correctamente.',
          });
        },
        error: (err) => {
          console.error('Error al crear servicio:', err);
        },
      });
    }
  }
  // Eliminar un servicio
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

  cerrarSesion(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando = true; // Muestra la pantalla de carga

        this.authService.logout().subscribe({
          next: () => {
            setTimeout(() => {
              this.cargando = false; // Oculta la pantalla de carga
              this.router.navigate(['/login']); // Redirige al login
            }, 2000); // Retraso de 2 segundos para la animación
          },
          error: (err: unknown) => {
            console.error('Error al cerrar sesión:', err);
            this.cargando = false; // Oculta la pantalla de carga en caso de error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al intentar cerrar sesión.',
            });
          },
        });
      }
    });
  }
}