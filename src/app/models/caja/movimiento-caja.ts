export class MovimientoCaja {
    "id": number;
    "idCaja": number;
    "idEmpleado": number;
    "idConcepto": number;
    "tipo": number;
    "valor": number;
    "fecha": string;

    "empleado": string;
    "concepto": string;
    "tipoNombre": string;
    "efectivoApertura": number;
}

export class AperturaCaja {
    "caja": number;
    "empleadoAbre": number;
    "efectivoApertura": number;
}

export class CierreCaja {
    "caja": number;
    "empleadoCierra": number;
    "efectivoCierre": number;
}