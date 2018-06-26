import { PetCatKpiOperativo } from "./pet-cat-kpi-operativo";
import { PetCatMetaEstrategica } from "./pet-cat-meta-estrategica";
import { PetCatObjetivoOperativo } from "./pet-cat-objetivo-operativo";

export class MetaKpi {
    id_etad:number;
    tipo_meta:number;
    frecuencia:string;
    anio:number;
    id_periodo:number;
    
    
    id_option_meta?: number;
    meta?:number=0;
    unidad_medida?: string = "N/A";
    mas?:number = -1;
    menor?:number = -1;
    
    kPIOperativo?: PetCatKpiOperativo;
    metaEstrategica?: PetCatMetaEstrategica;
    objetivoOperativo?: PetCatObjetivoOperativo;

    // listKPIOperativo:Array<PetMetaAnualKpi>;
    // ListMetaEstrategica:Array<PetMetaAnualEstrategica>;
    // listObjetivoOperativo:Array<PetMetaAnualObjetivoOperativo>;
}
