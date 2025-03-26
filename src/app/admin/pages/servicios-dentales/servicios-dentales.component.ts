import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

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

  private apiURL = 'http://localhost:3004/api/services'; // Cambia la URL según tu configuración

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
    if (this.esEditar) {
      // Editar servicio
      this.http.put(`${this.apiURL}/${this.servicioActual._id}`, this.servicioActual).subscribe({
        next: () => {
          this.obtenerServicios(); // Actualizar la lista de servicios
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al editar servicio:', err);
        },
      });
    } else {
      // Crear nuevo servicio
      this.http.post(this.apiURL, this.servicioActual).subscribe({
        next: () => {
          this.obtenerServicios(); // Actualizar la lista de servicios
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear servicio:', err);
        },
      });
    }
  }

  // Eliminar un servicio
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