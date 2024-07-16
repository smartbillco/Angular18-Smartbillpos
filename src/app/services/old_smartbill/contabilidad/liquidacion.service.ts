import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Liquidacion } from '../../models/contabilidad/liquidacion';
import { Constantes } from '../../comun/constantes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService {

  constructor(private http: HttpClient) { }

  insertar(liquidacion: Liquidacion): Observable<any>{
    return this.http.post(Constantes.HOST + Constantes.POST_LIQUIDACIONES_REGISTRAR, liquidacion);

  }

  getByMes(mes: string, anio: string): Observable<any>{
    let idEmpresa = Constantes.getIdEmpresa()

    return this.http.get(Constantes.HOST + Constantes.GET_LIQUIDACIONES_BY_MONTH 
      + mes + "/" + anio + "/" + idEmpresa);

  }

  getByMesAndUser(mes: string, anio: string, idUsuario: string): Observable<any>{
    return this.http.get(Constantes.HOST + Constantes.GET_LIQUIDACIONES_BY_MONTH 
      + mes + "/" + anio + "/" + idUsuario);

  }
}
