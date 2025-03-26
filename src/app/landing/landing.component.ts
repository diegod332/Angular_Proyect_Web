import { Component, ViewEncapsulation } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrls: ['../../../src/assets/css/landing-global.css'], // Ruta relativa desde landing.component.ts
  encapsulation: ViewEncapsulation.None // Desactiva la encapsulación


})
export class LandingComponent {

  constructor(private router: Router) {
  }
  loadlogin(){
    this.router.navigate(['/login']).then(() => {
    });
  }
}
