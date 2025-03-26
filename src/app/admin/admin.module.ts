import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing.module';
import { PanelComponent } from './pages/panel/panel.component';
import { CitasComponent } from './pages/citas/citas.component';

@NgModule({
  declarations: [
    PanelComponent,
    CitasComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {} // Asegúrate de que el nombre sea "AdminModule"