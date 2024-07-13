import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constantes } from '../../comun/constantes';
import { Rol } from '../../models/seguridad/rol';
import { Permiso } from '../../models/seguridad/permiso';
import { PermisoRol } from '../../models/seguridad/permiso-rol';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor(private http: HttpClient) { }

  /**
   * Recupera la lista de roles.
   */
  getListaRoles(): Observable<any> {
    return this.http.get(`${Constantes.HOST}${Constantes.GET_ROLES}${Constantes.getIdEmpresa()}`);
  }

  /**
   * Recupera la lista de roles activos.
   */
  getListaRolesActivos(): Observable<any> {
    return this.http.get(`${Constantes.HOST}${Constantes.GET_ROLES_ACTIVOS}${Constantes.getIdEmpresa()}`);
  }

  /**
   * Crea un nuevo rol.
   * @param rol El rol a crear.
   */
  nuevoRol(rol: Rol): Observable<any> {
    return this.http.post(`${Constantes.HOST}${Constantes.POST_ROL}`, rol);
  }

  /**
   * Actualiza un rol existente.
   * @param rol El rol a actualizar.
   */
  actualizarRol(rol: Rol): Observable<any> {
    return this.http.put(`${Constantes.HOST}${Constantes.PUT_ROL}`, rol);
  }

  /**
   * Asigna permisos a un rol.
   * @param permisosRol Los permisos a asignar.
   */
  asignarPermisoRol(permisosRol: PermisoRol[]): Observable<any> {
    return this.http.post(`${Constantes.HOST}${Constantes.POST_PERMISO_ROL}`, permisosRol);
  }

  /**
   * Asigna un rol a un usuario.
   * @param idRol El ID del rol.
   * @param idUsuario El ID del usuario.
   */
  asignarRolUsuario(idRol: number, idUsuario: number): Observable<any> {
    return this.http.post(`${Constantes.HOST}${Constantes.POST_ROL_USUARIO}${idRol}/${idUsuario}`, null);
  }

  /**
   * Elimina un rol.
   * @param id El ID del rol a eliminar.
   */
  eliminarRol(id: number): Observable<any> {
    return this.http.delete(`${Constantes.HOST}${Constantes.DELETE_ROL}${id}`);
  }

  /**
   * Recupera la lista de permisos.
   */
  getPermisos(): Observable<any> {
    return this.http.get(`${Constantes.HOST}${Constantes.GET_PERMISOS}${Constantes.getIdEmpresa()}`);
  }

  /**
   * Recupera la lista de permisos activos.
   */
  getPermisosActivos(): Observable<any> {
    return this.http.get(`${Constantes.HOST}${Constantes.GET_PERMISOS_ACTIVOS}${Constantes.getIdEmpresa()}`);
  }

  /**
   * Recupera los permisos asignados a un rol.
   * @param idRol El ID del rol.
   */
  getPermisosRol(idRol: number): Observable<any> {
    return this.http.get(`${Constantes.HOST}${Constantes.GET_PERMISOS_ROL}${idRol}`);
  }

  /**
   * Actualiza un permiso existente.
   * @param permiso El permiso a actualizar.
   */
  actualizarPermiso(permiso: Permiso): Observable<any> {
    return this.http.put(`${Constantes.HOST}${Constantes.PUT_PERMISO}`, permiso);
  }
}