export class Periodo {
    id_periodo: number;
    anio: number;
    mes: number;
    descripcion_mes: string;
    estatus: number;

    id_metas_periodo?:number;
    disponibilidad?:number;
    utilizacion?:number;
    calidad?:number;
    oee?:number;
    eficiencia_teorica?:number;
    no_ventas?:number;
    velocidad_ideal?:number;
    velocidad_po?:number;
    id_gpo_linea?:number;
}
