import { Component } from '@angular/core';

@Component({
  selector: 'app-principal',
  standalone: false,

  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  breadText: any = {
    'title': 'Titulo',
    'title2': 'Titulo2',
    'title3': 'Titulo3',
  }
}
