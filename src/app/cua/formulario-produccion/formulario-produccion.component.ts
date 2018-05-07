import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Producto } from '../../models/producto';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-formulario-produccion',
  templateUrl: './formulario-produccion.component.html'
})
export class FormularioProduccionComponent implements OnInit {

  public productos: Array<Producto> = [
    {id_producto:1, valor: 'clave', descripcion: 'Poducto ejemplo', activo: 1, id_linea:2, id_tipo_producto:1, valor_linea: 'AMUT2', valor_tipo_producto: 'Materia'},
    {id_producto:2, valor: 'clave2', descripcion: 'Poducto ejemplo 1', activo: 1, id_linea:2, id_tipo_producto:1, valor_linea: 'AMUT2', valor_tipo_producto: 'Materia'},
    {id_producto:3, valor: 'clave3', descripcion: 'Poducto ejemplo 2 ', activo: 1, id_linea:2, id_tipo_producto:1, valor_linea: 'AMUT2', valor_tipo_producto: 'Materia'},
    {id_producto:4, valor: 'clave4', descripcion: 'Poducto ejemplo 3', activo: 1, id_linea:2, id_tipo_producto:1, valor_linea: 'AMUT2', valor_tipo_producto: 'Materia'}
  ];

  constructor(private router: Router,) { }

  ngOnInit() {
    setTimeout(()=>{ this.ngAfterViewInit() },200);
  }

   /* 
   * Carga de plugins para el componente
   */
  ngAfterViewInit(): void {
    $('#dia').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: '',
      clear: 'Limpiar',
      close: 'OK',
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      format: 'dd/mm/yyyy',
      closeOnSelect: false, // Close upon selecting a date,
      onClose:  () =>{
          // this.asignacion.dia = $('#dia').val();
      }
    });

    $('select').material_select();
  }

  modalQuestionFails():void{

     /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f "> ¿ Registrar fallas del turno? </span>',
        type: 'question',
        //html: '<p style="color: #303f9f "> Linea : ' + meta.meta + '<b> </b></p>',
        showCancelButton: true,
        confirmButtonColor: '#303f9f',
        cancelButtonColor: '#9fa8da ',
        cancelButtonText: 'No hubo fallas',
        confirmButtonText: 'Si, registrar',
        allowOutsideClick: false,
        allowEnterKey: false
      }).then((result) => {
        /*
         * Si acepta
         */
        if (result.value) {
          this.router.navigate(['home/cua/opciones/fallas/nuevo']);
          /*
          * Si cancela accion
          */
        } else if (result.dismiss === swal.DismissReason.cancel) {
          this.router.navigate(['home/cua/opciones/produccion']);
        }
      })
   
  }

}
