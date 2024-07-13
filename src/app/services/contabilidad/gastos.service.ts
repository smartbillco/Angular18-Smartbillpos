import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constantes } from '../../comun/constantes';
import { Gastos } from '../../models/contabilidad/gastos';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  constructor(private http: HttpClient) { }

  insertar(gastos: Gastos): Observable<any>{
    return this.http.post(Constantes.HOST + Constantes.POST_GASTOS_REGISTRAR, gastos);

  }

  getByMes(mes: string, anio: string): Observable<any>{
    let idEmpresa = Constantes.getIdEmpresa()
    return this.http.get(Constantes.HOST + Constantes.GET_GASTOS_BY_MONTH + mes + "/" + anio + "/" + idEmpresa);

  }
}
