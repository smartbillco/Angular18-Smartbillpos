import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../../comun/constantes';
import { Observable } from 'rxjs';
import { Reservas } from '../../models/restaurante/reservas';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(private http: HttpClient) { }

  getReservasRestaurante(id: string): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_RESERVAS_RESTAURANTE + id);
  }

  getReservasMesa(idMesa: string): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_RESERVAS_MESA + idMesa);
  }

  getReservasCliente(idCliente: string): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_RESERVAS_CLIENTE + idCliente);
  }

  nuevaReserva(res: Reservas): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_RESERVA, res);
  }

  actualizarReserva(res: Reservas): Observable<any> {
    return this.http.put(Constantes.HOST + Constantes.PUT_RESERVA, res);
  }

  cancelarReserva(idReserva: string): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_RESERVAS_MESA + idReserva);
  }

}
