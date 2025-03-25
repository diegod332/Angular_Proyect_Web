import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './pages/panel/panel.component';

const routes: Routes = [
  { path: 'panel', component: PanelComponent }, // Ruta para el panel
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}