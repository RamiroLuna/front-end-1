import { PetIshikawa } from "../../models/pet-ishikawa";
import {
    getImageHeader,
    getSteepOne,
    getSteepTwo,
    getSteepThree,
    getSteepFour,
    getSteepFive,
    getSteepSix,
    getImageBackground
} from '../utils-for-pdf/images.base64.pdf';

function getDefinitionPdf(ishikawa: PetIshikawa, diagrama_base_64: any, tabla_apdt: any, acciones: any, efectividad: any, porque_acciones: any): any {
    let dd = {
        header: [
            {
                alignment: 'center',
                height: 45,
                image: getImageHeader()
            }
        ],

        content: [
            '\n',
            //Descripción del problema
            {

                alignment: 'center',
                width: 220,
                image: getSteepOne()

            },
            '\n',
            {
                alignment: 'center',
                columns: [
                    {
                        style: 'tabla',
                        table: {
                            widths: [220],
                            body: [
                                [{ text: 'Nombre ETAD', style: 'fuenteTabla' }],
                                [{ text: ishikawa.nombre_etad, style: 'textoTabla' }]
                            ]
                        }
                    },
                    {
                        style: 'tabla',
                        table: {
                            widths: [220],
                            body: [
                                [{ text: 'Grupo', style: 'fuenteTabla' }],
                                [{ text: ishikawa.grupo.valor, style: 'textoTabla' }]
                            ]
                        }
                    },
                    {
                        style: 'tabla',
                        table: {
                            widths: [220],
                            body: [
                                [{ text: 'Área', style: 'fuenteTabla' }],
                                [{ text: ishikawa.etad.valor, style: 'texttoTabla' }]
                            ]
                        }
                    }
                ]
            },
            '\n',
            {
                alignment: 'center',
                columns: [
                    {
                        text: 'Definición del problema',
                        style: 'fuente'
                    },
                    {
                        text: ''
                    }
                ]
            },
            '\n',
            {
                alignment: 'center',
                columns: [
                    {
                        style: 'tabla',
                        table: {
                            widths: [350],
                            heights: ['*', 30, '*', 30, '*', 30, '*', 30],
                            body: [

                                [{ text: '¿Qué situación se presenta?', style: 'fuenteTabla' }],
                                [{ text: ishikawa.que, style: 'textoTabla' }],
                                [{ text: '¿Dónde se presenta la situación?', style: 'fuenteTabla' }],
                                [{ text: ishikawa.donde, style: 'textoTabla' }],
                                [{ text: '¿Cuándo se presenta?', style: 'fuenteTabla' }],
                                [{ text: ishikawa.cuando, style: 'textoTabla' }],
                                [{ text: '¿Cómo afecta la situación?', style: 'fuenteTabla' }],
                                [{ text: ishikawa.como, style: 'textoTabla' }]
                            ]
                        }
                    }
                    ,
                    {
                        style: 'tabla',

                        table: {
                            widths: [370],
                            heights: ['*', 200],
                            body: [
                                [{ text: 'Define el enunciado del problema', style: 'fuenteTabla' }],
                                [{ text: ishikawa.problema, style: 'textoTabla' }],
                            ]
                        }
                    }
                ]
            },
            '\n\n\n\n\n\n\n\n\n',
            //Lluvia de ideas
            {
                alignment: 'center',
                width: 220,
                image: getSteepTwo()

            },
            '\n',
            {
                style: 'tabla',
                table: {
                    alignment: 'center',
                    widths: [750],
                    heights: ['*', 40, '*', 40, '*', 40, '*', 40, '*', 40, '*', 40],
                    body: [
                        [{ text: 'Mano de Obra', style: 'fuenteTabla' }],
                        [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 1).map(el => el.idea).toString(), style: 'textoTabla' }],
                        [{ text: 'Maquinaria', style: 'fuenteTabla' }],
                        [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 2).map(el => el.idea).toString(), style: 'textoTabla' }],
                        [{ text: 'Mediciones', style: 'fuenteTabla' }],
                        [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 3).map(el => el.idea).toString(), style: 'textoTabla' }],
                        [{ text: 'Método', style: 'fuenteTabla' }],
                        [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 4).map(el => el.idea).toString(), style: 'textoTabla' }],
                        [{ text: 'Material', style: 'fuenteTabla' }],
                        [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 5).map(el => el.idea).toString(), style: 'textoTabla' }],
                        [{ text: 'Medio Ambiente', style: 'fuenteTabla' }],
                        [{ text: ishikawa.listIdeas.filter(el => el.id_eme == 6).map(el => el.idea).toString(), style: 'textoTabla' }]
                    ]
                }
            },
            '\n\n\n',
            //Diagrama de ishikawa
            {
                alignment: 'center',
                width: 220,
                image: getSteepThree()
            },
            '\n\n',
            {
                alignment: 'center',
                width: 650,
                image: diagrama_base_64
            },
            '\n\n\n\n\n',
            //Test de causa raíz  
            {
                alignment: 'center',
                width: 220,
                image: getSteepFour()

            },
            '\n\n',
            {
                alignment: 'center',
                columns: [
                    {
                        style: 'tabla',
                        table: {
                            widths: [350],
                            heights: ['*', 200],
                            body: [
                                [{ text: 'Describe la causa raíz', style: 'fuenteTabla' }],
                                [{ text: ishikawa.causa_raiz, style: 'textoTabla' }]
                            ]
                        }
                    },
                    {
                        style: 'tabla',
                        table: {
                            widths: [270, 40, 40],
                            heights: ['*', 50, 50, 50, 50, 50, 50, 50],
                            body: [
                                [{ text: 'Text de causa raíz', style: 'fuenteTabla' }, { text: 'Sí', style: 'fuenteTabla' }, { text: 'No', style: 'fuenteTabla' }],
                                [{ text: '¿El enunciado de la causa raíz idenrifica a algún elemento del proceso?', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }],
                                [{ text: '¿Es controlable la causa raíz?', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }],
                                [{ text: '¿Se puede preguntar "por qué" otra vez y obtener otra causa raíz controlable?', style: 'textoTabla' }, { text: '', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }],
                                [{ text: '¿La causa raíz identificada es la falla fundamental del proceso?', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }],
                                [{ text: 'Si corregimos o mejoramos la causa raíz identificada, ¿Asegurará que el problema identificado no vuelva a ocurrir?', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }],
                                [{ text: '¿Hemos identificado la causa raíz del prblema?', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }],
                                [{ text: 'Ya checamos que nuestra causa raíz identificada sea aplicable para más de una parte o proceso', style: 'textoTabla' }, { text: 'X', style: 'textoTabla' }, { text: '', style: 'textoTabla' }]
                            ]
                        }
                    }
                ]
            },
            '\n\n',
            //Tabla guia ADTP y plan de acción
            {
                alignment: 'center',
                width: 220,
                image: getSteepFive()
            },
            '\n',
            {
                style: 'tabla',
                table: {
                    heights: ['*', 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
                    body: tabla_apdt
                }
            },
            '\n\n\n',
            //Verificación y Seguimiento
            {
                alignment: 'center',
                width: 220,
                image: getSteepSix()
            },
            '\n',
            {
                alignment: 'center',
                columns: [
                    {
                        text: 'Colocar el enunciado del problema',
                        style: 'fuenteTabla2'
                    },
                    {
                        text: 'Describe la causa raíz',
                        style: 'fuenteTabla2'
                    },
                    {
                        text: 'Coloca las acciones correctivas',
                        style: 'fuenteTabla2'
                    },
                    {
                        text: '¿Fueron efectivas?',
                        style: 'fuenteTabla2'
                    },
                    {
                        text: '¿Por qué?',
                        style: 'fuenteTabla2'
                    }
                ]
            },
            {
                alignment: 'center',
                columns: [
                    {
                        style: 'tabla',
                        table: {
                            widths: [140],
                            heights: [300],
                            body: [
                                [{ text: ishikawa.problema, style: 'textoIshikawa' }]
                            ]
                        }
                    },
                    {
                        style: 'tabla',
                        table: {
                            widths: [140],
                            heights: [300],
                            body: [
                                [{ text: ishikawa.causa_raiz, style: 'textoIshikawa' }]
                            ]
                        }
                    },
                    {
                        style: 'tabla',
                        table: {
                            widths: [140],
                            heights: [45, 45, 45, 45, 45, 50],
                            body: acciones
                        }
                    },
                    {
                        style: 'tabla',
                        table: {
                            widths: [140],
                            heights: [45, 45, 45, 45, 45, 50],
                            body: efectividad
                        }
                    },
                    {
                        style: 'tabla',
                        table: {
                            widths: [140],
                            heights: [45, 45, 45, 45, 45, 50],
                            body: porque_acciones
                        }
                    }
                ]
            },
            {
                alignment: 'center',
                columns: [
                    {
                        style: 'tabla',
                        table: {
                            widths: [210, 20],
                            body: [
                                [{ rowSpan: 2, text: '¿Se solucionó el problema?', style: 'fuentePregunta' },
                                { text: 'SÍ ' + ((ishikawa.solucionado == 1) ? 'X' : ''), style: 'textoIshikawa' }],
                                [{ text: '', style: 'fuentePregunta' }, { text: 'NO ' + ((ishikawa.solucionado == 0) ? 'X' : ''), style: 'textoIshikawa' }]
                            ]
                        }
                    },
                    {
                        style: 'tabla',
                        table: {
                            widths: [210, 20],
                            body: [
                                [{ rowSpan: 2, text: '¿Ha sido recurrente el problema?', style: 'fuentePregunta' },
                                { text: 'SÍ ' + ((ishikawa.recurrente == 1) ? 'X' : ''), style: 'textoIshikawa' }],
                                [{ text: '', style: 'fuentePregunta' }, { text: 'NO ' + ((ishikawa.recurrente == 0) ? 'X' : ''), style: 'textoIshikawa' }]
                            ]
                        }
                    },
                    {
                        style: 'tabla',
                        table: {
                            widths: [210, 20],
                            body: [
                                [{ rowSpan: 2, text: '¿Es necesario un analisis mas profundo?', style: 'fuentePregunta' },
                                { text: 'SÍ ' + ((ishikawa.analisis == 1) ? 'X' : ''), style: 'textoIshikawa' }],
                                [{ text: '', style: 'fuentePregunta' }, { text: 'NO ' + ((ishikawa.analisis == 0) ? 'X' : ''), style: 'textoIshikawa' }]
                            ]
                        }
                    }
                ]
            },
            {
                alignment: 'center',
                columns: [
                    {
                        style: 'tabla',
                        table: {
                            widths: [240],
                            heights: [10, 10],
                            body: [
                                [{ text: ishikawa.elaborado, style: 'textoIshikawa' }],
                                [{ text: 'Elaboró', style: 'fuenteFirma' }]
                            ]
                        }
                    },
                    {
                        style: 'tabla',
                        table: {
                            widths: [240],
                            heights: [10, 10],
                            body: [
                                [{ text: ishikawa.revisado, style: 'textoIshikawa' }],
                                [{ text: 'Revisó', style: 'fuenteFirma' }]
                            ]
                        }
                    },
                    {
                        style: 'tabla',
                        table: {
                            widths: [240],
                            heights: [10, 10],
                            body: [
                                [{ text: ishikawa.autorizado, style: 'textoIshikawa' }],
                                [{ text: 'Autorizó(Gerente de Área)', style: 'fuenteFirma' }]
                            ]
                        }
                    }
                ]
            }
        ],
        background: {
            alignment: 'center',
            opacity: 0.1,
            fontSize: 100,
            margin: [0, 100],
            image: getImageBackground()
        },
        pageOrientation: 'landscape',
        styles: {
            header: {
                fontSize: 20,
                bold: true,
                alignment: 'center'
            }
            ,
            fuente: {
                fontSize: 16,
                bold: true,
                alignment: 'center'
            },
            tabla: {
                margin: [0, 5, 0, 15]
            },
            fuenteTabla: {
                fontSize: 14,
                bold: true,
                alignment: 'center',
                color: '#000000',
                fillColor: '#F2F2F2'
            },
            fuenteTabla2: {
                fontSize: 12,
                bold: true,
                alignment: 'center',
                color: '#000000',
                fillColor: '#F2F2F2'
            },
            fuentePregunta: {
                fontSize: 10,
                bold: true,
                alignment: 'center',
                color: '#000000'
            },
            fuenteFirma: {
                fontSize: 10,
                bold: true,
                alignment: 'center',
                color: '#000000',
                fillColor: '#F2F2F2'
            },
            textoTabla: {
                fontSize: 12,
                alignment: 'center'
            },
            textoIshikawa: {
                fontSize: 8,
                alignment: 'center'
            }
        }
    }

    return dd;
}
export {
    getDefinitionPdf
}