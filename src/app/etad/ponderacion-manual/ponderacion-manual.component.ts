import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PonderacionManualService } from './ponderacion-manual.service';
import { AuthService } from '../../auth/auth.service';
import { Catalogo } from '../../models/catalogo';
import { Linea } from '../../models/linea';
import { PetCatKpiOperativo } from '../../models/pet-cat-kpi-operativo';
import { PetCatObjetivoOperativo } from '../../models/pet-cat-objetivo-operativo';
import { PetCatMetaEstrategica } from '../../models/pet-cat-meta-estrategica';
import { PetPonderacionObjetivoOperativo } from '../../models/pet-ponderacion-objetivo-operativo';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { clone, deleteItemArray } from '../../utils';
import swal from 'sweetalert2';
import { Periodo } from '../../models/periodo';
import { ActivatedRoute, Router } from '@angular/router';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-ponderacion-manual',
  templateUrl: './ponderacion-manual.component.html',
  providers: [PonderacionManualService]
})
export class PonderacionManualComponent implements OnInit {

  /*
  * Listas requeridas para el formulario de metas
  */

  public etads: Array<Linea>;
  public anios: Array<any> = [];
  public catalogo_objetivos: Array<PetCatObjetivoOperativo>;
  public ponderacion_total: number;
  public row_pond_objetivos: Array<PetPonderacionObjetivoOperativo> = [];

  // tipo_meta_manual almacena que formulario se va a mostrar, recibe parametro por url
  public tipo_meta_manual: string;

  public loading: boolean;
  public formCargaManual: FormGroup;
  public submitted: boolean;
  public mensajeModal: string;
  public disabledBtn: boolean;

  //params contiene los datos de busqueda
  public params: any;


  constructor(private service: PonderacionManualService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.submitted = false;
    this.params = {};
    this.ponderacion_total = 0;
    this.disabledBtn = true;

    this.route.paramMap.subscribe(params => {
      this.tipo_meta_manual = params.get('tipo');

      /*
   * Consulta el elemento del catalogo
   */
      this.service.getCatalogos(this.auth.getIdUsuario()).subscribe(result => {
       
        if (result.response.sucessfull) {
          this.etads = result.data.listLineas || [];
          this.anios = result.data.listYears || [];
          this.catalogo_objetivos = result.data.listObjetivosOperativos || [];

          this.catalogo_objetivos.map(el => {
            let item = new PetPonderacionObjetivoOperativo();
            item.valor = el.valor;
            item.id_objetivo_operativo = el.id;
            item.ponderacion = 0;
            item.anio = -1;

            this.row_pond_objetivos.push(item);
          });
          this.loading = false;
          this.loadFormulario(this.tipo_meta_manual);
          setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
          this.loading = false;
        }
      }, error => {
        this.loading = false;
        Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
      });
      /*
       * Fin carga de catalogos necesarios para el formulario
       */


    });

  }

  loadFormulario(tipo_meta_manual: string): void {
    if (tipo_meta_manual == 'objetivo-operativo') {
      this.formCargaManual = this.fb.group({
        anio: new FormControl({ value: this.params.anio }, [Validators.required])
      });
    }
  }

  ngAfterViewInitHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  somethingChanged(ponderacion: any): void {
    this.ponderacion_total = 0;
    let valores_ponderacion = this.row_pond_objetivos.map(el => parseInt("" + el.ponderacion));

    this.ponderacion_total = valores_ponderacion.reduce((valor_anterior, valor_actual) => {

      if (Number.isNaN(valor_anterior) || typeof valor_anterior == undefined) valor_anterior = 0;
      if (Number.isNaN(valor_actual) || typeof valor_actual == undefined) valor_actual = 0;
      return valor_anterior + valor_actual;
    });

    this.disabledBtn = !(this.ponderacion_total == 100);
  }

  onlyNumber(event: any): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
  }

  openModalConfirmacion(accion: string, tipo_ponderacion: string): void {
  
    this.submitted = true;
    this.mensajeModal = '';

    if (this.formCargaManual.valid) {

      switch (tipo_ponderacion) {
        case 'objetivos_operativos':
          this.mensajeModal = '¿ Está seguro de agregar ponderación a los objetivos operativos ? ';
          break;
      }
      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f ">Ponderación para el año:<b>' + this.params.anio + '</b> ' +
          '</p>',
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

          switch (tipo_ponderacion) {
            case 'objetivos_operativos':
            this.row_pond_objetivos.map(el => {
              if(Number.isNaN(parseInt(""+el.ponderacion))|| el.ponderacion == undefined){
                el.ponderacion = 0;
              }
            });
              /* 
                * Se forma el modelo a enviar al backend
                * contenedor.ponderaciones Es una variable que se necesita por el backend
                */
              let contenedor: any = { ponderaciones: {} };
              contenedor.ponderaciones = this.row_pond_objetivos;
              this.service.insertPonderacion(this.auth.getIdUsuario(), 1, contenedor).subscribe(result => {
                if (result.response.sucessfull) {
                  Materialize.toast('Se agregarón ponderaciones correctamente', 4000, 'green');

                  this.row_pond_objetivos = [];

                  this.catalogo_objetivos.map(el => {
                    let item = new PetPonderacionObjetivoOperativo();
                    item.valor = el.valor;
                    item.id_objetivo_operativo = el.id;
                    item.ponderacion = 0;
                    item.anio = -1;
                    this.row_pond_objetivos.push(item);
                  });

                   
                  deleteItemArray(this.anios, parseInt(this.params.anio), 'result');

     

                  this.formCargaManual.controls.anio.reset();

                  this.ponderacion_total = 0;
                  this.disabledBtn = true;

                  

                } else {
                  Materialize.toast(result.response.message, 4000, 'red');
                }
              }, eror => {
                Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
              });
              break;
          }

          /*
          * Si cancela accion
          */
        } else if (result.dismiss === swal.DismissReason.cancel) {
        }
      })

    } else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }

  }



  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  changeCombo(tipoCombo: string): void {
    this.row_pond_objetivos.map(el => {
      el.anio = this.params.anio
    });

  }




}
