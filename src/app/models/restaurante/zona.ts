import { Mesa } from "./mesa";

export class Zona {
    "id": number;
    "nombre": string;
    "idRestaurante": number;
    "listaMesas": Array<Mesa>;
}