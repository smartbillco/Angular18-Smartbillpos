import {Time} from '@angular/common';
import {Receta} from './receta';


export class Producto {

  "codigoBarra": string;
  "idProducto": number;
  "idCategoria": number;
  "idProveedor": number;
  "idEmpresa": number;
  "idUnidadMedida": number;
  "tipoNegocio": number;
  "codigo": string;
  "nombre": string;
  "descripcion": string;
  "costo": number;
  "precio": number;
  "codigoBarras": string;
  "fechaRegistro": Date;
  "inventario": number;
  "minStock": number;
  "maxStock": number;
  "precioMinimo": number;
  "impoConsumo": number;
  "foto": string;

  //idReceta: Receta;
  "listRecetas": Array<Receta>;

  "categoria": string;
  "proveedor": string;
  "unidadMedida": string;

  constructor() {

    this.listRecetas = new Array<Receta>();
  }

}
