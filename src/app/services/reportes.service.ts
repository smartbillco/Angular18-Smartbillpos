import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constantes } from '../comun/constantes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http: HttpClient) { }

  consultarReportes(fecha: string){

  }

  consultarReportesMes(mes: number, year:number): Observable<any>{
    let idEmpresa = Constantes.getIdEmpresa()

    const httpHeaders = new HttpHeaders({
      'year': String(year) ,
      'mes' : String(mes)
    }); 
    return this.http.get(Constantes.HOST + Constantes.GET_REPORTES + idEmpresa, {headers: httpHeaders});

  }

  consultarReportesAnio(year: number): Observable<any>{
    let idEmpresa = Constantes.getIdEmpresa()

    const httpHeaders = new HttpHeaders({
      'year': String(year) 
    }); 
    return this.http.get(Constantes.HOST + Constantes.GET_REPORTES_ANIO + idEmpresa, {headers: httpHeaders});

  }

  consultarReportesFechas(fechaInicio: string, fechaFin: string): Observable<any>{
    let idEmpresa = Constantes.getIdEmpresa()

    const httpHeaders = new HttpHeaders({
      'fechaInicio': fechaInicio,
      'fechaFin' : fechaFin,
    }); 
    return this.http.get(Constantes.HOST + Constantes.GET_REPORTES_FECHAS + idEmpresa, {headers: httpHeaders});

  }

  consultarReportesAyer(): Observable<any>{
    let idEmpresa = Constantes.getIdEmpresa()

    let fecha = new Date();
    fecha.setDate(fecha.getDate() - 1 );
    let fechaS = fecha.toLocaleDateString();
    var month = fecha.getUTCMonth() + 1; //months from 1-12
    var day = fecha.getUTCDate();
    var year = fecha.getUTCFullYear();
   
    const httpHeaders = new HttpHeaders({
      'year': String(year) ,
      'mes' : String(month),
      'fecha' :String(day)
    }); 
    return this.http.get(Constantes.HOST + Constantes.GET_REPORTES + idEmpresa, {headers: httpHeaders});

  }

  /**
   * Get reportes para el mes anterior
   */
  consultarReportesMesAnterior(): Observable<any>{

    let idEmpresa = Constantes.getIdEmpresa()
    let fechaMesAnterior = new Date();
    let mesAnterior = fechaMesAnterior.getMonth();
    if(mesAnterior < 0){
      mesAnterior += 12;
      fechaMesAnterior.setFullYear(fechaMesAnterior.getFullYear() - 1);
    }
    fechaMesAnterior.setMonth(mesAnterior);

    fechaMesAnterior = new Date(fechaMesAnterior.getFullYear(), mesAnterior, 0);
    let fecha = fechaMesAnterior;
    var month = fecha.getUTCMonth() + 1; //months from 1-12
    var day = fecha.getUTCDate();
    var year = fecha.getUTCFullYear();
    console.log('mes anterior')
    console.log(year)
    console.log(month)
    console.log(day)
    const httpHeaders = new HttpHeaders({
      'year': String(year) ,
      'mes' : String(month),
      'fecha' :String(day)
    }); 
    return this.http.get(Constantes.HOST + Constantes.GET_REPORTES + idEmpresa, {headers: httpHeaders});

  }
}
