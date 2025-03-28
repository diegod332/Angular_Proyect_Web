import { Component, HostListener, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-contacto',
  standalone: false,
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'], // Ruta relativa desde landing.component.ts
})
export class ContactoComponent {

  mostrarBoton: boolean = false;

  @HostListener('window:scroll', [])
    onWindowScroll(): void {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.mostrarBoton = scrollPosition > 200;
    }
  
    scrollToTop(): void {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

}
