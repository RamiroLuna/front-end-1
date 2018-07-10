export class PonderacionKpiOperativos {
    id_ponderacion_kpi?:number;
    id_kpi_etad?:number;
    kpi:string;
    padre:number;
    ponderacion:number;

    //control varible para controlar las ponderaciones
    control?:number;
    /*
     * suma_ok variable utilizada solo por los elementos que tengan 
     * valor 0 en el atributo padre 
     */ 
    
    suma_ok?:boolean = false;

}
