export class  MovimientoInventario {
  "id": number;
  "idProducto": number;
  "idInsumo": number;
  "cantidad": number;
  "idEmpleado": number;
  "observacion": string;
  "concepto": string;
  "fecha": string;
  "unidadMedida": string;
  "tipo": number;
  "producto": string;
  "empleado": string;
  "nombreTipo": string;
}

export class  InventoryMovements {
  "id": number;
  "tipo": number;
  "observacion": string;
  "concepto": string;
  "fecha": string;
  "cantidad": number;
  "idProducto": number;
  "idInsumo"?: number;
  "idEmpleado": number;
  "nombreEmpleado": string;
}
