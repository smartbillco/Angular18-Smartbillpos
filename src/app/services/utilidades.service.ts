import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constantes } from '../comun/constantes';
import { RasDian } from '../models/rangosDian';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(private http: HttpClient,  private _PathSmartbill: Constantes) {

  }

  getMediosDePago() {
    return this.http.get(Constantes.HOST + '/webservice/utilidades/getMediosPago');
  }

  getUnidadesMedida() {
    return this.http.get(Constantes.HOST + '/webservice/utilidades/getUnidadesMedida');
  }

  getRangosDian(company: string){
    return this.http.get(Constantes.HOST + '/webservice/rangos/getByCompany/' + company);
  }

  isertarNuevoRango(rango: RasDian){
    let header = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.post(Constantes.HOST + '/webservice/rangos/nuevo', rango, {headers: header} )
  }
}
