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
  searchTerm: string = '';

  private apiURL = 'http://odontologiaintegral.site/api/appointments';
  minDate: string | undefined;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  // Formatea una fecha al formato ISO
  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  // Inicializa el componente cargando citas, servicios y clientes
  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Fecha mínima para el campo de fecha
    this.obtenerCitas();
    this.obtenerServicios();
    this.obtenerClientes();
  }

  get filteredCitas(): any[] {
    if (!this.searchTerm.trim()) {
      console.log('Sin término de búsqueda, mostrando todos los clientes:', this.citas);
      return this.citas;
    }
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    const filtrados = this.citas.filter((cita) =>
      cita.fullName.toLowerCase().includes(lowerCaseTerm) || // Filtra por nombre completo
      cita.service.toLowerCase().includes(lowerCaseTerm) || // Filtra por servicio
      cita.appointmentTime.includes(lowerCaseTerm) // Filtra por hora
    );
    console.log('Clientes filtrados:', filtrados);
    return filtrados;
  }

  // Obtiene todos los servicios
  obtenerServicios(): void {
    this.http.get<any>('http://odontologiaintegral.site/api/services').subscribe({
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
    this.http.get<any>('http://odontologiaintegral.site/api/clients').subscribe({
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
    const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato ISO (YYYY-MM-DD)
  
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
  
    // Validación: La fecha no debe ser anterior a la actual
    if (this.citaActual.appointmentDate < today) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha inválida',
        text: 'La fecha no puede ser anterior a la fecha actual.',
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
            title: 'Error',
            text: 'Hubo un problema al actualizar la cita.',
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