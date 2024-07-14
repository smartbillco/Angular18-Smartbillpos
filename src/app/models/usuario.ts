import { Empresas } from './empresas';
import { Rol } from './seguridad/rol';

export class Usuario {
    "id": number;
    "email": string;
    "password": string;
    "tipo": number;
    "rol": string; // No necesitas inicialización aquí
    "estado"?: number;
    "idEmpresa": number;
    "listaRoles": Array<Rol> = []; // Inicialización aquí
    "nombreEmpleado": string;
    "idEmpleado"?: number;
    "empresa": Empresas;

 constructor(){this.setRol}

     setRol() {
        switch (this.tipo) {
            case 1:
                this.rol = 'ADMIN';
                break;
            case 2:
                this.rol = 'VENDEDOR';
                break;
            default:
                this.rol = 'OTRO';
                break;
        }
    }
}
