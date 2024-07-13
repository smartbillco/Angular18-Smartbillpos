import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constantes } from '../comun/constantes';
import { Proveedor } from '../models/proveedor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': '63c42416b411d71fb39774c144d2bb842bb814ba'
  });

  constructor(private http: HttpClient) { }

  getAllProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(Constantes.HOST + Constantes.GET_PROVEEDORES);
  }

  createProveedor(proveedor: Proveedor): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_PROVEEDORES, proveedor, { headers: this.headers });
  }

  updateProveedor(proveedor: Proveedor): Observable<any> {
  // const idProveedorJson = JSON.stringify(proveedor );
  // alert(idProveedorJson);
    return this.http.post(Constantes.HOST + Constantes.POST_ACTUALIZAR_PROVEEDORES, proveedor, { headers: this.headers });
  }

  deleteProveedor(proveedorId: number): Observable<any> {
    return this.http.delete(Constantes.HOST + Constantes.DELETE_PROVEEDORES + '/' + proveedorId, { headers: this.headers });
  }

  getReporte(): Observable<Blob> {
    return this.http.get(Constantes.HOST + Constantes.GET_REPORTE_PROVEEDORES, { responseType: 'blob' });
  }

  uploadFile(file: File): Observable<any> {
    const url = Constantes.HOST + Constantes.POST_ARCHIVO_PROVEEDORES;
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(url, formData, { reportProgress: true });
  }
}