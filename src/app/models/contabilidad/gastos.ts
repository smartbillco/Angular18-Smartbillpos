export class Gastos {
        "id": number;
        "tipo": number;
        "idEmpresa": number;
        "fecha": string;
        "descripcion": string;
        "valor": number;
    
        "concepto": string;
    
        setConcepto(){
            switch(this.tipo){
                case 1:
                        this.concepto = 'GASTOS ADMINISTRATIVOS'
                        break;
                case 2:
                        this.concepto = 'COMPRA DE INSUMOS'
                        break;
                case 3:
                        this.concepto = 'PAGO DE SERVICIOS A TERCEROS'
                        break;
                case 4:
                        this.concepto = 'OTROS'
                        break;
            }
        }
    }