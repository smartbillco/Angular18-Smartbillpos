import { Factura } from "../facturas";

export class MeseroMesa {
    "id": number;
    "idMesero": number;
    "idMesa": number;
    "estado": number;
    "cantidadPersonas": number;
    "fecha": string;

    "factura": Factura;
}