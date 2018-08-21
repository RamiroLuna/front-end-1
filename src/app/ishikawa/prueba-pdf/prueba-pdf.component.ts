import { Component, OnInit, style } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-prueba-pdf',
  templateUrl: './prueba-pdf.component.html',
  styles: []
})
export class PruebaPdfComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  viewPdf():void{
    var dd = {
      content: [
        {
          text: 'Descripción del Problema',
          style: 'header'          
        },
        '\n\n',
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
                  [{text: '¿Qué situación se presenta?', style: 'fuenteTabla'}],
                  [{text: 'Quemadura en cuello del compañero Edgar Hernandez Angeles', style: 'textoTabla'}],
                  [{text: '¿Dónde se presenta la situación?', style: 'fuenteTabla'}],
                  [{text: 'Filtro fino del extruso ext 1', style: 'textoTabla'}],
                  [{text: '¿Cuándo se presenta?', style: 'fuenteTabla'}],
                  [{text: 'El día 29/07/18 en el tercer turno', style: 'textoTabla'}],
                  [{text: '¿Cómo afecta la situación?', style: 'fuenteTabla'}],
                  [{text: 'Afecta a la integridad del colaborador, asi como el objetivo de cero accidentes', style: 'textoTabla'}]
                ]
              }
            }
            ,
            {             
              style: 'tabla',
                table: {
                  heights: ['*', 200],
                  body: [
                    [{text: 'Define el enunciado del problema', style: 'fuenteTabla'}],
                    [{text: 'El día 29/07/18 el compañero Edgar Hernandez Angeles sufrió una qumadura en cuello al sacar la charola de plasta del filtro fino del EXT 1', style: 'textoTabla'}],                 
                  ]                
                }                          
            }
          ]
        },
        {
          alignment: 'center',
          columns: [
            {

            },
            {
              style: 'tabla',              
              table: {
                widths: [370],                
                body: [
                  [{text: 'Nombre ETAD', style: 'fuenteTabla'}],
                  [{text: 'Los simpson', style: 'textoTabla'}],
                  [{text: 'Grupo', style: 'fuenteTabla'}],
                  [{text: 'C', style: 'textoTabla'}],
                  [{text: 'Área', style: 'fuenteTabla'}],
                  [{text: 'Producción Buhler', style: 'textoTabla'}]
                ]
              }
            }
          ]
        },
        '\n\n',
        /*Página dos diagrama de ishikawa*/
        {
          text: 'Diagrama de Ishikawa',
          style: 'header'
        },
        /*Primer columna de ishikawa*/
        '\n\n',
        {
          alignment: 'center',
          columns: [
            {
              width: 200,
              text: 'Lluvia de ideas',
              style: 'fuente'
            },
            {
              width: 800,
              text: 'Diagrama de Ishikawa',
              style: 'fuente'
            }
          ]
        },
        '\n',
        {
          alignment: 'center',
          columns: [
            {
              width: 200,
              style: 'tabla',
              table: {
                widths: [195],
                heights: ['*', 40, '*', 40, '*', 40, '*', 40, '*', 40, '*', 40],
                body: [
                  [{text: 'Mano de Obra', style: 'fuenteTabla'}],
                  [{text: 'Baja presión del piston del backflush (piston de purga)', style: 'textoIshikawa'}],
                  [{text: 'Maquinaria', style: 'fuenteTabla'}],
                  [{text: 'Guarda el desfogue del aire del piston de purga inadecuada\n Alta temperatura de las resistencias del filtro fino', style: 'textoIshikawa'}],
                  [{text: 'Mediciones', style: 'fuenteTabla'}],
                  [{text: 'Sensor 1PT0430 Dañado', style: 'textoIshikawa'}],
                  [{text: 'Método', style: 'fuenteTabla'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: 'Material', style: 'fuenteTabla'}],
                  [{text: 'Hojuela Sucia', style: 'textoIshikawa'}],
                  [{text: 'Medio Ambiente', style: 'fuenteTabla'}],
                  [{text: '', style: 'textoIshikawa'}]
                ]
              }
            },
            {
              /*width: 800*/
              /*image: 'data: image / jpeg; base64, https://www.google.com.mx/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjAjJnznPDcAhWLZFAKHQthCYIQjRx6BAgBEAU&url=http%3A%2F%2Fwww.blogdaqualidade.com.br%2Fdiagrama-de-ishikawa%2F&psig=AOvVaw2zc40hwHnLSmJZOxqZceC4&ust=1534462632177219',*/
            }
          ]
        },        
        {
          text: 'Test de causa raíz',
          style: 'header'
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
                  [{text: 'Describe la causa raíz', style: 'fuenteTabla'}],
                  [{text: 'La guarda de desfogue de aire del piston del filtro fino no es la adecuada ya que no venia de fabrica, y con ayuda de altas temperaturas del filtro fino expulsa el material fundido degradado', style: 'textoTabla'}]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [270, 40, 40],
                heights: ['*', 50, 50, 50, 50, 50, 50, 50],
                body: [
                  [{text: 'Text de causa raíz', style: 'fuenteTabla'}, {text: 'Sí', style: 'fuenteTabla'}, {text: 'No', style: 'fuenteTabla'}],
                  [{text: '¿El enunciado de la causa raíz idenrifica a algún elemento del proceso?', style: 'textoTabla'}, {text: 'X', style: 'textoTabla'}, {text: '', style: 'textoTabla'}],
                  [{text: '¿Es controlable la causa raíz?', style: 'textoTabla'}, {text: 'X', style: 'textoTabla'}, {text: '', style: 'textoTabla'}],
                  [{text: '¿Se puede preguntar "por qué" otra vez y obtener otra causa raíz controlable?', style: 'textoTabla'}, {text: '', style: 'textoTabla'}, {text: 'X', style: 'textoTabla'}],
                  [{text: '¿La causa raíz identificada es la falla fundamental del proceso?', style: 'textoTabla'}, {text: 'X', style: 'textoTabla'}, {text: '', style: 'textoTabla'}],
                  [{text: 'Si corregimos o mejoramos la causa raíz identificada, ¿Asegurará que el problema identificado no vuelva a ocurrir?', style: 'textoTabla'}, {text: 'X', style: 'textoTabla'}, {text: '', style: 'textoTabla'}],
                  [{text: '¿Hemos identificado la causa raíz del prblema?', style: 'textoTabla'}, {text: 'X', style: 'textoTabla'}, {text: '', style: 'textoTabla'}],
                  [{text: 'Ya checamos que nuestra causa raíz identificada sea aplicable para más de una parte o proceso', style: 'textoTabla'}, {text: 'X', style: 'textoTabla'}, {text: '', style: 'textoTabla'}]
                ]
              }
            }            
          ]
        },
        '\n',
        {
          text: 'Tabla guia APDT y plan de acción',
          style: 'header'
        },
        '\n\n',
        {
          style: 'tabla',          
          table:{
            heights: ['*', 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
            body: [
              [{text: 'Enunciado del Problema', style: 'fuenteTabla2'}, {text: 'Causa Primaria', style: 'fuenteTabla2'}, {text: 'Causa Secundaria', style: 'fuenteTabla2'}, {text: 'Causa terciaria', style: 'fuenteTabla2'}, {text: 'Causa Cuaternaria', style: 'fuenteTabla2'}, {text: 'Causa quinaria', style: 'fuenteTabla2'}, {text: 'Causa sextenaria', style: 'fuenteTabla2'}, {text: 'Causa septenaria', style: 'fuenteTabla2'}, {text: 'Acción Correctiva', style: 'fuenteTabla2'}, {text: 'Responsable', style: 'fuenteTabla2'}, {text: 'Fecha', style: 'fuenteTabla2'}],
              [{rowSpan: 10, text: 'El dia 29/07/18 el compañero Edgar Hernandez Angeles sufrio una quenadura en cuello al sacar la charola de plasta del filtro fino del Ext 1', style: 'textoIshikawa'}, {text: 'Maquinaria', style: 'textoIshikawa'}, {text: 'Alta temperatura de las resistencias del filtro fino', style: 'textoIshikawa'}, {text: 'Por ajuste del proceso', style: 'textoIshikawa'}, {text: 'Por baja viscosidad de la resina', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: 'Bajar  temperaturas del filtro fino', style: 'textoIshikawa'}, {text: 'Aurelio Marcial', style: 'textoIshikawa'}, {text: '31/07/2018', style: 'textoIshikawa'}],
              [{text: '', style: 'textoIshikawa'}, {text: 'Maquinaria', style: 'textoIshikawa'}, {text: 'Guarda de desgogue de aire del piston de purga inadecuado', style: 'textoIshikawa'}, {text: 'Ya que solo se coloco una guarda provicional', style: 'textoIshikawa'}, {text: 'Por que no venia de fabrica', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: 'Fabricar la guarda que lleva igual que en el extrusor 2', style: 'textoIshikawa'}, {text: 'Eduardo Izquierdo', style: 'textoIshikawa'}, {text: '15/08/2018', style: 'textoIshikawa'}],
              [{text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}],
              [{text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}],
              [{text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}],
              [{text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}],
              [{text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}],
              [{text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}],
              [{text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}],
              [{text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}, {text: '', style: 'textoIshikawa'}]
            ]
          }
        },
        '\n\n\n',
        {
          text: 'Verificación y Seguimiento',
          style: 'header'
        },
        '\n\n',
        {
          alignment: 'center',
          columns:[
            {
              text: 'Colocar el enunciado del problema',
              style: 'fuenteTabla2'
            },
            {
              text: 'Describe la causa raíz',
              style: 'fuenteTabla2'
            },
            {
              text: 'Coloca las acciones colectivas',
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
                  [{text: 'El dia 29/07/18 el compañero Edgar Hernandez Angeles sufrio una quenadura en cuello al sacar la charola de plasta del filtro fino del Ext 1', style: 'textoIshikawa'}]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [140],
                heights: [300],
                body: [
                  [{text: 'La guarda de desfogue de aire del piston del filtro fino no es la adecuada ya que no venia de fabrica, y con ayuda de altas temperaturas del filtro fino expulsa el material fundido degradado', style: 'textoIshikawa'}]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [140],
                heights: [45, 45, 45, 45, 45, 50],
                body: [
                  [{text: 'Bajar temperaturas del filtro fino', style: 'textoIshikawa'}],
                  [{text: 'Fabricar la guarda que lleva igual que en el extrusor 2', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [140],
                heights: [45, 45, 45, 45, 45, 50],
                body: [
                  [{text: 'No', style: 'textoIshikawa'}],
                  [{text: 'Sí', style: 'textoIshikawa'}],
                  [{text: 'NO ', style: 'textoIshikawa'}],
                  [{text: 'Sí', style: 'textoIshikawa'}],
                  [{text: 'NO ', style: 'textoIshikawa'}],
                  [{text: 'Sí', style: 'textoIshikawa'}],
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                heights: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 22, 22],
                body: [
                  [{text: 'Con este ajuste  evitamos que expulse el material arriba de 285 grados', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: '', style: 'textoIshikawa'}]
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
                widths: [215, 15],
                body: [
                  [{rowSpan: 2, text: '¿Se solucionó el problema?', style: 'fuentePregunta'}, {text: 'Sí X', style: 'textoIshikawa'}],
                  [{text: '', style: 'fuentePregunta'}, {text: 'No ', style: 'textoIshikawa'}]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [215, 15],
                body: [
                  [{rowSpan: 2, text: '¿Ha sido recurrente el problema?', style: 'fuentePregunta'}, {text: 'Sí ', style: 'textoIshikawa'}],
                  [{text: '', style: 'fuentePregunta'}, {text: 'No ', style: 'textoIshikawa'}]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [215, 15],
                body: [
                  [{rowSpan: 2, text: '¿Es necesario un analisis mas profundo?', style: 'fuentePregunta'}, {text: 'Sí ', style: 'textoIshikawa'}],
                  [{text: '', style: 'fuentePregunta'}, {text: 'No ', style: 'textoIshikawa'}]
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
                heights: [25, 25],
                body: [
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: 'Elaboró', style: 'fuenteFirma'}]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [240],
                heights: [25, 25],
                body: [
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: 'Revisó', style: 'fuenteFirma'}]
                ]
              }
            },
            {
              style: 'tabla',
              table: {
                widths: [240],
                heights: [25, 25],
                body: [
                  [{text: '', style: 'textoIshikawa'}],
                  [{text: 'Autorizó(Gerente de Área)', style: 'fuenteFirma'}]
                ]
              }             
            }
          ]
        }
      ],
      pageOrientation: 'landscape',
      styles:{
        header: {
          fontSize: 20,
          bold: true,
          alignment: 'center'
        }
        ,
        fuente:{
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
    pdfMake.createPdf(dd).open();
  }
}
