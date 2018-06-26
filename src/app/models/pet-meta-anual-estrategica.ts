import { Linea } from "./linea";
import { PetCatMetaEstrategica } from "./pet-cat-meta-estrategica";

export class PetMetaAnualEstrategica {
    id_meta_anual_estrategica:number = -1;
    id_linea:number = -1;
    id_meta_estrategica:number = -1;
    anio:number = -1;
    valor:number;
    linea:Linea;
    metaEstrategica:PetCatMetaEstrategica;
}
