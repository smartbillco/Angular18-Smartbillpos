import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constantes } from '../../comun/constantes';
import { Restaurante } from '../../models/restaurante/restaurante';
import { Zona } from '../../models/restaurante/zona';
import { Mesa } from '../../models/restaurante/mesa';
import { MeseroMesa } from '../../models/restaurante/mesero-mesa';
import { Factura } from '../../models/facturas';

@Injectable({
  providedIn: 'root'
})
export class RestauranteService {

  constructor(private http: HttpClient) { }

  getListaRestaurantes(): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_RESTAURANTES + Constantes.getIdEmpresa());
  }

  nuevoRestaurante(res: Restaurante): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_RESTAURANTE, res);
  }

  actualizarRestaurante(res: Restaurante): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.PUT_RESTAURANTE, res);
  }

  eliminarRestaurante(id: number): Observable<any> { 
    return this.http.delete(Constantes.HOST + Constantes.DELETE_RESTAURANTE + String(id) );    
  }

  getListaZonas(idRestaurante: number): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_ZONAS + String(idRestaurante));
  }

  nuevaZona(zona: Zona): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_ZONA, zona);
  }

  actualizarZona(zona: Zona ): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.PUT_ZONA, Zona);
  }

  eliminarZona(id: number): Observable<any> {
 
    return this.http.delete(Constantes.HOST + Constantes.DELETE_ZONA + String(id));
    
  }

  getListaMesas(idRestaurante: number): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_MESAS + String(idRestaurante));
  }

  getListaMesasZona(idZona: number): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_MESAS_POR_ZONA + String(idZona));
  }

  nuevaMesa(mesa: Mesa): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_MESA, mesa);
  }

  asignarMesa(meseroMesa: MeseroMesa, estadoMesa: number): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_ASIGNAR_MESA + Constantes.getIdEmpresa() +'/' + String(estadoMesa), meseroMesa);
  }

  

  actualizarMesa(mesa: Mesa ): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.PUT_MESA, mesa);
  }

  eliminarMesa(id: number): Observable<any> { 
    return this.http.delete(Constantes.HOST + Constantes.DELETE_MESA + String(id));    
  }
}
