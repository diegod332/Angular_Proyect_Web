import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-contacto',
  standalone: false,
  
  templateUrl: './contacto.component.html',
  styleUrls: ['../../../src/assets/css/landing-global.css'], // Ruta relativa desde landing.component.ts
    encapsulation: ViewEncapsulation.None // Desactiva la encapsulación
})
export class ContactoComponent {

}
