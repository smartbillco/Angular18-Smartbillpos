export class CompraProducto {
    "idProducto": number;
    "idEmpresa": number;
    "idUsuario": number;
    "medida": string;
    "valor": number;
    "valorUnitario": number;
    "cantidad": number;
    "totalUnidades": number;
    "fecha": string;
    "cantUnidadesMedida": number;
    "usuario": string;
    "producto": string;

    constructor(){
        this.valor = 0;
        this.valorUnitario = 0;
        this.cantUnidadesMedida = 0;
        this.cantidad = 0;
        this.totalUnidades = 0;
    }

    setValor(){

        this.valor = this.cantidad * this.valorUnitario;
    }
    setTotalUnidades(){

        this.totalUnidades = this.cantidad * this.cantUnidadesMedida;
        
    }
}