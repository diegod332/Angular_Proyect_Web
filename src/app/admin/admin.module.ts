import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing.module';
import { PanelComponent } from './pages/panel/panel.component';
import { FormsModule } from '@angular/forms';
import { CitasComponent } from './pages/citas/citas.component';
import { CitasProgramadasComponent } from './pages/citas-programadas/citas-programadas.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { ServiciosDentalesComponent } from './pages/servicios-dentales/servicios-dentales.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
@NgModule({
  declarations: [
    PanelComponent,
    CitasComponent,
    CitasProgramadasComponent,
    InventarioComponent,
    ServiciosDentalesComponent,
    ClientesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {} // Asegúrate de que el nombre sea "AdminModule"