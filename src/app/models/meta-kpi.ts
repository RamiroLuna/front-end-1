import { PetMetaAnualKpi } from "./pet-meta-anual-kpi";
import { PetMetaAnualEstrategica } from "./pet-meta-anual-estrategica";
import { PetMetaAnualObjetivoOperativo } from "./pet-meta-anual-objetivo-operativo";


export class MetaKpi {
    id_etad:number;
    tipo_meta:number;
    frecuencia:string;
    anio:any;
    id_periodo:any;
    
    
    id_option_meta?: any;
    meta?:number=0;
    unidad_medida?: string = "N/A";
    mas?:number = -1;
    menor?:number = -1;
    
    kPIOperativo:PetMetaAnualKpi = new PetMetaAnualKpi();
    metaEstrategica:PetMetaAnualEstrategica = new PetMetaAnualEstrategica();
    objetivoOperativo:PetMetaAnualObjetivoOperativo = new PetMetaAnualObjetivoOperativo();

    listKPIOperativo?:Array<PetMetaAnualKpi>;
    listMetaEstrategica:Array<PetMetaAnualEstrategica>;
    listObjetivoOperativo:Array<PetMetaAnualObjetivoOperativo>;
}
