import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-servicios',
  standalone: false,
  templateUrl: './servicios.component.html',
  styleUrls: ['../../../src/assets/css/landing-global.css'], // Ruta relativa desde landing.component.ts
  encapsulation: ViewEncapsulation.None // Desactiva la encapsulación
  
})
export class ServiciosComponent {
  openModal(modalId: number) {
    const modal = document.getElementById(`modal${modalId}`) as HTMLDialogElement;
    modal?.showModal();
  }

  closeModal(modalId: number) {
    const modal = document.getElementById(`modal${modalId}`) as HTMLDialogElement;
    modal?.close();
  }
}
