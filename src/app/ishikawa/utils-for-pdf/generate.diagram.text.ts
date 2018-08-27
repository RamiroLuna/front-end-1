import { PetIshikawa } from "../../models/pet-ishikawa";
import { PetIdeas } from "../../models/pet-ideas";

function ajusteDeTexto(texto, x, y, maxWidth, alturaDeLinea, ctx: any) {
    // crea el array de las palabras del texto
    let palabrasRy = texto.split(" ");
    // inicia la variable var lineaDeTexto
    let lineaDeTexto = "";
    // un bucle for recorre todas las palabras
    for (var i = 0; i < palabrasRy.length; i++) {
        var testTexto = lineaDeTexto + palabrasRy[i] + " ";
        // calcula la anchura del texto textWidth 
        var textWidth = ctx.measureText(testTexto).width;
        // si textWidth > maxWidth
        if (textWidth > maxWidth && i > 0) {
            // escribe en el canvas la lineaDeTexto
            ctx.fillText(lineaDeTexto, x, y);
            // inicia otra lineaDeTexto			
            lineaDeTexto = palabrasRy[i] + " ";
            // incrementa el valor de la variable y 
            //donde empieza la nueva lineaDeTexto
            y += alturaDeLinea;
        } else {// de lo contrario,  si textWidth <= maxWidth 
            lineaDeTexto = testTexto;
        }
    }// acaba el bucle for
    // escribe en el canvas la última lineaDeTexto
    ctx.fillText(lineaDeTexto, x, y);
}

function getIdeasByEmeSelected(id_eme: number, ishikawa: PetIshikawa): Array<PetIdeas> {
    return ishikawa.listIdeas.filter(el => el.id_eme == id_eme && el.porques != undefined);
}

function getDiamagraIshikawa(ishikawa: PetIshikawa, ctx: any, canvas: any) {
    //Pinta probelma
    ajusteDeTexto(ishikawa.problema, canvas.width - 180, 173, 175, 8, ctx);

    //Mano de obra
    let ideas_mano_obra = getIdeasByEmeSelected(1, ishikawa);
    for (let i = 0; i < 3 && ideas_mano_obra[i]; i++) {
        let porques = ideas_mano_obra[i].porques;
        let resta = (i == 0)? 389: (i == 1)? 322 : 256;
        ajusteDeTexto(ideas_mano_obra[i].idea, canvas.width - resta, 262, 66, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 322, 66, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 349, 66, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 376, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 403, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 430, 66, 8, ctx);
    }

    //Mediciones
    let ideas_medicion = getIdeasByEmeSelected(3, ishikawa);
    for (let i = 0; i < 3 && ideas_medicion[i]; i++) {
        let porques = ideas_medicion[i].porques;
        let resta = (i == 0)? 615: (i == 1)? 548 : 482;
        ajusteDeTexto(ideas_medicion[i].idea, canvas.width - resta, 262, 66, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 322, 66, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 349, 66, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 376, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 403, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 430, 66, 8, ctx);
    }

    //Medio ambiente
    let ideas_medio_ambiente = getIdeasByEmeSelected(6, ishikawa);
    for (let i = 0; i < 3 && ideas_medio_ambiente[i]; i++) {
        let porques = ideas_medio_ambiente[i].porques;
        let resta = (i == 0)? 840: (i == 1)? 773 : 707;
        ajusteDeTexto(ideas_medio_ambiente[i].idea, canvas.width - resta, 262, 66, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 322, 66, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 349, 66, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 376, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 403, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 430, 66, 8, ctx);
    }

    //Maquinaria
    let ideas_maquinaria = getIdeasByEmeSelected(2, ishikawa);
    for (let i = 0; i < 3 && ideas_maquinaria[i]; i++) {
        let porques = ideas_maquinaria[i].porques;
        let resta = (i == 0)? 389: (i == 1)? 322 : 256;
        ajusteDeTexto(ideas_maquinaria[i].idea, canvas.width - resta, 200, 66, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 173, 66, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 146, 66, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 119, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 92, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 65, 66, 8, ctx);
    }

    //Metodo
    let ideas_metodo = getIdeasByEmeSelected(4, ishikawa);
    for (let i = 0; i < 3 && ideas_metodo[i]; i++) {
        let porques = ideas_metodo[i].porques;
        let resta = (i == 0)? 615: (i == 1)? 548 : 482;
        ajusteDeTexto(ideas_metodo[i].idea, canvas.width - resta, 200, 66, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 173, 66, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 146, 66, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 119, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 92, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 65, 66, 8, ctx);
    }

    //Material
    let ideas_material = getIdeasByEmeSelected(5, ishikawa);
    for (let i = 0; i < 3 && ideas_material[i]; i++) {
        let porques = ideas_material[i].porques;
        let resta = (i == 0)? 840: (i == 1)? 773 : 707;
        ajusteDeTexto(ideas_material[i].idea, canvas.width - resta, 200, 66, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 173, 66, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 146, 66, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 119, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 92, 66, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 65, 66, 8, ctx);
    }

}

export {
    getDiamagraIshikawa
}