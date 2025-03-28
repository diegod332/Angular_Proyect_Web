import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../../assets/css/landing-global.css'],
  encapsulation: ViewEncapsulation.None,
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
            this.router.navigate(['/admin/panel']); // Redirigir al panel administrativo
          } else {
            alert('No tienes permiso para acceder al panel administrativo.');
          }

          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
          alert('Usuario o contraseña incorrectos.');
          this.cargando = false;
        },
      });
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}