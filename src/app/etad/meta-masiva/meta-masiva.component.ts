import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MetaMasivaService } from './meta-masiva.service';
import { getAnioActual, getMetasKPI , getFrecuenciaMetaKPI, isNumeroAsignacionValid } from '../../utils';
import { AuthService } from '../../auth/auth.service';
import { Catalogo } from '../../models/catalogo';
import { Periodo } from '../../models/periodo';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import swal from 'sweetalert2';


declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-meta-masiva',
  templateUrl: './meta-masiva.component.html',
  styleUrls: ['./meta-masiva.component.css'],
  providers: [MetaMasivaService],
  animations: [
    trigger('visibility', [
      state('inactive', style({
        opacity: 0
      })),
      state('active', style({
        opacity: 1
      })),
      transition('inactive => active', animate('1s ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ])
  ]
})
export class MetaMasivaComponent implements OnInit {

  public periodos: Array<Periodo> = [];
  public etads: Array<Catalogo> = [];
  public anios: Array<any> = [];
  public meses: Array<any> = [];
  public metas: Array<any> = [];

  public formCargaMasiva: FormGroup;
  public anioSeleccionado: number;
  public idEtad: number;
  public idPeriodo: number;
  public archivoCsv: any;
  public bVistaPre: boolean;
  public loading: boolean;
  public submitted: boolean;
  public disabled: boolean;
  public textoBtn: string;
  public status: string;
  public height: number;

  public disabledBtnTemplate:boolean;



  constructor(private service: MetaMasivaService,
    private fb: FormBuilder,
    private auth: AuthService) { }

  ngOnInit() {
    this.anioSeleccionado = -1;
    this.bVistaPre = false;
    this.submitted = false;
    this.loading = true;
    this.disabled = false;
    this.status = "inactive";
    this.textoBtn = " VISTA PREVIA ";
    this.disabledBtnTemplate = true;

    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {
      console.log('get init load catalogos', result)
      if (result.response.sucessfull) {
        this.etads = result.data.listEtad || [];
        this.periodos = result.data.listPeriodos || [];

        let tmpAnios = this.periodos.map(el => el.anio);
        this.anios = this.periodos.filter((el, index) => {
          return tmpAnios.indexOf(el.anio) === index;
        });

        this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);

        this.loading = false;
        this.loadFormulario();
        setTimeout(() => { this.ngAfterViewInitHttp() }, 200)
      } else {
        Materialize.toast(result.response.message, 4000, 'red');
        this.loading = false;
      }
    }, error => {
      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      this.loading = false;
    });

  }

  /* 
   * Carga de plugins para el componente
   */
  ngAfterViewInitHttp(): void {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  regresar() {
    $('.tooltipped').tooltip('hide');
  }

  loadFormulario(): void {
    this.formCargaMasiva = this.fb.group({
      idEtad: new FormControl({ value: this.idEtad }, [Validators.required]),
      anioSeleccionado: new FormControl({ value: this.anioSeleccionado }, [Validators.required]),
      idPeriodo: new FormControl({ value: this.idPeriodo }, [Validators.required]),
      archivoCsv: new FormControl({ value: this.archivoCsv }, [Validators.required])
    });
  }

  seleccionaArchivo(evt): void {
    this.bVistaPre = false;
    this.status = "inactive";
    //Si existe archivo cargado
    if (evt.target.files.length > 0) {
      let file = evt.target.files[0]; // FileList object

      let reader = new FileReader();

      reader.readAsDataURL(file);

      //Se leyó correctamente el file
      reader.onload = () => {
        this.archivoCsv = reader.result.split(',')[1];
      }

      //Ocurrio un error al leer file
      reader.onerror = (error) => {
        this.archivoCsv = "";
      };
    } else {
      this.archivoCsv = "";
    }
  }

  changeAnio(): void {
    this.meses = this.periodos.filter(el => el.anio == this.anioSeleccionado);
    this.bVistaPre = false;
  }

  changeCombo(tipo_combo:string): void {
    this.bVistaPre = false;
    this.status = "inactive";

    if(tipo_combo == 'etad'){
      this.disabledBtnTemplate =  !isNumeroAsignacionValid(this.idEtad);
    }
  }

  uploadMetasCSV(): void {

    this.submitted = true;
    this.status = "inactive";

    if (this.formCargaMasiva.valid) {
      this.disabled = true;
      this.textoBtn = "CARGANDO ...";
      this.bVistaPre = false;
      this.height = $( document  ).height();
      this.service.preview(this.auth.getIdUsuario(), this.archivoCsv, this.idPeriodo, this.idEtad).subscribe(result => {
        console.log('??????->', result)
        if (result.response.sucessfull) {
          this.metas = result.data.listData || [];
          this.textoBtn = " VISTA PREVIA ";
      
          this.bVistaPre = true;
          setTimeout(() => { 
            this.status = 'active';             
          }, 20)

        } else {
          this.textoBtn = " VISTA PREVIA ";
          Materialize.toast(result.response.message, 4000, 'red');
        }
        this.disabled = false;
      }, error => {
        this.textoBtn = " VISTA PREVIA ";
        this.disabled = false;
        Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
      });

    } else {
      Materialize.toast('Verifique los datos capturados!', 4000, 'red');
    }

  }

  procesarFile(): void {

    this.service.loadData(this.auth.getIdUsuario(), this.idPeriodo, this.idEtad).subscribe(result => {
      if (result.response.sucessfull) {
        Materialize.toast('Metas cargadas correctamente', 4000, 'green');
        this.bVistaPre = true;
        this.status = "inactive";
        $('.file-path').val('')
        this.formCargaMasiva.reset();
        this.submitted = false;
        $(document).height(this.height+'px');

      } else {
        // "999" indica que ya hay metas cargadas para el preiodo seleccionado
        if(result.response.message == "999"){
          this.alertConfirmaReemplazo(this.auth.getIdUsuario(), this.idPeriodo, this.idEtad );
        }else{
          Materialize.toast(result.response.message, 4000, 'red');
        }

      }

    }, error => {

      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
    });
  }

  alertConfirmaReemplazo(idUsuario: number, idPeriodo: number, idEtad: number): void {
    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">Ya existen metas cargadas. ¿Desea reemplazarlas?</span>',
      type: 'question',
      html: '<p style="color: #303f9f ">Periodo: ' + this.getPeriodo(this.periodos, idPeriodo) + '</b></p>',
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
        this.service.rewriteData(this.auth.getIdUsuario(), idPeriodo, idEtad).subscribe(result => {       
          if (result.response.sucessfull) {
            Materialize.toast('Se modificarón las metas correctamente', 4000, 'green');
            this.bVistaPre = true;
            this.status = "inactive";
            $('.file-path').val('')
            this.formCargaMasiva.reset();
            this.submitted = false;

          } else {
            Materialize.toast(result.response.message, 4000, 'red');
          }
        }, eror => {
          Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
        });

        /*
        * Si cancela accion
        */
      } else if (result.dismiss === swal.DismissReason.cancel) {
      }
    })

  }


  getPeriodo(periodos: Array<Periodo>, id_periodo: number): string {
    let el = periodos.filter(el => el.id_periodo == id_periodo);

    if (el.length > 0) {
      return " " + el[0].descripcion_mes + " " + el[0].anio;
    } else {
      return "Linea no identificada"
    }
  }
  downloadTemplate(): void {

    this.service.downloadTempleate(this.auth.getIdUsuario(), this.idEtad).subscribe(result => {

      if (result.response.sucessfull) {

        let linkFile = document.createElement('a');
        let data_type = 'data:text/csv;base64,';
        let file_base64 = result.response.message;
        let nameFile = this.getDescriptivoArea(this.idEtad).replace(/ /g,'_');

        if (linkFile.download != undefined) {

          document.body.appendChild(linkFile);

          linkFile.href = data_type + file_base64;
          
          linkFile.download = nameFile+'_metas_kpi.csv';

          linkFile.click();
          linkFile.remove();

        } else {
          let byteCharacters = atob(file_base64);
          let blobObject = new Blob(["\ufeff", byteCharacters], { type: 'application/vnd.ms-excel' });
          window.navigator.msSaveBlob(blobObject, 'template.xls');
        }

      } else {
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, eror => {
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });

  }

  
  getDescriptivoArea(idAreaEtad:number):string{
    let el = this.etads.filter(el=>el.id == idAreaEtad);
    if(el.length > 0){
      return el[0].valor;
    }else{
      return "No identificada";
    }
  }
  

}

