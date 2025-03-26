import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './pages/panel/panel.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CitasComponent } from './pages/citas/citas.component';
import { CitasProgramadasComponent } from './pages/citas-programadas/citas-programadas.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { ServiciosDentalesComponent } from './pages/servicios-dentales/servicios-dentales.component';
import { ClientesComponent } from './pages/clientes/clientes.component';



const routes: Routes = [
  { path: 'panel', component: PanelComponent, canActivate: [AuthGuard] }, // Protege esta ruta
  { path: 'citas', component: CitasComponent, canActivate: [AuthGuard] }, // Protege esta ruta
  { path: 'citas-programadas', component: CitasProgramadasComponent, canActivate: [AuthGuard] }, // Protege esta ruta
  { path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard] }, // Protege esta ruta
  { path: 'servicios-dentales', component: ServiciosDentalesComponent, canActivate: [AuthGuard] }, // Protege esta ruta
  { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] }, // Protege esta ruta


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}