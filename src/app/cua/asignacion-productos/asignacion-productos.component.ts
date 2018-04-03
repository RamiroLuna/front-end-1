import { Component, OnInit, Input, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { MetaAsignacion } from '../../models/meta-asignacion';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProductoAsignacion } from '../../models/producto-asignacion';
import { isNumeroAsignacionValid } from '../../utils';


declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-asignacion-productos',
  templateUrl: './asignacion-productos.component.html'
})
export class AsignacionProductosComponent implements OnInit {

  /*
   * Bloque de variables que se requieren
   */
  @Input() asignacion_seleccionada: MetaAsignacion;
  /*
   *Fin de variables recibidas por el componente padre
   */

  /*
   * Bloque de variables que se enviarán al padre
   */
  @Output() cancelar = new EventEmitter();
  /*
   * Fin de bloque
   */

  public formAsignaProducto: FormGroup;
  public mensajeModal: string;
  public seccion: string;

  public productos: Array<any> = [
    { producto: 'FEA1', valor: '', liberado: 0 },
    { producto: 'SORTEX', valor: '', liberado: 0 },
    { producto: 'POLVOS', valor: '', liberado: 0 }
  ]

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const asignacion_seleccionada: SimpleChange = changes.asignacion_seleccionada;
    this.loadFormulario();
  }

  regresarLista(event): void {
    this.cancelar.emit();
  }

  loadFormulario(): void {
    this.formAsignaProducto = this.fb.group({
      dia: new FormControl({ value: this.asignacion_seleccionada.dia, disabled: true }, [Validators.required]),
      id_linea: new FormControl({ value: this.asignacion_seleccionada.linea, disabled: true }, [Validators.required]),
      linea: new FormControl({ value: this.asignacion_seleccionada.linea, disabled: true }, [Validators.required]),
      id_grupo: new FormControl({ value: this.asignacion_seleccionada.id_grupo, disabled: true }, [Validators.required]),
      grupo: new FormControl({ value: this.asignacion_seleccionada.grupo, disabled: true }, [Validators.required]),
      id_turno: new FormControl({ value: this.asignacion_seleccionada.id_turno, disabled: true }, [Validators.required]),
      turno: new FormControl({ value: this.asignacion_seleccionada.turno, disabled: true }, [Validators.required])

    });
  }

  isValidAsignacion(clase: string): boolean {
    let bandera: boolean = true;
    this.productos.forEach(el => {
      if (!isNumeroAsignacionValid(el.valor)) {
        bandera = false;
        false;
      }
    });
    return bandera;
  }

  openModalConfirmacion(accion: string, type: string): void {

    this.mensajeModal = '';

    if (this.isValidAsignacion('asignacion_productos')) {

      switch (accion) {
        case 'liberar':
          this.mensajeModal = '¿ Está seguro de liberar los productos ? ';
          break;
        case 'asignar':
          this.mensajeModal = '¿ Está seguro de asignar valores a los productos ? ';
          break;
      }
      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        //html: '<p style="color: #303f9f "> Linea : ' + meta.meta + '<b> </b></p>',
        showCancelButton: true,
        confirmButtonColor: '#303f9f',
        cancelButtonColor: '#9fa8da ',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si!',
        allowOutsideClick: false,
        allowEnterKey: false
      }).then((result) => {
        /*
         * Si acepta
         */
        if (result.value) {

          if (this.seccion == 'liberar') {

          } else if (this.seccion == 'asignar') {

          }

          /*
          * Si cancela accion
          */
        } else if (result.dismiss === swal.DismissReason.cancel) {
        }
      })

    } else {
      Materialize.toast('Todas las asignaciones deben ser números y obligatorias', 4000, 'red');
    }

  }

}
