import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ingresos } from '../../models/contabilidad/ingresos';
import { Constantes } from '../../comun/constantes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  constructor(private http: HttpClient) { }

  insertar(ingreso: Ingresos): Observable<any>{
    return this.http.post(Constantes.HOST + Constantes.POST_INGRESOS_REGISTRAR, ingreso);

  }

  getByMes(mes: string, anio: string): Observable<any>{
    let idEmpresa = Constantes.getIdEmpresa()
    return this.http.get(Constantes.HOST + Constantes.GET_INGRESOS_BY_MONTH + mes + "/" + anio + "/" + idEmpresa);

  }
}
