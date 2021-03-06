import { Periodo } from "./periodo";

export class PetReporteEnlace {
    id_reporte_enlace:number;
    id_periodo:number;
    objetivo_estrategico_uno:string;
    objetivo_estrategico_dos:string;
    objetivo_estrategico_tres:string;
    meta_estrategica_uno:string;
    meta_estrategica_dos:string;
    meta_estrategica_tres:string;
    meta_estrategica_cuatro:string;
    merma_mensual:number;
    merma_real:number;
    subproducto_mensual:number;
    subproducto_real:number;
    costo_unitario_real:number;
    mdp_mensual:number;
    mdp_real:number;
    eficiencia_entregas_compra_mensual:number;
    eficiencia_entregas_compra_real:number;
    no_fugas_pet_real:number;
    costo_unitario:number;
    ajuste_error_inventario:number;
    eficiencia_carga_real:number;
    descarga_mp_real:number;
    liberacion_embarques:number;
    efectividad_entrega_cliente_real:number;
    control_entradas_salidas_contratistas:number;
    control_entradas_salidas_transportistas:number;
    control_entradas_salidas_proveedores:number;
    control_entradas_salidas_visitantes:number;
    ot_alimentadas_mp9:number;
    nuevo:boolean;
    periodo: Periodo;
}
