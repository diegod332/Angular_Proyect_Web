import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quienes-somos',
  standalone: false,
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['../../../src/assets/css/landing-global.css'], // Ruta relativa desde landing.component.ts
  encapsulation: ViewEncapsulation.None // Desactiva la encapsulación
})
export class QuienesSomosComponent {

  constructor(private router: Router) {}

  // Método para redirigir a otra página
  redirectToOtherPage() {
    this.router.navigate(['/login']); // Cambia '/otra-pagina' por la ruta deseada
  }
}
