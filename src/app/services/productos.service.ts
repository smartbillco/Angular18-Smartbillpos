import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constantes } from '../comun/constantes';
import { Producto } from '../models/producto';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr'; // Importa ToastrService desde ngx-toastr

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  producto!: Producto;
  listaProductos!: Array<Producto>;
  idEmpresa: string;

  private listaSource = new BehaviorSubject<Array<Producto>>(this.listaProductos);
  currentLista = this.listaSource.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) { // Inyecta ToastrService

    this.idEmpresa = localStorage.getItem("idEmpresa") || ""; // Inicialización defensiva
    if (!this.listaProductos || this.listaProductos.length === 0) {
      const resp = this.getAllProductos();
      resp.subscribe((response: any) => {
        this.listaProductos = response.msg;
        this.listaSource.next(this.listaProductos);
      });
    }
    
  }

  getAllProductos(): Observable<any> {
    let idEmpresa = localStorage.getItem("idEmpresa");
    return this.http.get(Constantes.HOST + Constantes.GET_PRODUCTOS_TODOS + "/" + idEmpresa);
  }

  createProducto(producto: Producto) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '63c42416b411d71fb39774c144d2bb842bb814ba'
    });
    return this.http.post(Constantes.HOST + Constantes.POST_PRODUCTOS, producto, { headers: httpHeaders });
  }



  updateProducto(producto: Producto) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '63c42416b411d71fb39774c144d2bb842bb814ba'
    });
    return this.http.post(Constantes.HOST + Constantes.POST_ACTUALIZAR_PRODUCTOS, producto, { headers: httpHeaders }).pipe(
      map((response: any) => {
        return true;
      }), 
      catchError(err => {
        this.toastr.error('Error!', err.error.message); // Usa this.toastr.error para mostrar el error
        return throwError(() => new Error(err.error.message)); // Usa la nueva firma de throwError
      })
    );
  }

  deleteProducto(producto: Producto) {
    const httpHeaders = new HttpHeaders({
      'Authorization': '63c42416b411d71fb39774c144d2bb842bb814ba'
    });
    return this.http.delete(Constantes.HOST + Constantes.DELETE_PRODUCTOS + '/' + producto.idProducto, { headers: httpHeaders });
  }


  // Traer productos de tipo tienda
  getProductsByType(tipoNegocio: string): Observable<any> {
    return this.http.get(`${Constantes.HOST}${Constantes.GET_PRODUCTOS}/${tipoNegocio}`);
  }

  getListarRecetas(tipoNegocio: string): Observable<any> {
    return this.http.get(`${Constantes.HOST}${Constantes.GET_PRODUCTOS}/${tipoNegocio}`);
  }

   /*
  
      @GetMapping("getDisponibles/{idEmpresa}")
    public String getDisponibles(@PathVariable("idEmpresa") String idEmpresa) {

        return gson.toJson(daoProducto.getDisponibles(Integer.parseInt(idEmpresa)));

    }
        */
  getProductosDisponibles() {
    let idEmpresa = localStorage.getItem("idEmpresa");
    return this.http.get(Constantes.HOST + Constantes.GET_PRODUCTOS_DISPONIBLES + "/" + idEmpresa);
  }

  /*
  @GetMapping("getByCategory")
  public String getProductosPorCategoria(HttpServletRequest request, HttpServletResponse response) {

      int idCategory = (Integer) (request.getAttribute("idCategoria"));

      return gson.toJson(daoProducto.getByCategory(idCategory));

  }*/
  
  uploadFile(file: File): Observable<any> {
    let url = Constantes.HOST + Constantes.POST_ARCHIVO_PRODUCTOS + this.idEmpresa;
    let formData = new FormData();
    formData.append('file', file);

    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    return this.http.post(url, formData, options);
  }

  getReporteInventario(listaProductos: Array<Producto>): Observable<any> {
    return this.http.post(Constantes.HOST + Constantes.GET_REPORTE_INV_PROD + Constantes.getIdEmpresa(), listaProductos, { responseType: 'blob' });
  }
}