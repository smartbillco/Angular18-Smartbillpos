import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AbonosCC } from '../../models/abonos-cc';
import { Constantes } from '../../comun/constantes';

@Injectable({
  providedIn: 'root'
})
export class CuentasCobrarService {

  constructor(private http: HttpClient) { }

  // CUENTAS DE COBRO
  getCCMes(mes: number, year: number): Observable<any> {
    const idEmpresa = Constantes.getIdEmpresa();

    const httpHeaders = new HttpHeaders({
      'year': String(year) ,
      'mes' : String(mes)
    });
    return this.http.get(Constantes.HOST + Constantes.GET_CC_BY_MES + idEmpresa, {headers: httpHeaders});
  }

  getAccountsReceivableByDate(date: any) {
    const formData = new FormData();
    formData.append('fechaInicio', date.fechaInicio);
    formData.append('fechaFin', date.fechaFin);
    formData.append('idCliente', date.idCliente);
    return this.http.post(Constantes.HOST + Constantes.GET_CUENTAS_COBRAR_POR_FECHA, formData);
  }

  getInvoicesByDateAndIdCustomer(data: any) {
    const formData = new FormData();
    formData.append('fechaInicio', data.fechaInicio);
    formData.append('fechaFin', data.fechaFin);
    formData.append('idCliente', data.idCliente);
    return this.http.post(Constantes.HOST + Constantes.GET_CUENTAS_COBRAR_POR_CLIENTE, formData);
  }



  // ABONOS A CUENTAS DE COBRO
  guardarAbonoCC(abonoCC: AbonosCC): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'});
    return this.http.post(Constantes.HOST + Constantes.POST_ABONO_CC, abonoCC, {headers: httpHeaders});
  }
  getAbonosCC(idFactura: string): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_ABONOS_CC + idFactura);
  }
}
