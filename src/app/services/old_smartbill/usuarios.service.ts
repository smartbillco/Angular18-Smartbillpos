import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../comun/constantes';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  getUsersByCompany(id: string): Observable<any> {
    return this.http.get(Constantes.HOST + Constantes.GET_USUARIOS_BY_COMPANY + id);
  }

  registerUser(user: Usuario): Observable<any> {
    console.log('Registrando usuario:', user);
    return this.http.post(Constantes.HOST + Constantes.POST_USUARIOS_REGISTRAR, user);
  }

  updateUser(user: Usuario): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.POST_UPDATE_USER, user).pipe(
      map((res: any) => true),
      catchError(err => {
        console.error('Error al actualizar usuario:', err);
        swal.fire('¡Error!', 'Error en la base de datos al actualizar usuario', 'error');
        return new Observable<any>((observer) => observer.error(err)); // Usar el constructor Observable para lanzar el error
      })
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(Constantes.HOST + Constantes.DELETE_USUARIO + `/${id}`).pipe(
      catchError(err => {
        console.error('Error al eliminar usuario:', err);
        swal.fire('¡Error!', 'Error en la base de datos al eliminar usuario', 'error');
        return new Observable<any>((observer) => observer.error(err)); // Usar el constructor Observable para lanzar el error
      })
    );
  }
}