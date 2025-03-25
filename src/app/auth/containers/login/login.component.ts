import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  iniciarSesion() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.cargando = true;

      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.router.navigate(['/admin/panel']);
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          alert('Usuario o contraseña incorrectos.');
          this.cargando = false;
        },
      });
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}
