import { PetVerificacion } from "./pet-verificacion";

export class PetPlanAccion {
    id_plan:number;
    accion:string;
    responsable:string;
    fecha:string;
    id_porque:number;
    verificacion:PetVerificacion;
    control_error:number= -1;
}
