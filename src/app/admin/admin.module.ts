import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from './admin.routing.module';
import {FooterComponent} from './template/footer/footer.component';
import {HeadermenuComponent} from './template/headermenu/headermenu.component';
import {SidemenuComponent} from './template/sidemenu/sidemenu.component';
import {AdminComponent} from './admin.component';
import {PrincipalComponent} from './pages/principal/principal.component';
import {BreadscrumbComponent} from './template/breadscrumb/breadscrumb.component';
import {ReactiveFormsModule} from '@angular/forms';
import {UsuarioComponent} from './pages/catalogos/usuario/usuario.component';
import {ProductoComponent} from './pages/catalogos/producto/producto.component';

@NgModule({
  declarations: [
    FooterComponent,
    HeadermenuComponent,
    SidemenuComponent,
    AdminComponent,
    PrincipalComponent,
    BreadscrumbComponent,
    UsuarioComponent,
    ProductoComponent,
  ],
  exports: [
    FooterComponent,
    HeadermenuComponent,
    SidemenuComponent,
    BreadscrumbComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule {}
