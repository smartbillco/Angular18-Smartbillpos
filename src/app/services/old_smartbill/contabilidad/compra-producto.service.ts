import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompraProducto } from '../../models/contabilidad/compra-producto';
import { Constantes } from '../../comun/constantes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(private http: HttpClient) { }

  getcomprasByMes(mes: string, anio: string): Observable<any> {
    let idEmpresa = localStorage.getItem("idEmpresa")
    return this.http.get(Constantes.HOST + Constantes.GET_COMPRAS_BY_MES + mes + "/" + anio + "/" + idEmpresa);
  }

  getcomprasByMesProducto(mes: string, anio: string, idProducto: string): Observable<any> {
    let idEmpresa = localStorage.getItem("idEmpresa")
    return this.http.get(Constantes.HOST + Constantes.GET_COMPRAS_BY_PRODUCTO + mes + "/" + anio + "/" + idEmpresa + "/" + idProducto);
  }

  /*nuevaCompra(facturaProveedor: FacturaProveedor): Observable<any> {
    let idEmpresa = localStorage.getItem("idEmpresa")
    facturaProveedor.idEmpresa = Number(idEmpresa);
    return this.http.post(Constantes.HOST + Constantes.POST_COMPRA_NUEVA, facturaProveedor);
  }*/
}
