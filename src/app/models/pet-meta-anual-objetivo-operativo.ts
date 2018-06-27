import { Linea } from "./linea";
import { PetCatObjetivoOperativo } from "./pet-cat-objetivo-operativo";

export class PetMetaAnualObjetivoOperativo {

    id_meta_anual_objetivo_operativo:number;
    id_linea:number;
    id_objetivo_operativo:number;
    anio:number;
    valor:number;
    linea:Linea;
    objetivoOperativo:PetCatObjetivoOperativo;

}
