import { PetIdeas } from "./pet-ideas";
import { PetConsenso } from "./pet-consenso";
import { Catalogo } from "./catalogo";

export class PetIshikawa {
    id:number;
    fecha_string: string;
    que: string;
    donde: string;
    cuando: string;
    como: string;
    problema: string;
    fecha:string;
    nombre_etad: string;
    id_grupo:number;
    id_etad:number;
    causa_raiz: string;
    solucionado:number;
    recurrente:number;
    analisis:number;
    elaborado: string;
    revisado: string;
    autorizado: string;
    estatus:number;
    listIdeas:  Array<PetIdeas> = [];
    listConsenso: Array<PetConsenso> = [];

    etad?:Catalogo;
    grupo?:Catalogo;
}
