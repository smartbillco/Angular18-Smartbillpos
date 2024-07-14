import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { CategoriaProducto } from '../models/categoriaProducto';
import { Observable, BehaviorSubject } from 'rxjs';
import { Constantes } from '../comun/constantes';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  listaCategoria: CategoriaProducto[] = []; // Inicialización vacía del arreglo

  private catlistaSource = new BehaviorSubject<CategoriaProducto[]>(this.listaCategoria);
  catcurrentLista = this.catlistaSource.asObservable();

  constructor(private http: HttpClient) { }

  getAllCategorias(): Observable<CategoriaProducto[]> {
    return this.http.get<CategoriaProducto[]>(Constantes.HOST + Constantes.GET_CATEGORIAS);
  }

  createCategoria(categoria: CategoriaProducto): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '63c42416b411d71fb39774c144d2bb842bb814ba'
    });
    return this.http.post(Constantes.HOST + Constantes.POST_CATEGORIAS, categoria, { headers: httpHeaders });
  }

  updateCategoria(categoria: CategoriaProducto): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '63c42416b411d71fb39774c144d2bb842bb814ba'
    });
    return this.http.post(Constantes.HOST + Constantes.POST_ACTUALIZAR_CATEGORIAS, categoria, { headers: httpHeaders });
  }

  deleteCategoria(categoria: CategoriaProducto): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Authorization': '63c42416b411d71fb39774c144d2bb842bb814ba'
    });
    return this.http.delete(`${Constantes.HOST}${Constantes.DELETE_CATEGORIAS}/${categoria.idCategoriaProducto}`, { headers: httpHeaders });
  }

  uploadFile(file: File): Observable<any> {
    const url = Constantes.HOST + Constantes.POST_ARCHIVO_CATEGORIAS;
    const formData = new FormData();
    formData.append('file', file);
    const params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    return this.http.post(url, formData, options);
  }
}