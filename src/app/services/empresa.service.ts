import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constantes } from '../comun/constantes';
import { Observable } from 'rxjs';
import { Empresas } from '../models/empresas';
import { catchError, map } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient) { }

  getInfoEmpresa(): Observable<any> {
    let nit = localStorage.getItem("nit")
    return this.http.get(Constantes.HOST + Constantes.GET_INFO_EMPRESA + nit);
  }

  actualizarEmpresa(emp: Empresas){
    return this.http.put(Constantes.HOST + Constantes.PUT_EMPRESA, emp).pipe(
      map( (response: any) => true ),
      catchError( err => {
      return swal.fire('Error!', err.error.message, 'error')})
    )
  }
}
