import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <main [@routeAnimations]="prepareRoute(outlet)">
      <router-outlet #outlet="outlet"></router-outlet>
    </main>
  `,
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ transform: 'translateY(4px)' }), 
        animate('1s ease-in-out', style({ transform: 'translateY(0)' })) 
      ])
    ])
  ],
  standalone: false,
})
export class AppComponent {

  prepareRoute(outlet: any) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
