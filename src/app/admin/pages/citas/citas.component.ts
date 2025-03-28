import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

declare var bootstrap: any; // Declarar Bootstrap para usar su API

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['../../admin.component.css'],
  standalone: false,
})
export class CitasComponent implements OnInit {
  cargando: boolean = false; // Indicador de carga
  citas: any[] = []; // Lista de citas
  servicios: any[] = []; // Lista de servicios para el menú desplegable
  estados: string[] = ['Pendiente', 'Finalizado', 'Cancelado']; // Lista de estados para el menú desplegable
  citaActual: any = { programar: false, duracion: 3, intervalo: 'semanal', servicio: '', estado: 'Pendiente' }; // Inicializa con valores predeterminados
  esEditar: boolean = false; // Indica si se está editando una cita

  // Propiedades para los detalles de la cita
  detalleNombre: string = '';
  detalleFecha: string = '';
  detalleHora: string = '';
  detalleServicio: string = '';
  detalleEstado: string = '';

  private apiURL = 'http://localhost:3004/api/appointments'; // Ruta base para citas
  private apiServicesURL = 'http://localhost:3004/api/services'; // Ruta base para servicios

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerCitas();
    this.obtenerServicios(); // Cargar servicios al iniciar
  }

  // Obtener todas las citas
  obtenerCitas(): void {
    this.http.get<any>(this.apiURL).subscribe({
      next: (response) => {
        this.citas = response.data;
      },
      error: (err) => {
        console.error('Error al obtener citas:', err);
      },
    });
  }

  // Obtener todos los servicios
  obtenerServicios(): void {
    this.http.get<any>(this.apiServicesURL).subscribe({
      next: (response) => {
        this.servicios = response.data;
      },
      error: (err) => {
        console.error('Error al obtener servicios:', err);
        this.servicios = []; // Asegura que la lista esté inicializada
      },
    });
  }

  // Abrir el modal para agregar una nueva cita
  abrirModalNuevaCita(): void {
    this.citaActual = { programar: false, duracion: 3, intervalo: 'semanal', servicio: '', estado: 'Pendiente' }; // Limpia la cita actual y establece valores predeterminados
    this.esEditar = false; // Modo agregar
    this.mostrarModal('nuevoModal');
  }

  // Cerrar el modal de nueva cita
  cerrarModalNuevaCita(): void {
    this.cerrarModal('nuevoModal');
  }

  // Abrir el modal para editar una cita existente
  abrirModalEditar(cita: any): void {
    this.citaActual = { ...cita }; // Copia la cita seleccionada
    this.esEditar = true; // Modo editar
    this.mostrarModal('editarModal');
  }

  // Cerrar el modal de edición
  cerrarModalEditar(): void {
    this.cerrarModal('editarModal');
  }

  // Abrir el modal de detalles y asignar los valores
  abrirModalVer(cita: any): void {
    this.detalleNombre = cita.nombreCompleto;
    this.detalleFecha = cita.fechaCita;
    this.detalleHora = cita.horaCita;
    this.detalleServicio = cita.servicio;
    this.detalleEstado = cita.estado;

    this.mostrarModal('verModal');
  }

  // Cerrar el modal de detalles
  cerrarModalVer(): void {
    this.cerrarModal('verModal');
  }

  // Guardar una cita (crear o editar)
  guardarCita(): void {
    if (this.esEditar) {
      // Editar cita existente
      this.http.put(`${this.apiURL}/${this.citaActual.id}`, this.citaActual).subscribe({
        next: () => {
          this.obtenerCitas(); // Actualizar la lista de citas
          this.cerrarModalEditar();
        },
        error: (err) => {
          console.error('Error al actualizar cita:', err);
        },
      });
    } else {
      // Crear nueva cita
      this.http.post(this.apiURL, this.citaActual).subscribe({
        next: () => {
          this.obtenerCitas(); // Actualizar la lista de citas
          this.cerrarModalNuevaCita();
        },
        error: (err) => {
          console.error('Error al crear cita:', err);
        },
      });
    }
  }

  // Eliminar una cita
  eliminarCita(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      this.http.delete(`${this.apiURL}/${id}`).subscribe({
        next: () => {
          this.obtenerCitas(); // Actualizar la lista de citas
        },
        error: (err) => {
          console.error('Error al eliminar cita:', err);
        },
      });
    }
  }

  // Mostrar un modal utilizando Bootstrap
  mostrarModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Cerrar un modal utilizando Bootstrap
  cerrarModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

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
}