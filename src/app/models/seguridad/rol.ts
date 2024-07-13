import { Permiso } from './permiso';

export class  Rol {

    "id": number;
    "nombre": string;
    "estado": number; 
    "idEmpresa": number;
    "listaPermisos": Array<Permiso>;
    
    constructor(){}

}

