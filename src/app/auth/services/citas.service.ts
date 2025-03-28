import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private apiURL = 'http://localhost:3004/api/appointments'; // Cambia la URL según tu configuración

  constructor(private http: HttpClient) {}

  // Obtener todas las citas
  getAllCitas(): Observable<any> {
    return this.http.get<any>(this.apiURL);
  }

  // Obtener una cita por ID
  getCitaById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/${id}`);
  }

  // Crear una nueva cita
  createCita(cita: any): Observable<any> {
    return this.http.post<any>(this.apiURL, cita);
  }

  // Actualizar una cita existente
  updateCita(id: string, cita: any): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/${id}`, cita);
  }

  // Eliminar una cita (eliminación lógica)
  deleteCita(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${id}`);
  }
}