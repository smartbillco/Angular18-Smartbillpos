import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Constantes } from '../comun/constantes';
import { MovimientoInventario, InventoryMovements } from '../models/movimiento-inventario';
import { Producto } from '../models/producto';
import { ApiResp } from '../interfaces/api-resp';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient) { }

  // INVENTARIO PRODUCTOS

  public getAllMovements(): Observable<InventoryMovements[]> {
    return this.http.get<InventoryMovements[]>(Constantes.HOST + Constantes.getAllMovements).pipe(
      map(resp => resp),
      catchError(error => {
        Constantes.handleError(error);
        return of([]);
      })
    )
  }


  getMovimientosProdByFechas(idProducto: number, fechaIni: string, fechaFin: string): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(Constantes.HOST + Constantes.GET_MOV_INV_PROD_FECHA + String(idProducto) + '/' + fechaIni + '/' + fechaFin).pipe(
      map(resp => resp),
      catchError(err => {
        Constantes.handleError(err);
        return of([]);
      })
    );
  }

  getMovimientosTodosProdByMes(mes: number, anio: number): Observable<ApiResp> {
    return this.http.get<ApiResp>(Constantes.HOST + Constantes.GET_MOV_INV_PROD_ALL_MES + String(mes) + '/' + String(anio));
  }

  getMovimientosProdByMes(idProducto: number, mes: number): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_MOV_INV_PROD_MES + mes + '/' + idProducto);
  }

  nuevoMovimientoProd(movimiento: MovimientoInventario): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_MOVIMIENTO_INV_PROD, movimiento);
  }

  // INVENTARIO INSUMOS

}
