import { Time } from '@angular/common';

export class Insumo {
    "id": number;    
    "idProveedor": number;
    "idEmpresa": number;
    "idUnidadMedida": number;    
    "codigo": number;    
    "nombre": string;
    "descripcion": string;
    "cantidad": number;
    "fechaRegistro": Time;
    
    "proveedor": string;
    "unidadMedida": string;
    "inventario": number;

}