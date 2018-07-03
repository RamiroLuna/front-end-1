import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PonderacionMasivaService } from './ponderacion-masiva.service';
import { getAnioActual, getMetasKPI } from '../../utils';
import { AuthService } from '../../auth/auth.service';
import { Linea } from '../../models/linea';
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
  selector: 'app-ponderacion-masiva',
  templateUrl: './ponderacion-masiva.component.html',
  providers: [PonderacionMasivaService],
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
export class PonderacionMasivaComponent implements OnInit {

  public periodos: Array<Periodo> = [];
  public lineas: Array<Linea> = [];
  public anios: Array<any> = [];


  public tiposMeta: Array<any> = [];


  public rowsHeader: Array<any> = [];
  public rows: Array<any> = [];



  public formCargaMasiva: FormGroup;
  public anioSeleccionado: any;
  public idEtad: number;
  public tipoMeta: any;
  public archivoCsv: any;
  public bVistaPre: boolean;
  public loading: boolean;
  public submitted: boolean;
  public disabled: boolean;
  public textoBtn: string;
  public status: string;
  public height: number;


  constructor(private service: PonderacionMasivaService,
    private fb: FormBuilder,
    private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;

    this.tiposMeta = getMetasKPI();




    this.bVistaPre = false;
    this.submitted = false;
    this.disabled = false;
    this.tipoMeta = '';

    this.status = "inactive";
    this.textoBtn = " VISTA PREVIA ";

    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {
      console.log('init ponderaciones ', result)
      if (result.response.sucessfull) {
        this.lineas = result.data.listEtads || [];
        this.lineas = this.lineas.filter(el => el.id_linea != 6);
        this.periodos = result.data.listPeriodos || [];

        let tmpAnios = this.periodos.map(el => el.anio);
        this.anios = this.periodos.filter((el, index) => {
          return tmpAnios.indexOf(el.anio) === index;
        });

       
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
      tipoMeta: new FormControl({ value: this.tipoMeta }, [Validators.required]),
      idEtad: new FormControl({ value: this.idEtad, disabled: true }, [Validators.required]),
      anioSeleccionado: new FormControl({ value: this.anioSeleccionado }, [Validators.required]),
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
    this.bVistaPre = false;
  }

  changeCombo(tipoCombo: string): void {
    this.bVistaPre = false;
    this.status = "inactive";

    if (tipoCombo == 'tipoMeta') {

      let el = this.tiposMeta.filter((el) => el.id == this.tipoMeta);
      this.anioSeleccionado = '';

    } 

  }

  uploadMetasCSV(): void {

    this.submitted = true;
    this.status = "inactive";

    if (this.formCargaMasiva.valid) {
      this.disabled = true;
      this.textoBtn = "CARGANDO ...";
      this.bVistaPre = false;
      this.rowsHeader = [];

      this.service.preview(
        this.auth.getIdUsuario(), this.archivoCsv,
        this.idEtad, this.tipoMeta, this.anioSeleccionado).subscribe(result => {
          console.log('result preview', result)
          if (result.response.sucessfull) {
            this.rows = result.data.listData || [];
            this.rowsHeader.push({objetivo: ' Objetivo ', ponderacion:' Ponderación '});
            this.textoBtn = " VISTA PREVIA ";
            this.height = $(document).height();
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

    this.service.loadData(this.auth.getIdUsuario(), this.idEtad, this.anioSeleccionado, this.tipoMeta).subscribe(result => {
      if (result.response.sucessfull) {
        Materialize.toast('Metas cargadas correctamente', 4000, 'green');
        this.bVistaPre = true;
        this.status = "inactive";
        $('.file-path').val('')
        this.formCargaMasiva.reset();
        this.submitted = false;
        $(document).height(this.height + 'px');

      } else {
        // "999" indica que ya hay metas cargadas para el preiodo seleccionado
        if (result.response.message == "999") {
          this.alertConfirmaReemplazo(this.auth.getIdUsuario(), this.idEtad);
        } else {
          Materialize.toast(result.response.message, 4000, 'red');
        }

      }

    }, error => {

      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
    });
  }

  alertConfirmaReemplazo(idUsuario: number, idEtad: number): void {
    /* 
     * Configuración del modal de confirmación
     */
    swal({
      title: '<span style="color: #303f9f ">Ya existen metas cargadas. ¿Desea reemplazarlas?</span>',
      type: 'question',
      html: '<p style="color: #303f9f ">Año: ' + this.anioSeleccionado + '</b></p>',
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
        this.service.reWriteFile(this.auth.getIdUsuario(), this.anioSeleccionado ,idEtad).subscribe(result => {
          if (result.response.sucessfull) {
            Materialize.toast('Se modificarón las ponderaciones correctamente', 4000, 'green');
            this.bVistaPre = true;
            this.status = "inactive";
            this.formCargaMasiva.reset();
            $('.file-path').val('');
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




  downloadTemplate(): void {
    this.service.downloadTempleate(this.auth.getIdUsuario(), this.tipoMeta).subscribe(result => {

      if (result.response.sucessfull) {

        let linkFile = document.createElement('a');
        let data_type = 'data:text/csv;base64,';
        let file_base64 = result.response.message;

        linkFile.href = data_type + file_base64;
        linkFile.download = 'template.csv';

        linkFile.click();
        linkFile.remove();

      } else {
        Materialize.toast(result.response.message, 4000, 'red');
      }
    }, eror => {
      Materialize.toast('Ocurrió un error en el servicio!', 4000, 'red');
    });

  }


}
