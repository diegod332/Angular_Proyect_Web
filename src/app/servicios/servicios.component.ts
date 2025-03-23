import { Component } from '@angular/core';

@Component({
  selector: 'app-servicios',
  standalone: false,
  
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
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
