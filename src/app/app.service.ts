import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class AppService {
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Method': 'POST,GET,PUT,DELETE,OPTIONS',
      'Access-Control-Request-Headers': 'Content-Type, Authorization',
    }),
  };

  public showAlert = new Subject();
  public reloadMenu = new Subject();

  constructor(private http: HttpClient) {}

  /**
   * Método para iniciar sesión
   * @param credentials Credenciales del usuario (email y password)
   * @returns Observable con la respuesta del servidor
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    const url = `${environment.api.proyectApis}/login`; // Construye la URL usando environment
    return this.http.post(url, credentials).pipe(
      tap((response: any) => {
        if (response && response.token && response.user) {
          // Guarda el token en localStorage
          localStorage.setItem('JWT_TOKEN', response.token);

          // Guarda los datos del usuario en localStorage
          localStorage.setItem('USER_DATA', JSON.stringify(response.user));

          console.log('Inicio de sesión exitoso:', response);
        } else {
          console.error('Respuesta inesperada del servidor:', response);
        }
      }),
      catchError((error) => {
        console.error('Error en el inicio de sesión:', error);
        return throwError(() => error); // Repropaga el error
      })
    );
  }

  /**
   * Método genérico para realizar solicitudes GET
   * @param endpoint Endpoint de la API
   * @param params Parámetros opcionales
   * @param options Opciones adicionales
   * @returns Observable con la respuesta del servidor
   */
  get(endpoint: string, params?: any, options?: any): Observable<any> {
    const url = `${environment.api.proyectApis}/${endpoint}`;
    return this.http.get(url, options);
  }

  /**
   * Método genérico para realizar solicitudes POST
   * @param endpoint Endpoint de la API
   * @param body Cuerpo de la solicitud
   * @param options Opciones adicionales
   * @returns Observable con la respuesta del servidor
   */
  post(endpoint: string, body: any, options?: any): Observable<any> {
    const url = `${environment.api.proyectApis}/${endpoint}`;
    return this.http.post(url, body, options);
  }

  /**
   * Método genérico para realizar solicitudes PATCH
   * @param endpoint Endpoint de la API
   * @param body Cuerpo de la solicitud
   * @param options Opciones adicionales
   * @returns Observable con la respuesta del servidor
   */
  patch(endpoint: string, body: any, options?: any): Observable<any> {
    const url = `${environment.api.proyectApis}/${endpoint}`;
    return this.http.patch(url, body, options);
  }

  /**
   * Método genérico para realizar solicitudes PUT
   * @param endpoint Endpoint de la API
   * @param body Cuerpo de la solicitud
   * @param options Opciones adicionales
   * @returns Observable con la respuesta del servidor
   */
  put(endpoint: string, body?: any, options?: any): Observable<any> {
    const url = `${environment.api.proyectApis}/${endpoint}`;
    return this.http.put(url, body, options);
  }

  /**
   * Método genérico para realizar solicitudes DELETE
   * @param endpoint Endpoint de la API
   * @param options Opciones adicionales
   * @returns Observable con la respuesta del servidor
   */
  remove(endpoint: string, options?: any): Observable<any> {
    const url = `${environment.api.proyectApis}/${endpoint}`;
    return this.http.delete(url, options);
  }
}