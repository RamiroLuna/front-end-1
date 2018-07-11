import { PetEtadKpi } from "./pet-etad-kpi";

export class PetMetaKpi {
    id_meta_kpi:number;
    valor: number;
    id_periodo:number;
    id_kpi_etad:number;
    etadKpi: PetEtadKpi;

    /*
     * class_input variable utilizada en el front para marcar de rojo
     * el input del elemento en caso de contener error de dato
     */ 
    class_input:string="error";
}
