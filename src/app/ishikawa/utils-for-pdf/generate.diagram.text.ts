import { PetIshikawa } from "../../models/pet-ishikawa";
import { PetIdeas } from "../../models/pet-ideas";

function ajusteDeTexto(texto="", x, y, maxWidth, alturaDeLinea, ctx: any) {
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
    ajusteDeTexto(ishikawa.problema, canvas.width - 165, 178, 170, 8, ctx);

    //Mano de obra
    let ideas_mano_obra = getIdeasByEmeSelected(1, ishikawa);
    for (let i = 0; i < 3 && ideas_mano_obra[i]; i++) {
        let porques = ideas_mano_obra[i].porques;
        let resta = (i == 0)? 420: (i == 1)? 335 : 250;
        ajusteDeTexto(ideas_mano_obra[i].idea, canvas.width - resta, 262, 80, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 320, 80, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 353, 80, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 386, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 419, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 452, 80, 8, ctx);
    }

    //Mediciones
    let ideas_medicion = getIdeasByEmeSelected(3, ishikawa);
    for (let i = 0; i < 3 && ideas_medicion[i]; i++) {
        let porques = ideas_medicion[i].porques;
        let resta = (i == 0)? 705: (i == 1)? 620 : 535;
        ajusteDeTexto(ideas_medicion[i].idea, canvas.width - resta, 262, 80, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 320, 80, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 353, 80, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 386, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 419, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 452, 80, 8, ctx);
    }

    //Medio ambiente
    let ideas_medio_ambiente = getIdeasByEmeSelected(6, ishikawa);
    for (let i = 0; i < 3 && ideas_medio_ambiente[i]; i++) {
        let porques = ideas_medio_ambiente[i].porques;
        let resta = (i == 0)? 990: (i == 1)? 905 : 820;
        ajusteDeTexto(ideas_medio_ambiente[i].idea, canvas.width - resta, 262, 80, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 320, 80, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 353, 80, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 386, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 419, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 452, 80, 8, ctx);
    }

    //Maquinaria
    let ideas_maquinaria = getIdeasByEmeSelected(2, ishikawa);
    for (let i = 0; i < 3 && ideas_maquinaria[i]; i++) {
        let porques = ideas_maquinaria[i].porques;
        let resta = (i == 0)? 420: (i == 1)? 335 : 250;
        ajusteDeTexto(ideas_maquinaria[i].idea, canvas.width - resta, 200, 80, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 167, 80, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 134, 80, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 101, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 68, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 35, 80, 8, ctx);
    }

    //Metodo
    let ideas_metodo = getIdeasByEmeSelected(4, ishikawa);
    for (let i = 0; i < 3 && ideas_metodo[i]; i++) {
        let porques = ideas_metodo[i].porques;
        let resta = (i == 0)? 705: (i == 1)? 620 : 535;
        ajusteDeTexto(ideas_metodo[i].idea, canvas.width - resta, 200, 80, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 167, 80, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 134, 80, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 101, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 68, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 35, 80, 8, ctx);
    }

    //Material
    let ideas_material = getIdeasByEmeSelected(5, ishikawa);
    for (let i = 0; i < 3 && ideas_material[i]; i++) {
        let porques = ideas_material[i].porques;
        let resta = (i == 0)? 990: (i == 1)? 905 : 820;
        ajusteDeTexto(ideas_material[i].idea, canvas.width - resta, 200, 80, 8, ctx);
        ajusteDeTexto(porques.porque_uno, canvas.width - resta, 167, 80, 8, ctx);
        ajusteDeTexto(porques.porque_dos, canvas.width - resta, 134, 80, 8, ctx);
        ajusteDeTexto(porques.porque_tres, canvas.width - resta, 101, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cuatro, canvas.width - resta, 68, 80, 8, ctx);
        ajusteDeTexto(porques.porque_cinco, canvas.width - resta, 35, 80, 8, ctx);
    }

}

export {
    getDiamagraIshikawa
}