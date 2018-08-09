import { PetPorques } from "./pet-porques";
import { Catalogo } from "./catalogo";

export class PetIdeas {
    id_idea:number =-1;
    id_ishikawa:number =-1;
    id_eme:number = -1;
    idea: string;
    eme?:Catalogo;
    porques?: PetPorques;
}
