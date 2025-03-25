import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing.module';
import { AdminComponent } from './admin.component';
import { PanelComponent } from './pages/panel/panel.component';

@NgModule({
  declarations: [
    AdminComponent,
    PanelComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule, // Importa el módulo de rutas
  ],
})
export class AdminModule {}