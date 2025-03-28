import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
  standalone: false
})
export class ServiciosComponent {

  mostrarBoton: boolean = false;

  servicios = [
    {
      titulo: 'Limpieza dental',
      descripcion: 'Una limpieza dental profesional ayuda a eliminar la placa y el sarro acumulado.',
      costo: '$150',
      imagen: 'assets/img/limpieza_dental.jpg'
    },
    {
      titulo: 'Extracción de muelas',
      descripcion: 'La extracción de muelas evita problemas futuros como infecciones y dolor.',
      costo: '$300',
      imagen: 'assets/img/extraccion.jpg'
    },
    {
      titulo: 'Ortodoncia',
      descripcion: 'Corrige problemas de alineación dental y mordida mediante brackets y alineadores.',
      costo: '$5000',
      imagen: 'assets/img/ortodoncia.jpg'
    },
    {
      titulo: 'Blanqueamiento dental',
      descripcion: 'Elimina manchas y decoloraciones en los dientes para una sonrisa más blanca.',
      costo: '$800',
      imagen: 'assets/img/blanqueamiento.jpg'
    },
    {
      titulo: 'Implantes dentales',
      descripcion: 'Reemplaza dientes perdidos con implantes dentales para una sonrisa completa.',
      costo: '$7000',
      imagen: 'assets/img/implante.jpg'
    },
    {
      titulo: 'Endodoncia',
      descripcion: 'Trata infecciones en la pulpa dental para salvar el diente y evitar su extracción.',
      costo: '$2000',
      imagen: 'assets/img/endodoncia.jpg'
    },
    {
      titulo: 'Bruxismo',
      descripcion: 'Tratamiento para el bruxismo, que consiste en apretar o rechinar los dientes.',
      costo: '$1000',
      imagen: 'assets/img/bruxismo.jpg'
    },
    {
      titulo: 'Muelas del juicio',
      descripcion: 'Extracción de las muelas del juicio para evitar problemas de espacio y dolor.',
      costo: '$400',
      imagen: 'assets/img/muelasJuicio.png'
    },
    {
      titulo: 'Periodoncia',
      descripcion: 'Tratamiento para enfermedades periodontales como la gingivitis y la periodontitis.',
      costo: '$2500',
      imagen: 'assets/img/periodoncia.jpeg'
    }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.mostrarBoton = scrollPosition > 400;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  currentSlide = 0;

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.servicios.length) % this.servicios.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.servicios.length;
  }
}
