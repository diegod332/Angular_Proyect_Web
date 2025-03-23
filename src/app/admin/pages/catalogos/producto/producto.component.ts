import { Component } from '@angular/core';

@Component({
  selector: 'app-producto',
  standalone: false,

  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {
  breadText: any = {
    'title': 'Catalogos',
    'title2': 'productos',
    'title3': 'Listar registros',
  }
}
