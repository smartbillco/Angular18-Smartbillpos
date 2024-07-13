export class Liquidacion {
    "id": number;
    "idUsuario": number;
    "fecha": string;
    "valor": number;
    "tipo": number;
    "concepto": string;
    "usuario": string;

    constructor(){
        this.valor = 0;
    }
}