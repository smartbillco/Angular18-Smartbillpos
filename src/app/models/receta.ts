import { Producto } from './producto';

export class Receta {
  "id": number;
  "idProducto": Producto;
  "idInsumo": number;
  "cantidad": number;
  "Insumo": string; // nombre del insumo
}