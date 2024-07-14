import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../../comun/constantes';
import { Observable, throwError } from 'rxjs';
import { AbonosCP } from '../../models/contabilidad/abonos-cp';
import { FacturaProveedor } from '../../models/contabilidad/factura-proveedor';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FacturasProveedorService {

  constructor(private http: HttpClient) { }

  // CUENTAS POR PAGAR
  guardarFactura(factura: FacturaProveedor): Observable<any> {

    return this.http.post(Constantes.HOST + Constantes.POST_FACTURAS_PROVEEDOR, factura);
  }
  getFacturasMes(mes: number, anio: number): Observable<any> {
    const idEmpresa = Constantes.getIdEmpresa();

    return this.http.get(Constantes.HOST + Constantes.GET_FACTURAS_PROVEEDOR_BY_MES + idEmpresa + '/' + String(mes) + '/' + String(anio));

  }
  // ABONOS A CUENTAS DE COBRO
  guardarAbonoCP(abonoCP: AbonosCP): Observable<any> {

    return this.http.post(Constantes.HOST + Constantes.POST_ABONOS_CP, abonoCP);
  }
  getDetallesFacturaProveedor(idFactura: string): Observable<any> {

    return this.http.get(Constantes.HOST + Constantes.GET_DETALLES_FACTURAS_PROVEEDOR + idFactura);
  }
  getAbonosCP(idFactura: string): Observable<any> {

    return this.http.get(Constantes.HOST + Constantes.GET_ABONOS_CP_BY_FACTURA + idFactura);
  }


  getProvidersInvoicesByCurrentDate(currentDate: Object): Observable<any> {

    return this.http.post<any>(Constantes.HOST + Constantes.GET_PROVIDER_INVOICES, currentDate).pipe(
      map( (res: any) => res ), catchError(err => {
        swal.fire('Error', 'error al cargar facturas de provedores', 'error');
        return throwError(err);
      })
    );
  }

  getInvoiceByIdprovider(idProvider: number): Observable<any> {

    return this.http.get<FacturaProveedor>(Constantes.HOST + Constantes.GET_PROVIDER_INVOICE_BY_ID_PROVIDER + `/${idProvider}`).pipe(
      map( (res: FacturaProveedor) => {
        return res;
      }), catchError(err => throwError(err))
    );
  }

  findInvoicesByImplicitDate(date: Object) {

    return this.http.post(Constantes.HOST + Constantes.getInvoicesByImplicitDate, date);
  }

  getUnpaidInvoices() {
    return this.http.get(Constantes.HOST + Constantes.GET_UNPAID_INVOICES);
  }
}
