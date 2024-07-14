import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Factura } from '../models/facturas';
import { Constantes } from '../comun/constantes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartbillService {

  constructor(private http: HttpClient) { }

  guardarFactura(factura: Factura, idUsuario: string): Observable<any> {
    return this.http.post(Constantes.POST_FACTURA_SMARTBILLCORE + localStorage.getItem('nit') + '/' + idUsuario, factura);
  }

  getUsersByDocument(identificacion: string): Observable<any> {
    return this.http.get(Constantes.CONSULTAR_USUARIO_SMARTBILL + identificacion);
  }
}
