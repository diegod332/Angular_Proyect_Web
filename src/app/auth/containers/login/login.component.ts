import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../../app.service'; // Asegúrate de importar correctamente el servicio

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  loginForm: FormGroup;
  cargando: boolean = false; // Controla la pantalla de carga

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appService: AppService // Inyecta el servicio AppService
  ) {
    // Inicializar el formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo para el correo electrónico
      password: ['', [Validators.required]], // Campo para la contraseña
    });

    console.log(this.loginForm); // Verifica que el formulario se inicialice correctamente
  }

  iniciarSesion() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.cargando = true; // Mostrar la pantalla de carga

      // Llamar al servicio para iniciar sesión
      this.appService.login({ email, password }).subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso:', response);

          // Guardar el token y los datos del usuario en localStorage
          localStorage.setItem('JWT_TOKEN', response.token);
          localStorage.setItem('USER_DATA', JSON.stringify(response.user));

          // Redirigir al dashboard o página principal
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          alert('Usuario o contraseña incorrectos.');
          this.cargando = false; // Ocultar pantalla de carga
        },
      });
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}