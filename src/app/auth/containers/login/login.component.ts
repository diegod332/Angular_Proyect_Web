import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  loginForm: FormGroup;
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  iniciarSesion(): void {
    if (this.loginForm.valid) {
      this.cargando = true;
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response: any) => {
          const userRole = this.authService.getUserRole(); // Obtiene el rol del usuario autenticado

          // Verificar el rol del usuario
          if (userRole === 'admin') {
            setTimeout(() => {
              this.router.navigate(['/admin/panel']); // Redirigir al panel administrativo
              this.cargando = false; // Oculta la pantalla de carga después del retraso
            }, 2000);
          } else {
            this.cargando = false; // Oculta la pantalla de carga
            Swal.fire({
              icon: 'error',
              title: 'Acceso denegado',
              text: 'No tienes permiso para acceder al panel administrativo.',
            });
          }
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
          this.cargando = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: 'Usuario o contraseña incorrectos.',
          });
        },
      });
    } else {
       Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, complete todos los campos.',
    });
    }
  }
}