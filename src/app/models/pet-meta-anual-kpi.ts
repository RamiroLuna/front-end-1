import { Linea } from "./linea";
import { PetCatKpiOperativo } from "./pet-cat-kpi-operativo";

export class PetMetaAnualKpi {
    id_meta_anual_kpi:number;
    id_linea:number;
    id_kpi_operativo:number;
    anio:number;
    valor:number;
    linea:Linea;
    kPIOperativo: PetCatKpiOperativo;
}
