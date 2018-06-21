import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MetaMasivaService } from './meta-masiva.service';
import { getAnioActual } from '../../utils';
import { AuthService } from '../../auth/auth.service';
import { Linea } from '../../models/linea';
import { Periodo } from '../../models/periodo';
import { Forecast } from '../../models/forecast';
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
  public lineas: Array<Linea> = [];
  public anios: Array<any> = [];
  public meses: Array<any> = [];
  public metas: Array<Forecast> = [];

  public formCargaMasiva: FormGroup;
  public anioSeleccionado: number;
  public idLinea: number;
  public idPeriodo: number;
  public archivoCsv: any;
  public bVistaPre: boolean;
  public loading: boolean;
  public submitted: boolean;
  public disabled: boolean;
  public textoBtn: string;
  public status: string;
  public height: number;



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

    this.service.getInitCatalogos(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {
        this.lineas = result.data.listLineas || [];
        this.lineas = this.lineas.filter(el => el.id_linea != 6);
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
      idLinea: new FormControl({ value: this.idLinea }, [Validators.required]),
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

  changeCombo(): void {
    this.bVistaPre = false;
    this.status = "inactive";
  }

  uploadMetasCSV(): void {

    this.submitted = true;
    this.status = "inactive";

    if (this.formCargaMasiva.valid) {
      this.disabled = true;
      this.textoBtn = "CARGANDO ...";
      this.bVistaPre = false;
      this.height = $( document  ).height();
      this.service.uploadMetasCSV(this.auth.getIdUsuario(), this.archivoCsv, this.idPeriodo, this.idLinea).subscribe(result => {
        if (result.response.sucessfull) {
          this.metas = result.data.listMetas || [];
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

    this.service.procesarFile(this.auth.getIdUsuario(), this.idPeriodo, this.idLinea).subscribe(result => {
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
          this.alertConfirmaReemplazo(this.auth.getIdUsuario(), this.idPeriodo, this.idLinea );
        }else{
          Materialize.toast(result.response.message, 4000, 'red');
        }

      }

    }, error => {

      Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
    });
  }

  alertConfirmaReemplazo(idUsuario: number, idPeriodo: number, idLinea: number): void {
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
        this.service.reWriteFile(this.auth.getIdUsuario(), idPeriodo, idLinea).subscribe(result => {       
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

}
