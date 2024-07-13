import { Compra } from "./compra";

export class FacturaProveedor {

      "id": number;
      "idProveedor": number;
      "idEmpleado": number;
      "idEmpresa": number;

      "fecha": string;
      "fechaVencimiento": string;
      "numero": string;
      "estado": string;

      "proveedor": string;
      "empleado": string;
    
      "valor": number;
      "saldo": number;

      "nombreEmpleado": string;
      "nombreProveedor": string;
    
     "listaCompras": Array<Compra>;
}