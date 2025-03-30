import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrls: ['../../admin.component.css'],
})
export class ClientesComponent implements OnInit {
  cargando: boolean = false; // Indicador de carga
  clientes: any[] = []; // Lista de clientes
  clienteActual: any = {
    firstName: '',
    middleName: '',
    lastName: '',
    emergencyNumber: '',
    email: '',
    password: '',
  }; // Cliente actual para agregar o editar
  esEditar: boolean = false; // Indica si se está editando un cliente
  searchTerm: string = ''; // Término de búsqueda

  private apiURL = 'http://odontologiaintegral.site/api/clients';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  esNumeroValido(numero: string): boolean {
    const numeroRegex = /^[0-9]{10}$/; // Solo números con exactamente 10 dígitos
    return numeroRegex.test(numero);
  }

  obtenerClientes(): void {
    this.http.get<any>(this.apiURL).subscribe({
      next: (response) => {
        this.clientes = response.data.map((cliente: any) => ({
          ...cliente,
          fullName: `${cliente.firstName} ${cliente.middleName} ${cliente.lastName}`, // Concatenar los nombres
        }));
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
      },
    });
  }
  get filteredClientes(): any[] {
    if (!this.searchTerm.trim()) {
      console.log('Sin término de búsqueda, mostrando todos los clientes:', this.clientes);
      return this.clientes;
    }
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    const filtrados = this.clientes.filter((cliente) =>
      cliente.fullName.toLowerCase().includes(lowerCaseTerm) || // Filtra por nombre completo
      cliente.email?.toLowerCase().includes(lowerCaseTerm) || // Filtra por correo electrónico
      cliente.emergencyNumber.includes(lowerCaseTerm) // Filtra por número de emergencia
    );
    console.log('Clientes filtrados:', filtrados);
    return filtrados;
  }

  abrirModalNuevo(): void {
    this.clienteActual = { firstName: '', middleName: '', lastName: '', emergencyNumber: '', email: '', password: '' };
    this.esEditar = false;
    const modal = document.getElementById('nuevoModal') as HTMLDivElement;
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
  }

  abrirModalEditar(cliente: any): void {
    this.clienteActual = { ...cliente };
    this.esEditar = true;
    const modal = document.getElementById('nuevoModal') as HTMLDivElement;
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
  }

  cerrarModal(modalId: string): void {
    const modal = document.getElementById(modalId) as HTMLDivElement;
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
  }

  esCorreoValido(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correos electrónicos
    return emailRegex.test(email);
  }

  esNombreValido(nombre: string): boolean {
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo letras y espacios
    return nombreRegex.test(nombre);
  }

  esApellidoValido(apellido: string): boolean {
    const apellidoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/; // Solo letras, sin espacios
    return apellidoRegex.test(apellido);
  }

  guardarCliente(): void {
    // Validaciones
    if (!this.clienteActual.firstName || !this.esNombreValido(this.clienteActual.firstName)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre inválido',
        text: 'El nombre solo puede contener letras y espacios y debe tener al menos 3 caracteres.',
      });
      return;
    }

    if (!this.clienteActual.middleName || !this.esApellidoValido(this.clienteActual.middleName)) {
      Swal.fire({
        icon: 'error',
        title: 'Apellido Materno inválido',
        text: 'El apellido materno solo puede contener letras y no debe incluir espacios.',
      });
      return;
    }

    if (!this.clienteActual.lastName || !this.esApellidoValido(this.clienteActual.lastName)) {
      Swal.fire({
        icon: 'error',
        title: 'Apellido Paterno inválido',
        text: 'El apellido paterno solo puede contener letras y no debe incluir espacios.',
      });
      return;
    }

    if (!this.clienteActual.emergencyNumber || !this.esNumeroValido(this.clienteActual.emergencyNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Número de Emergencia inválido',
        text: 'El número de emergencia debe contener solo números y tener exactamente 10 dígitos.',
      });
      return;
    }

    // Validación: Verificar si el número de emergencia ya existe
    const numeroDuplicado = this.clientes.some(
      (cliente) =>
        cliente.emergencyNumber === this.clienteActual.emergencyNumber &&
        cliente._id !== this.clienteActual._id
    );

    if (numeroDuplicado) {
      Swal.fire({
        icon: 'error',
        title: 'Número de Emergencia duplicado',
        text: 'El número de emergencia ya está registrado para otro cliente.',
      });
      return;
    }

    // Validar correo y contraseña solo al crear un cliente
    if (!this.esEditar) {
      if (!this.clienteActual.email || !this.esCorreoValido(this.clienteActual.email)) {
        Swal.fire({
          icon: 'error',
          title: 'Correo Electrónico inválido',
          text: 'Por favor, ingresa un correo electrónico válido.',
        });
        return;
      }

      if (!this.clienteActual.password || this.clienteActual.password.trim().length < 9) {
        Swal.fire({
          icon: 'error',
          title: 'Contraseña inválida',
          text: 'La contraseña debe tener al menos 9 caracteres.',
        });
        return;
      }
    }

    // Guardar o actualizar cliente
    if (this.esEditar) {
      this.http.put(`${this.apiURL}/${this.clienteActual._id}`, this.clienteActual).subscribe({
        next: () => {
          this.obtenerClientes();
          this.cerrarModal('nuevoModal');
          Swal.fire({
            icon: 'success',
            title: 'Cliente actualizado',
            text: 'El cliente se actualizó correctamente.',
          });
        },
        error: (err) => {
          console.error('Error al editar cliente:', err);
        },
      });
    } else {
      this.http.post(this.apiURL, this.clienteActual).subscribe({
        next: () => {
          this.obtenerClientes();
          this.cerrarModal('nuevoModal');
          Swal.fire({
            icon: 'success',
            title: 'Cliente creado',
            text: 'El cliente se creó correctamente.',
          });
        },
        error: (err) => {
          console.error('Error al crear cliente:', err);
        },
      });
    }
  }
  eliminarCliente(id: string): void {
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
            this.clientes = this.clientes.filter((cliente) => cliente._id !== id);
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El cliente ha sido eliminado correctamente.',
            });
          },
          error: (err) => {
            console.error('Error al eliminar cliente:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al eliminar el cliente. Por favor, inténtalo de nuevo.',
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