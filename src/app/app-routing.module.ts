import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/containers/login/login.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { ContactoComponent } from './contacto/contacto.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { RegisterComponent } from './auth/containers/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: LandingComponent, data: { animation: 'LandingPage' } },
  { path: 'quienes-somos', component: QuienesSomosComponent, data: { animation: 'QuienesSomosPage' } },
  { path: 'servicios', component: ServiciosComponent, data: { animation: 'ServiciosPage' } },
  { path: 'contacto', component: ContactoComponent, data: { animation: 'ContactoPage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'RegisterPage' } },// Ruta para RegisterComponent

  // Carga perezosa del módulo AdminModule
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }