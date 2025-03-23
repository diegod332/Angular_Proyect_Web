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
  { path: 'inicio', component: LandingComponent },
  { path: 'quienes-somos', component: QuienesSomosComponent },
  { path: 'servicios', component: ServiciosComponent},
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent }, // Ruta para LoginComponent
  { path: 'register', component: RegisterComponent }, // Ruta para RegisterComponent

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
