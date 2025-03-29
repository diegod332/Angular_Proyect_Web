import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import {AdminModule} from './admin/admin.module';
import { RegisterComponent } from './auth/containers/register/register.component';
import { LoginComponent } from './auth/containers/login/login.component';
import { FormsModule } from '@angular/forms';
import {AppService} from './app.service';
import {APP_BASE_HREF, CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from './auth/token.interceptor';
import {ErrorAutenticateInterceptor} from './auth/ErrorAutenticateInterceptor';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthModule} from './auth/auth.module';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ContactoComponent } from './contacto/contacto.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    RegisterComponent,
    LoginComponent,
    QuienesSomosComponent,
    ServiciosComponent,
    ContactoComponent,
  ],
  exports: [
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    AuthModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    AppService,
    {provide: APP_BASE_HREF, useValue: '/'},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorAutenticateInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
