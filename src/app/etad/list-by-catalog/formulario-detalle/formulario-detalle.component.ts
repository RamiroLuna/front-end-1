import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { isValidId, clone } from '../../../utils';
import { AuthService } from '../../../auth/auth.service';
import { FormularioDetalleService } from './formulario-detalle.service';
import swal from 'sweetalert2';
import { PetCatKpiOperativo } from '../../../models/pet-cat-kpi-operativo';
import { PetCatMetaEstrategica } from '../../../models/pet-cat-meta-estrategica';
import { PetCatObjetivoOperativo } from '../../../models/pet-cat-objetivo-operativo';
import { Catalogo } from '../../../models/catalogo';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-formulario-detalle',
  templateUrl: './formulario-detalle.component.html',
  providers: [FormularioDetalleService]
})
export class FormularioDetalleComponent implements OnInit {

  public nombre_catalogo: string;
  public nombre_tabla: string;
  public loading: boolean;
  public isCatalog: boolean = true;
  public link_back: string;
  public formCatalogs: FormGroup;
  public submitted: boolean;
  public itemCatalogo: any; // Esta variable se le  debe indicar el tipo de dato que será en el switch del ngOnit
  public id: string;
  public seccion: string;
  public texto_btn: string;
  public type_Catalogo: string;
  public mensajeModal: string;
  public etads: Array<Catalogo>;
  public objetivos: Array<PetCatObjetivoOperativo>;
  public id_tipo_catalogo: number;
  public tipos_operaciones:Array<any>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: FormularioDetalleService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.submitted = false;
    this.texto_btn = "Cancelar";
    this.route.paramMap.subscribe(params => {

      if (params.get('id') == 'nuevo') {
        this.seccion = 'add';
      } else if (isValidId(params.get('id'))) {
        this.seccion = 'edit';
      } else {
        this.seccion = 'invalid';
      }


      if (this.seccion != 'invalid') {
        switch (params.get('name')) {
          case 'metas-estrategicas':
            this.nombre_catalogo = 'Metas estratégicas';
            this.nombre_tabla = 'pet_cat_meta_estrategica';
            this.type_Catalogo = 'metas-estrategicas';
            this.itemCatalogo = new PetCatMetaEstrategica();
            this.id_tipo_catalogo = 1;
            break;
          case 'objetivos-operativos':
            this.nombre_catalogo = 'Objetivos Operativos';
            this.nombre_tabla = 'pet_cat_objetivo_operativo';
            this.type_Catalogo = 'objetivos-operativos';
            this.itemCatalogo = new PetCatObjetivoOperativo();
            this.id_tipo_catalogo = 2;
            break;
          case 'kpis-operativos':
            this.nombre_catalogo = 'KPI Operativos';
            this.nombre_tabla = 'pet_cat_kpi_operativo';
            this.type_Catalogo = 'kpis-operativos';
            this.itemCatalogo = new PetCatKpiOperativo();
            this.id_tipo_catalogo = 3;
            break;
          default:
            this.isCatalog = false;
        }

        if (this.seccion == 'edit') {
          this.loadData(this.type_Catalogo, parseInt(params.get('id')));
        } else if (this.seccion == 'add') {
          if (this.id_tipo_catalogo == 3) {
            this.itemCatalogo.id_frecuencia = 1;
          }
          this.loadData();
        } else {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
      this.link_back = params.get('name');
    });

    this.loadFormulario(this.type_Catalogo);

  }

  ngAfterViewInit() {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  /*
   * Selecciona el formControl que se debe cargar
   */
  loadFormulario(typeCatalogo: string) {
    switch (typeCatalogo) {
      case 'metas-estrategicas':
        this.formCatalogs = this.fb.group({
          valor: new FormControl(this.itemCatalogo.valor, [Validators.required]),
          descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required]),
          unidad_medida: new FormControl(this.itemCatalogo.unidad_medida, [Validators.required])
        });
        break;
      case 'objetivos-operativos':
        this.formCatalogs = this.fb.group({
          valor: new FormControl(this.itemCatalogo.valor, [Validators.required]),
          descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required])
        });
        break;
      case 'kpis-operativos':
        this.formCatalogs = this.fb.group({
          valor: new FormControl(this.itemCatalogo.valor, [Validators.required]),
          descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required]),
          unidad_medida: new FormControl(this.itemCatalogo.unidad_medida, [Validators.required]),
          objetivo: new FormControl(this.itemCatalogo.id_cat_objetivo_operativo, [Validators.required]),
          lineas: new FormControl(this.itemCatalogo.lineas, [Validators.required]),
          tipo_operacion: new FormControl(this.itemCatalogo.tipo_operacion, [Validators.required])
        });
        break;
    }
  }

  loadData(typeCatalogo: string = "", id: number = -1) {
    switch (typeCatalogo) {
      case 'metas-estrategicas':
      case 'objetivos-operativos':
      case 'kpis-operativos':
        /*
         * Consulta el elemento del catalogo
         */
        this.service.getCatalogoById(this.auth.getIdUsuario(), this.id_tipo_catalogo, id).subscribe(result => {

          if (result.response.sucessfull) {
            switch (this.id_tipo_catalogo) {
              case 1:
                this.itemCatalogo = result.data.metaEstrategica || new PetCatMetaEstrategica();
                break;
              case 2:
                this.itemCatalogo = result.data.objetivoOperativo || new PetCatObjetivoOperativo();
                break;
              case 3:
              
                this.etads = result.data.listEtads || [];
                this.objetivos = result.data.listObjetivoOperativos || [];
                this.itemCatalogo = result.data.kpiOperativo || new PetCatKpiOperativo();
                this.tipos_operaciones = [
                  {id: 1 , valor: 'SUMA'},
                  {id: 2 , valor: 'PROMEDIO'},
                  {id: 3 , valor: 'DIRECTO'}
                ];
                break;
            }

            this.loading = false;
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
            this.loading = false;
          }
        }, error => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
          this.loading = false;
        });
        break;
      default:
        /*
        * En caso de agregar elemento , consultar catalogos requeridos
        * por el formulario
        */
        this.service.init(this.auth.getIdUsuario()).subscribe(result => {

          if (result.response.sucessfull) {
            if (this.id_tipo_catalogo == 3) {
              this.etads = result.data.listEtads || [];
              this.objetivos = result.data.listObjetivoOperativos || [];
              this.itemCatalogo.tipo_kpi =1 ;
            }
            this.loading = false;
          } else {
            Materialize.toast(result.response.message, 4000, 'red');
            this.loading = false;
          }
        }, error => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
          this.loading = false;
        });

    }

  }

  changeFrecuencia(item: any, radio: string): void {
    if (radio == 'radio-turno') {
      item.id_frecuencia = 1;
    } else if (radio == 'radio-mensual') {
      item.id_frecuencia = 2;
    }
  }

  changeTipo(item: any, valor: number): void {
    // 0 menos es mejor
    // 1 mas es mejor
    item.tipo_kpi = valor;
  }


  openModalConfirmacion(item: any, accion: string, type: string): void {
    this.submitted = true;
    this.mensajeModal = '';

    if (this.formCatalogs.valid) {

      switch (accion) {
        case 'add':
          this.mensajeModal = '¿Está seguro de agregar ? ';
          break;
        case 'edit':
          this.mensajeModal = '¿ Está seguro de actualizar la información ? ';
          break;
      }
      /* 
       * Configuración del modal de confirmación
       */
      swal({
        title: '<span style="color: #303f9f ">' + this.mensajeModal + '</span>',
        type: 'question',
        html: '<p style="color: #303f9f "> Elemento : <b>' + (item.valor || item.nombre_equipo) + ' </b></p>',
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
          /*
           * Determina el tipo de catalogo que es y ejecuta la accion
           */
          switch (type) {

            case 'metas-estrategicas':
            case 'objetivos-operativos':
            case 'kpis-operativos':
              /* 
               * Se forma el modelo a enviar al backend
               * contenedor.meta Es una variable que se necesita por el backend
               */
              let contenedor: any = { record: {} };
              contenedor.record = this.itemCatalogo;

              if (this.seccion == 'add') {
                this.service.insertCatalogo(this.auth.getIdUsuario(), this.id_tipo_catalogo, contenedor).subscribe(result => {
               
                  if (result.response.sucessfull) {
                    Materialize.toast('Se agregó correctamente', 4000, 'green');
                    this.router.navigate(['home/etad/opciones/catalogos', this.link_back]);
                  } else {
                    Materialize.toast(result.response.message, 4000, 'red');
                  }
                }, eror => {
                  Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
                });
              } else if (this.seccion == 'edit') {
                this.service.updateCatalogo(this.auth.getIdUsuario(), this.id_tipo_catalogo, contenedor).subscribe(
                  result => {
                  
                    if (result.response.sucessfull) {
                      Materialize.toast('Actualización completa', 4000, 'green');
                      this.texto_btn = 'Cerrar ficha';
                    } else {
                      Materialize.toast(result.response.message, 4000, 'red');
                    }
                  }, error => {
                    Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
                  });
              }
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

  aplicaEnEtad(itemCatalogo: PetCatKpiOperativo, idEtad: number): boolean {
    let arg = [];

    if (itemCatalogo.lineas.trim() != "") {
      arg = itemCatalogo.lineas.split(",").map((el) => parseInt(el));
      return arg.includes(idEtad);
    } else {
      return false;
    }

  }

  clicKEtad(idEtad: number, event: any, itemCatalogo: PetCatKpiOperativo): void {
    let arg = [];
    if (itemCatalogo.lineas.trim() != "") {
      arg = itemCatalogo.lineas.split(",").map((el) => parseInt(el));
    }

    if (event.target.checked) {
      arg.push(idEtad);
      itemCatalogo.lineas = arg.toString();
    } else {

      let posicion = arg.indexOf(idEtad);
      if (posicion != -1) {
        arg.splice(posicion, 1);
      }
      itemCatalogo.lineas = arg.toString();
    }





  }

}
