import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Tokens } from '../models/tokens';
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USER_CURRENT = 'USER_CURRENT';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  /**
   * Inicia sesión con las credenciales del usuario.
   * @param user Objeto con email y password.
   * @returns Observable<boolean>
   */
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

  /**
   * Cierra sesión del usuario actual.
   * @returns Observable<void>
   */
  logout(): Observable<void> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN); // Obtén el refresh token
    return this.http.post<any>(`${environment.api.authApis}/logout`, { refreshToken }).pipe(
      tap((response) => {
        if (response && response.message === 'Cierre de sesión exitoso') {
          console.log('Logout exitoso en el servidor');
          this.doLogoutUser(); // Elimina los tokens localmente
        }
      }),
      catchError((error) => {
        console.error('Error al cerrar sesión en el servidor:', error);
        this.doLogoutUser(); // Asegúrate de eliminar los tokens incluso si hay un error
        return throwError(() => error);
      })
    );
  }

  /**
   * Registra un nuevo usuario.
   * @param data Datos del usuario a registrar.
   * @returns Observable<boolean>
   */
  register(data: any): Observable<boolean> {
    const url = `${environment.api.authApis}/register`;
    return this.http.post<any>(url, data);
  }
  
  isTokenExpired(): boolean {
    const token = this.getJwtToken();
    if (!token) return true;
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  /**
   * Verifica si el usuario está autenticado.
   * @returns boolean
   */
  isLoggedIn(): boolean {
    const token = this.getJwtToken();
    return !!token; // Devuelve true si el token existe, false si no
  }
  /**
   * Renueva el token de autenticación usando el refresh token.
   * @returns Observable<Tokens>
   */
  refreshToken(): Observable<Tokens> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN); // Obtén el refresh token
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

  /**
   * Obtiene el token JWT almacenado.
   * @returns string
   */
  getJwtToken(): string {
    return localStorage.getItem(this.JWT_TOKEN) || '';
  }

  /**
   * Realiza el login del usuario y guarda los tokens.
   * @param username Nombre del usuario.
   * @param tokens Tokens recibidos.
   */
  doLoginUser(username: string, tokens: Tokens): void {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  /**
   * Realiza el logout del usuario y elimina los tokens.
   */
  private doLogoutUser(): void {
    this.loggedUser = '';
    this.removeTokens();
  }

  /**
   * Guarda el token JWT en el localStorage.
   * @param jwt Token JWT.
   */
  private storeJwtToken(jwt: string): void {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  /**
   * Guarda los tokens y los datos del usuario en el localStorage.
   * @param tokens Tokens recibidos.
   */
  private storeTokens(tokens: Tokens): void {
    console.log('storeTokens ejecutado con:', tokens);   
    localStorage.setItem(this.JWT_TOKEN, tokens.token);
    localStorage.setItem(this.REFRESH_TOKEN, String(tokens.refreshToken));
    localStorage.setItem(this.USER_CURRENT, JSON.stringify(tokens.user));

    console.log('Tokens guardados en localStorage:', {
      JWT_TOKEN: localStorage.getItem(this.JWT_TOKEN),
      REFRESH_TOKEN: localStorage.getItem(this.REFRESH_TOKEN),
      USER_CURRENT: localStorage.getItem(this.USER_CURRENT),
    });
  }

  /**
   * Elimina los tokens y los datos del usuario del localStorage.
   */
  private removeTokens(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN); 
    localStorage.removeItem(this.USER_CURRENT);
  }
}