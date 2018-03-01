export class User {
    id_usuario: number;
    id_sonarh?: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno?: string;
    departamento?: string;
    grupo?:string;
    linea?:string;
    clave: string;
    id_perfil: number;
    descripcion_perfil: string;
    activo: boolean;
    activo_etad:boolean;

    // getFullName() {
    //     return this.nombre + ' '+ this.apellido_paterno + ' ' + this.apellido_materno;
    // }
}
