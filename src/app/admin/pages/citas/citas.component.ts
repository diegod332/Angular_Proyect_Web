import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['../../admin.component.css'],
  standalone: false,
})
export class CitasComponent implements OnInit {
  cargando: boolean = false;
  citas: any[] = [];
  citaActual: any = {
    fullName: '',
    appointmentDate: '',
    appointmentTime: '',
    service: '',
    client: '',
    status: 'pendiente',
  };
  esEditar: boolean = false;
  clientes: any[] = [];
  servicios: any[] = [];

  private apiURL = 'http://localhost:3004/api/appointments';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  // Formatea una fecha al formato ISO
  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  // Inicializa el componente cargando citas, servicios y clientes
  ngOnInit(): void {
    this.obtenerCitas();
    this.obtenerServicios();
    this.obtenerClientes();
  }

  // Obtiene todos los servicios
  obtenerServicios(): void {
    this.http.get<any>('http://localhost:3004/api/services').subscribe({
      next: (response) => {
        this.servicios = response.data;
      },
      error: (err) => {
        console.error('Error al obtener servicios:', err);
      },
    });
  }

  // Obtiene todos los clientes
  obtenerClientes(): void {
    this.http.get<any>('http://localhost:3004/api/clients').subscribe({
      next: (response) => {
        this.clientes = response.data.map((cliente: any) => ({
          ...cliente,
          id: cliente._id,
          fullName: `${cliente.firstName} ${cliente.middleName || ''} ${cliente.lastName}`.trim(),
        }));
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
      },
    });
  }

  // Obtiene todas las citas
  obtenerCitas(): void {
    this.http.get<any>(this.apiURL).subscribe({
      next: (response) => {
        this.citas = response.data.map((cita: any) => ({
          ...cita,
          appointmentDate: cita.appointmentDate,
          id: cita.id,
        }));
      },
      error: (err) => {
        if (err.status === 404) {
          this.citas = [];
        } else {
          console.error('Error al obtener citas:', err);
        }
      },
    });
  }

  // Abre el modal para agregar una nueva cita
  abrirModalNueva(): void {
    this.citaActual = {
      fullName: '',
      appointmentDate: '',
      appointmentTime: '',
      service: '',
      client: '',
      status: 'pendiente',
    };
    this.esEditar = false;

    if (this.clientes.length === 0) {
      this.obtenerClientes();
    }
    if (this.servicios.length === 0) {
      this.obtenerServicios();
    }

    const modal = document.getElementById('nuevoModal') as HTMLDivElement;
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
  }

  // Abre el modal para editar una cita existente
  abrirModalEditar(cita: any): void {
    if (!cita.id) {
      console.error('El objeto cita no contiene un id:', cita);
      return;
    }

    this.citaActual = {
      ...cita,
      appointmentDate: cita.appointmentDate,
      service: cita.service || '',
    };

    this.esEditar = true;

    const modal = document.getElementById('editarModal') as HTMLDivElement;
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
  }

  // Cierra un modal por su ID
  cerrarModal(modalId: string): void {
    const modal = document.getElementById(modalId) as HTMLDivElement;
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
  }

  // Guarda una cita nueva o actualiza una existente
  guardarCita(): void {
    if (!this.citaActual.client) {
      Swal.fire({
        icon: 'error',
        title: 'Cliente no seleccionado',
        text: 'Por favor, selecciona un cliente.',
      });
      return;
    }

    if (!this.citaActual.appointmentDate) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha inválida',
        text: 'Por favor, selecciona una fecha válida.',
      });
      return;
    }

    if (!this.citaActual.appointmentTime) {
      Swal.fire({
        icon: 'error',
        title: 'Hora inválida',
        text: 'Por favor, selecciona una hora válida.',
      });
      return;
    }

    if (!this.citaActual.service) {
      Swal.fire({
        icon: 'error',
        title: 'Servicio no seleccionado',
        text: 'Por favor, selecciona un servicio.',
      });
      return;
    }

    if (!this.citaActual.status) {
      Swal.fire({
        icon: 'error',
        title: 'Estado no seleccionado',
        text: 'Por favor, selecciona un estado.',
      });
      return;
    }

    this.citaActual.appointmentDate = this.formatDate(this.citaActual.appointmentDate);

    if (this.esEditar) {
      if (!this.citaActual.id) {
        console.error('El ID de la cita no está definido.');
        return;
      }

      this.http.put(`${this.apiURL}/${this.citaActual.id}`, this.citaActual).subscribe({
        next: () => {
          this.obtenerCitas();
          this.cerrarModal('editarModal');
          Swal.fire({
            icon: 'success',
            title: 'Cita actualizada',
            text: 'La cita se actualizó correctamente.',
          });
        },
        error: (err) => {
          console.error('Error al editar cita:', err);
          Swal.fire({
            icon: 'error',
            title: 'Servicio no seleccionado',
            text: 'Por favor, selecciona un servicio.',
          });
        },
      });
    } else {
      this.http.post(this.apiURL, this.citaActual).subscribe({
        next: () => {
          this.obtenerCitas();
          this.cerrarModal('nuevoModal');
          Swal.fire({
            icon: 'success',
            title: 'Cita creada',
            text: 'La cita se creó correctamente.',
          });
        },
        error: (err) => {
          console.error('Error al crear cita:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al crear la cita. Por favor, inténtalo de nuevo.',
          });
        },
      });
    }
  }

  // Elimina una cita por su ID
  eliminarCita(id: string): void {
    if (!id) {
      console.error('El ID de la cita no está definido.');
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
            this.citas = this.citas.filter((cita) => cita.id !== id);
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'La cita ha sido eliminada correctamente.',
            });
          },
          error: (err) => {
            console.error('Error al eliminar cita:', err);
          },
        });
      }
    });
  }

  // Cierra la sesión del usuario
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