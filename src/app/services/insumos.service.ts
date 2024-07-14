import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Constantes } from '../comun/constantes';
import { Insumo } from '../models/insumo';

@Injectable({
  providedIn: 'root'
})
export class InsumosService {

  private listaInsumos: Array<Insumo> = [];
  private idEmpresa: string = '';

  private listaSource = new BehaviorSubject<Array<Insumo>>(this.listaInsumos);
  currentLista = this.listaSource.asObservable();

  constructor(private http: HttpClient) {
    this.idEmpresa = localStorage.getItem("idEmpresa") || ''; // Manejar el caso de que idEmpresa sea null
    alert(this.idEmpresa);
    this.getAllInsumos().subscribe((response: any) => {
      this.listaInsumos = response.msg || []; // Manejar el caso de que response.msg sea null
      this.listaSource.next(this.listaInsumos);
    });
  }

  getAllInsumos(): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_INSUMOS + "/" + this.idEmpresa);
  }

  getInsumosDisponibles(): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_INSUMOS_DISPONIBLES + "/" + this.idEmpresa);
  }

  createInsumo(insumo: Insumo): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '63c42416b411d71fb39774c144d2bb842bb814ba'
    });
    return this.http.post(Constantes.HOST + Constantes.POST_INSUMOS, insumo, { headers: httpHeaders});
  }

  updateInsumo(insumo: Insumo): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '63c42416b411d71fb39774c144d2bb842bb814ba'
    });
    return this.http.post(Constantes.HOST + Constantes.POST_ACTUALIZAR_INSUMOS, insumo, { headers: httpHeaders});
  }

  deleteInsumo(insumo: Insumo): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Authorization': '63c42416b411d71fb39774c144d2bb842bb814ba'
    });
    return this.http.delete(Constantes.HOST + Constantes.DELETE_INSUMOS + '/' +  insumo.id, { headers: httpHeaders});
  }

  uploadFile(file: File): Observable<any> {
    let url = Constantes.HOST + Constantes.POST_ARCHIVO_INSUMOS + this.idEmpresa;
    let formData = new FormData();
    formData.append('file', file);

    let params = new HttpParams();
    const options = {
      params: params,
      reportProgress: true,
    };

    return this.http.post(url, formData, options);
  }

  getReporte(): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_REPORTE_INSUMOS + Constantes.getIdEmpresa(), { responseType: 'blob' });
  }
}