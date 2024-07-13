import { DetalleFactura } from './detalleFactura';

export class  Factura {


        "idFactura": number;
        "idMediosPago": number;
        "idEmpleado": number;
        "idCliente": number;
        "valor": number;
        "codigo": string;
        "fecha": string;
        "estado": string;
        "recibido": number;
        "cambio": number;
        "descuento": number;
        "listDetallesFactura": Array<DetalleFactura>;
        "idEmpresa": number;
        "tipoDescuento": number;
        "subTotal": number;
        "idCaja": number;
        "efectivo": number;
        "saldo": number;
        "cliente": string;
        "usuario": string;
        "cheque": number;
        "tarjeta": number;
    }
    
    export class Invoice {
        "idFactura": number;
        "idMediosPago"?: any;
        "idEmpleado": number;
        "nombreEmpleado": string;
        "idEmpresa": number;
        "idCliente": number;
        "nombreCliente": string;
        "codigo"?: any;
        "fecha": string;
        "valor": number;
        "estado": string;
        "usuario"?: any;
        "recibido": number;
        "cambio": number;
        "descuento": number;
        "tipoDescuento": number;
        "idCaja"?: any;
        "subTotal": number;
        "saldo"?: any;
        "cliente": string;
        "medioPago"?: any;
        "tarjeta": number;
        "efectivo": number;
        "cheque": number;
        "cxc": number;
        "listDetallesFactura": ListDetallesFactura[];
        "valuesForReport": (null | string)[];
    }
    
    export class ListDetallesFactura {
        "id": number;
        "idFactura": number;
        "idProducto": number;
        "productoNombre": string;
        "precioProducto": number;
        "total": number;
        "cantidad": number;
        "fecha": string;
        "nombre"?: any;
    }
// Implementación de la función setFecha en una clase que utiliza la interfaz Factura
export class FacturaService {
    setFecha(factura: Factura) {
        factura.listDetallesFactura.forEach(element => {
            element.fecha = factura.fecha;
        });
    }
}