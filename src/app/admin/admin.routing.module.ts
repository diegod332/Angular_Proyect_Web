import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './pages/panel/panel.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CitasComponent } from './pages/citas/citas.component';
const routes: Routes = [
  { path: 'panel', component: PanelComponent, canActivate: [AuthGuard] }, // Protege esta ruta
  { path: 'citas', component: CitasComponent, canActivate: [AuthGuard] }, // Protege esta ruta


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}