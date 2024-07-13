import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constantes } from '../comun/constantes';
import { Factura } from '../models/facturas';
import { Observable, throwError } from 'rxjs';
import { DetalleFactura } from '../models/detalleFactura';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  idEmpresa: string;

  constructor(private http: HttpClient, private _PathSmartbill: Constantes) {
    this.idEmpresa = localStorage.getItem('idEmpresa') || 'valor_predeterminado';

  }

  guardarFactura(factura: Factura) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(Constantes.HOST + '/webservice/facturas/insertar', factura, { headers: httpHeaders });
  }

  getNumeroFactura() {
    return this.http.get(Constantes.HOST + '/webservice/facturas/getNumeroUltimaFactura/' + this.idEmpresa);
  }

  getFacturaByNumero(numero: string): Observable<any> {

    const params: HttpParams = new HttpParams().set('idEmpresa', this.idEmpresa).set('numero', numero);

    return this.http.get(Constantes.HOST + Constantes.GET_FACTURA_BY_NUMERO, { params });
  }

  getFacturasByFecha(date: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('idEmpresa', this.idEmpresa).set('fecha', date);
    return this.http.get(Constantes.HOST + Constantes.GET_FACTURAS_BY_DATE, { params });
  }
  getInvoicesByDate(date: Object) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(Constantes.HOST + Constantes.POST_INVOICES_BY_IMPLICIT_DATE, date, { headers: httpHeaders });
  }

  getVoidedInvocies(date: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(Constantes.HOST + Constantes.GET_getVoidedInvocies, date, { headers }).pipe(
      map((response: any) => {
        return response;
      }), catchError(err => throwError(err)
      )
    );
  }

  getDiscountedIinvoices(date: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(Constantes.HOST + Constantes.GET_DiscountedInvoices, date, { headers }).pipe(
      map((response: any) => {
        return response;
      }), catchError(err => throwError(err)
      )
    );
  }

  getDetallesFactura(id: string): Observable<any> {

    return this.http.get(Constantes.HOST + Constantes.GET_FACTURAS_BY_ID + id);
  }

  getNumeroOrdenMesa(id: string): Observable<any> {

    return this.http.get(Constantes.HOST + Constantes.GET_NUMERO_ORDEN_MESA + id);
  }

  getDetallesMesa(id: string): Observable<any> {

    return this.http.get(Constantes.HOST + Constantes.GET_DETALLE_MESA + id);
  }

  actualizarOrdenMesa(detalles: Array<Array<DetalleFactura>>): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(Constantes.HOST + Constantes.POST_ACTUALIZAR_DETALLES_MESA, detalles, { headers: httpHeaders });
  }
  cerrarMesa(factura: Factura, idMesa: number, estadoMesa: number): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_CERRAR_MESA + String(idMesa) + '/' + String(estadoMesa), factura);
  }

  reImprimirFactura(factura: Factura, cliente: string) {
    return this.http.post(Constantes.HOST + Constantes.POST_FACTURA_PRINT + localStorage.getItem('nit') + '/' + cliente, factura);

  }

  getReporteVentas(listaFacturas: Array<Factura>): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_FACTURAS_REPORTE, listaFacturas, { responseType: 'blob' });
  }

  getMediosDePago() {

    return this.http.get(Constantes.HOST + '/webservice/mediospago/getAll');
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Ajustar el mes sumando 1
    const year = date.getFullYear();
  
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  getInvoicesByCustomerId(customer: Cliente) {
    return this.http.get<any[]>(Constantes.HOST + Constantes.GET_INVOICES_BY_CUTOMER_ID + `/${customer.id}`).pipe(
      map((response: any[]) => {
        if (response.length === 0) {
          swal.fire('No hay datos', 'No se encontraron facturas registradas con el cliente seleccionado', 'warning');
          return [];
        } else {
          swal.fire('Facturas encontradas', `Se encontraron ${response.length} facturas a nombre del cliente ${customer.nombre}`, 'success');
          return response;
        }
      }),
      catchError(err => {
        swal.fire('Error!', err.error.message, 'error');
        return throwError(err);
      })
    );
  }
  
}
