import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Constantes } from '../comun/constantes';
import { ConceptoCaja } from '../models/caja/concepto-caja';
import { MovimientoCaja, AperturaCaja, CierreCaja } from '../models/caja/movimiento-caja';
import { map, catchError } from 'rxjs/operators';
import { Caja } from '../models/caja/caja';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getConceptosCaja(): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_CONCEPTOS_CAJA + Constantes.getIdEmpresa());
  }

  getMovimientosByFecha(idCaja: number, fecha: string): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_MOVIMIENTOS_CAJA_BY_FECHA + String(idCaja) + '/' + fecha);
  }

  getCaja(): Observable<any> {    
    return this.http.get(Constantes.HOST + Constantes.GET_CAJA_INFO + Constantes.getIdEmpresa());    
  }

  nuevoConcepto(concepto: ConceptoCaja): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_CONCEPTO_CAJA, concepto);
  }

  nuevoMovimiento(movimiento: MovimientoCaja): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_MOVIMIENTO_CAJA, movimiento);
  }

  getReporte(listMovimientos: Array<MovimientoCaja>): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_REPORTE_MOVIMIENTOS_CAJA, listMovimientos, { responseType: 'blob' });
  }

  getCashRegisters(companyId: number) {
    return this.http.get(Constantes.HOST + Constantes.GET_ALL_CASH_REGISTERS + `/${companyId}`).pipe(
      map((response: any) => {
        return response;
      }), catchError(err => {
        this.toastr.error(err, 'Error');
        return throwError(err);
      })
    );
  }

  inserCahsRegister(cashRegister: Caja) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(Constantes.HOST + Constantes.POST_INSERT_CASH_REGISTER, cashRegister, { headers: httpHeaders }).pipe(
      map((data: any) => {
        return true;
      }), catchError(err => {
        this.toastr.error(err, 'Error');
        return throwError(err);
      })
    );
  }

  getCashRegisterById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(Constantes.HOST + Constantes.GET_CASH_REGISTER_BY_ID + `/${id}`, { headers });
  }

  closeCashRegister(cashRegister: CierreCaja) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(Constantes.HOST + Constantes.CLOSE_CASH_REGISTER, cashRegister, { headers: httpHeaders }).pipe(
      map((response: any) => true),
      catchError(err => {
        this.toastr.error(err.error.message, 'Error');
        return throwError(err);
      })
    );
  }

  getAllCashRegister(companyId: number): Observable<Caja[]> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = `${Constantes.HOST}${Constantes.GET_ALL_CASH_REGISTER}/${companyId}`;

    return this.http.get<Caja[]>(url, { headers: httpHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de error
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  openCashRegister(cashRegisterToOpen: AperturaCaja) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(Constantes.HOST + Constantes.OPNE_CASH_REGISTER, cashRegisterToOpen, { headers: httpHeaders }).pipe(
      map((response: any) => {
        return response;
      }), catchError(err => {
        this.toastr.error(err.error.message, 'Error');
        return throwError(err);
      })
    );
  }
}