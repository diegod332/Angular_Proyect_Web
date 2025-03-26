import {
  AfterViewInit,
  NgZone,
  Component,
  OnInit,
  HostListener,
  ViewEncapsulation,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'], // Cambiado a "styleUrls"
  encapsulation: ViewEncapsulation.Emulated, // Encapsulación predeterminada
})
export class AdminComponent implements OnInit, AfterViewInit {
  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    // Lógica de inicialización
  }

  ngAfterViewInit(): void {
    // Lógica después de que la vista se haya inicializado
  }
}