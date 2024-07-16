import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constantes } from '../comun/constantes';
import { Empleados } from '../models/empleados';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(private http: HttpClient) { }

  getListaEmpleados(): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_EMPLEADOS + Constantes.getIdEmpresa());
  }

  nuevoEmpleado(emp: Empleados): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_EMPLEADOS, emp);
  }

  actualizarEmpleado(emp: Empleados): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.PUT_EMPLEADO, emp);
  }

  eliminarEmpleado(id: string): Observable<any> {
 
    return this.http.delete(Constantes.HOST + Constantes.DELETE_EMPLEADO + id  );
    
  }

  getReporte(): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_REPORTE_EMPLEADOS + Constantes.getIdEmpresa(), {responseType: 'blob'});
  }
}
