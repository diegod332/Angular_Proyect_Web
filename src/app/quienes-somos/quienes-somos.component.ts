import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quienes-somos',
  standalone: false,
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css'] // Aquí también corregí el nombre de la propiedad 'styleUrls'
})
export class QuienesSomosComponent {

  constructor(private router: Router) {}

  // Método para redirigir a otra página
  redirectToOtherPage() {
    this.router.navigate(['/login']); // Cambia '/otra-pagina' por la ruta deseada
  }
}
