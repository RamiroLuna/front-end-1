import { PetMetaAnualKpi } from "./pet-meta-anual-kpi";
import { PetMetaAnualEstrategica } from "./pet-meta-anual-estrategica";
import { PetMetaAnualObjetivoOperativo } from "./pet-meta-anual-objetivo-operativo";


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
    
    kPIOperativo:PetMetaAnualKpi = new PetMetaAnualKpi();
    metaEstrategica:PetMetaAnualEstrategica = new PetMetaAnualEstrategica();
    objetivoOperativo:PetMetaAnualObjetivoOperativo = new PetMetaAnualObjetivoOperativo();

    // listKPIOperativo:Array<PetMetaAnualKpi>;
    // ListMetaEstrategica:Array<PetMetaAnualEstrategica>;
    // listObjetivoOperativo:Array<PetMetaAnualObjetivoOperativo>;
}
