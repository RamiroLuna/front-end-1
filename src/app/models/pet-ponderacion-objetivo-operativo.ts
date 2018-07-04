import { PetCatObjetivoOperativo } from "./pet-cat-objetivo-operativo";

export class PetPonderacionObjetivoOperativo extends PetCatObjetivoOperativo{
    id_ponderacion_obj_operativo?:number;
    anio:number;
    ponderacion:number = 0;
    id_objetivo_operativo:number;
}
