import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {of, Observable, throwError} from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Tokens } from '../models/tokens';
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private readonly JWT_TOKEN = 'JWT_TOKEN';
    private readonly USER_CURRENT = 'USER_CURRENT';
    private loggedUser: string = '';

    constructor(
        private http: HttpClient,
        private router: Router,
        ) {}

        login(user: { email: string, password: string }): Observable<boolean> {
          console.log('Iniciando login con:', user); // Depuración
          return this.http.post<any>(`${environment.api.authApis}/login`, user).pipe(
              tap((tokens: Tokens) => {
                  console.log('Tokens recibidos en login:', tokens); // Depuración
                  this.storeTokens(tokens); // Guarda los tokens y los datos del usuario
              }),
              mapTo(true),
              catchError((error) => {
                  console.error('Error en el inicio de sesión:', error);
                  return throwError(() => error);
              })
          );
      }
      
 

  logout() {
    const refreshToken = localStorage.getItem('REFRESH_TOKEN'); // Obtén el refresh token
    return this.http.post<any>(`${environment.api.authApis}/logout`, { refreshToken })
      .pipe(
        tap((response) => {
          if (response && response.message === 'Cierre de sesión exitoso') {
            this.doLogoutUser();
            setTimeout(() => {
              this.router.navigate(['/login']);
            },800);
          }
        }),
        catchError(error => {
          this.doLogoutUser();
          setTimeout(() => {
            this.router.navigate(['/login']);
          },800);
          return throwError(error); // Repropagamos el error para que pueda ser manejado en un nivel superior
        })
      )
      .subscribe({
        next: () => {
          // Manejar éxito (opcional)
          console.log('Logout exitoso');
        },
        error: (error) => {
          console.error('Error inesperado:', error);
        }
      });
  }

    register( data: any ): Observable<boolean> {
        let url = `${environment.api.authApis}/register`;
        return this.http.post<any>(url, data);
    }

    isLoggedIn() {
        return !!this.getJwtToken();
    }

    refreshToken() {
      const refreshToken = localStorage.getItem('REFRESH_TOKEN'); // Obtén el refresh token
      return this.http.post<any>(`${environment.api.authApis}/refresh`, { refreshToken }).pipe(
          tap((tokens: Tokens) => {
              this.storeTokens(tokens); // Guarda el nuevo JWT y el refresh token (si se devuelve)
          }),
          catchError((error) => {
              console.error('Error al renovar el token:', error);
              this.logout(); // Cierra sesión si el refresh falla
              return throwError(() => error);
          })
      );
  }

    getJwtToken() {
      let token = localStorage.getItem(this.JWT_TOKEN);
      if (token){
        return token;
      }else{
        return '';
      }
    }

    doLoginUser(username: string, tokens: any) {
        this.loggedUser = username;
        this.storeTokens(tokens);
    }

    private doLogoutUser() {
        this.loggedUser = '';
        this.removeTokens();
    }


    private storeJwtToken(jwt: string) {
        localStorage.setItem(this.JWT_TOKEN, jwt);
    }

    private storeTokens(tokens: Tokens) {
      console.log('storeTokens ejecutado con:', tokens); // Depuración
      localStorage.setItem(this.JWT_TOKEN, tokens.token);
      localStorage.setItem('REFRESH_TOKEN', String(tokens.refreshToken));
      localStorage.setItem(this.USER_CURRENT, JSON.stringify(tokens.user));
  
      console.log('Tokens guardados en localStorage:', {
          JWT_TOKEN: localStorage.getItem(this.JWT_TOKEN),
          REFRESH_TOKEN: localStorage.getItem('REFRESH_TOKEN'),
          USER_CURRENT: localStorage.getItem(this.USER_CURRENT),
      });
  }

    private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem('REFRESH_TOKEN'); // Elimina el refresh token
    localStorage.removeItem(this.USER_CURRENT);
}
}
