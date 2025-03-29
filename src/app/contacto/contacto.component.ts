import { Component, HostListener } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  standalone: false,
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'], // Ruta relativa desde landing.component.ts
})
export class ContactoComponent {
  mostrarBoton: boolean = false;

  // Propiedades para el formulario
  nombre: string = '';
  email: string = '';
  mensaje: string = '';

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.mostrarBoton = scrollPosition > 200;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Método para enviar el formulario usando EmailJS
  enviarFormulario(): void {
    const templateParams = {
      from_name: this.nombre,
      from_email: this.email,
      message: this.mensaje,
    };

    emailjs
      .send(
        'service_vmk81pl', // Reemplaza con tu Service ID de EmailJS
        'template_d019mgt', // Reemplaza con tu Template ID de EmailJS
        templateParams,
        'fFOEnLxFZYTQ0H-Og' // Reemplaza con tu User ID de EmailJS
      )
      .then(
        (response: EmailJSResponseStatus) => {
          console.log('Correo enviado con éxito:', response.status, response.text);
          Swal.fire('Éxito', 'El mensaje se envió correctamente.', 'success');
        },
        (error) => {
          console.error('Error al enviar el correo:', error);
          Swal.fire('Error', 'No se pudo enviar el mensaje. Inténtalo más tarde.', 'error');
        }
      );
  }
}