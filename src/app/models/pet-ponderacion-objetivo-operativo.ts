import { PetCatObjetivoOperativo } from "./pet-cat-objetivo-operativo";

export class PetPonderacionObjetivoOperativo{
    id_ponderacion_obj_operativo?:number;
    anio:number;
    ponderacion:number = 0;
    id_objetivo_operativo:number;
    objetivoOperativo:PetCatObjetivoOperativo = new PetCatObjetivoOperativo();
}
