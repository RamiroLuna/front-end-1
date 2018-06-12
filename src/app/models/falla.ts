export class Falla {

    id_falla:number;
    descripcion:string;
    hora_inicio:string;
    hora_final:string;
    tiempo_paro:string ="0";
    id_meta:number;
    id_razon:number;
    id_equipo:number;
    estatus:number;
    id_usuario_registro:number;
    fecha_modificacion_registro:string;
    id_usuario_modifica_usuario:number;
    id_fuente:number;
    id_linea:number;
    id_grupo:number;
    id_turno:number;
    dia:string;
    diaString:string;

    descripcion_equipo?:string ="";

    valor_grupo?:string;
    valor_linea?:string;
    valor_razon?:string;
    valor_turno?:string;
    valor_fuente?:string;
    valor_equipo?:string;

    validado?:boolean;


}
