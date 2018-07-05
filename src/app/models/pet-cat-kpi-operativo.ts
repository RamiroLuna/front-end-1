import { Catalogo } from "./catalogo";
import { PetCatObjetivoOperativo } from "./pet-cat-objetivo-operativo";
import { PetCatFrecuencia } from "./pet-cat-frecuencia";

export class PetCatKpiOperativo extends Catalogo{

    id_cat_objetivo_operativo:number;
    id_frecuencia:number;
    tipo_kpi:number;
    unidad_medida:string;
    lineas:string = "";
    objetivoOperativo:PetCatObjetivoOperativo;
    frecuencia:PetCatFrecuencia;
    tipo_operacion:number;
}
