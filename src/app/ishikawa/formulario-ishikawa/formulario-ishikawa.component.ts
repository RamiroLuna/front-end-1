import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, } from '@angular/core';
import { Catalogo } from '../../models/catalogo';
import { PetIshikawa } from '../../models/pet-ishikawa';
import { PetIdeas } from '../../models/pet-ideas';
import { PetPorques } from '../../models/pet-porques';
import { PetConsenso } from '../../models/pet-consenso';
import { materialize } from 'rxjs/operators';
import { isValidText } from '../../utils';
import { PetPlanAccion } from '../../models/pet-plan-accion';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-formulario-ishikawa',
  templateUrl: './formulario-ishikawa.component.html',
  styleUrls: ['./formulario-ishikawa.component.css']
})
export class FormularioIshikawaComponent implements OnInit, OnChanges {


  @Input() emes: Array<Catalogo>;
  @Input() preguntas: Array<Catalogo>;
  @Input() etads: Array<Catalogo>;
  @Input() grupos: Array<Catalogo>;
  @Input() fecha: string;
  @Input() action: string;
  @Input() bloquear: boolean;
  @Input() ishikawa: PetIshikawa;


  @Output() enviaModelo = new EventEmitter();
  @Output() verificarModelo = new EventEmitter();
  @Output() agregarOtro = new EventEmitter();
  @Output() revisaIshikawa = new EventEmitter();



  public tmp_idea: PetIdeas;
  public aux_texto_idea: string;
  public aux_index: number;
  public $modal: any;
  public $modal_ishikawa: any;
  public $tbody: any;
  public configPlugin: any;
  public acciones: Array<PetPlanAccion>;
  public image_src: string;
  public showSteepEight: boolean;


  constructor() { }

  ngOnInit() {



    if (this.action == 'registro') {
      this.ishikawa.fecha_string = this.fecha;
    } else if (this.action == 'consult') {
      this.acciones = this.getAcciones();
    }


    this.configPlugin = {
      linearStepsNavigation: false, //allow navigation by clicking on the next and previous steps on linear steppers
      autoFocusInput: true, //since 2.1.1, stepper can auto focus on first input of each step
      autoFormCreation: false, //control the auto generation of a form around the stepper (in case you want to disable it)
      showFeedbackLoader: true //set if a loading screen will appear while feedbacks functions are running
    };

    this.showSteepEight = false;
    this.tmp_idea = new PetIdeas();
    this.aux_texto_idea = "";
    this.aux_index = -1;
    this.image_src = '../../../assets/diagrama_ishikawa.png';

    setTimeout(() => {

      $('.stepper').activateStepper(this.configPlugin);

      if (this.ishikawa.estatus == 1 || this.ishikawa.estatus == 0) {
        $('.seguimiento_paso_9').prop("disabled", true);
        
      }


      $('.seguimiento_paso_9').on('click', () => {
        this.showSteepEight = this.isValidStepOcho();
      });

      this.$modal = $('#modalCaptura').modal({
        opacity: 0.6,
        inDuration: 500,
        dismissible: false,
        complete: () => { }
      });


      this.$modal_ishikawa = $('#modalDiagrama').modal({
        opacity: 0.6,
        inDuration: 700,
        dismissible: true,
        complete: () => { }
      });

      this.$tbody = $('#cuerpoTabla');

      if (this.action != 'registro') {
        Materialize.updateTextFields();
      }

    }, 100);
  }

  //Detecta cambios en ishikawa
  ngOnChanges(changes: SimpleChanges) {
    let ishikawa_tmp = changes['ishikawa'];
    if(ishikawa_tmp){
      if (ishikawa_tmp.currentValue.estatus == 2) {       
        $('.seguimiento_paso_9').removeProp("disabled");
      }  
    }
  }


  validar(step: number): void {
    let b = false;
    let menssage = "";
    switch (step) {
      case 1:
        b = isValidText(this.ishikawa.que) &&
          isValidText(this.ishikawa.donde) &&
          isValidText(this.ishikawa.cuando) &&
          isValidText(this.ishikawa.como) &&
          isValidText(this.ishikawa.problema);
        menssage = "Capture todos los datos";
        break;
      case 2:
        b = this.ishikawa.listIdeas.filter(el => el.porques != undefined).length > 0
        menssage = "Agregue ideas y seleccione al menos una";
        break;
      case 3:
        this.ishikawa.listIdeas.forEach((item, index) => {
          item.control_error = 0;
          if (item.porques) {
            let porque: PetPorques = item.porques;

            if (isValidText(porque.porque_uno)) {
              if (isValidText(porque.porque_dos)) {
                if (isValidText(porque.porque_tres)) {
                  if (isValidText(porque.porque_cuatro)) {
                    item.control_error = 0;
                  } else if (!isValidText(porque.porque_cinco)) {
                    item.control_error = 0;
                  } else {
                    item.control_error = 2;
                  }
                } else if (!isValidText(porque.porque_cuatro) && !isValidText(porque.porque_cinco)) {
                  item.control_error = 0;
                } else {
                  item.control_error = 2;
                }
              } else if (!isValidText(porque.porque_tres) && !isValidText(porque.porque_cuatro) && !isValidText(porque.porque_cinco)) {
                item.control_error = 0;
              } else {
                item.control_error = 2;
              }
            } else if (!isValidText(porque.porque_dos) && !isValidText(porque.porque_tres) && !isValidText(porque.porque_cuatro) && !isValidText(porque.porque_cinco)) {
              item.control_error = 1;
            } else {
              item.control_error = 2;
            }
          }

        });

        menssage = "Verifique los datos capturados";

        let errores = this.ishikawa.listIdeas.filter(el => el.porques != undefined).map(el => el.control_error).reduce((anterior, actual) => anterior + actual);

        b = errores == 0;

        break;
      case 5:
        b = isValidText(this.ishikawa.causa_raiz);
        menssage = "Ingrese la causa raíz";
        break;
      case 6:
        let question_available = this.preguntas.length;
        if (question_available == this.ishikawa.listConsenso.length) {
          let pregunta3 = this.ishikawa.listConsenso.filter(el => el.id_pregunta == 4)[0].respuesta;
          let total = this.ishikawa.listConsenso.filter(el => el.id_pregunta != 4).map(el => el.respuesta).reduce((anterior, actual) => {
            return anterior + actual;
          });
          b = (pregunta3 === 0 && (total == (question_available - 1)))
          menssage = "Test no válido. Regrese a la lluvia de ideas";

        } else {
          menssage = "Responda todo el test";
        }
        break;
      case 7:
        let ideas_selected = this.ishikawa.listIdeas.filter(el => el.porques != undefined);
        ideas_selected.forEach((item) => {
          item.control_error = 0;

          if (item.porques.planAccion) {
            let planAccion: PetPlanAccion = item.porques.planAccion;
            if (isValidText(planAccion.accion) && isValidText(planAccion.responsable) && isValidText(planAccion.fecha_string)) {
              planAccion.control_error = 0;
            } else {
              planAccion.control_error = 1;
            }
          }

        });

        let errores_plan = this.ishikawa.listIdeas.filter(el => el.porques != undefined).map(el => el.porques).map(el => el.planAccion.control_error).reduce((anterior, actual) => anterior + actual);
        b = (errores_plan == 0);
        menssage = "Ingrese todos los datos";
        break;
    }

    if (b) {

      if (step == 7) {
        // Valida campos nombre equipo etad, grupo, area etad
        if (isValidText(this.ishikawa.nombre_etad)) {
          if (this.ishikawa.id_grupo) {
            if (this.ishikawa.id_etad) {
              this.enviaModelo.emit({ ishikawa: this.ishikawa });
            } else {
              Materialize.toast("Seleccione el area", 4500, 'red');
            }
          } else {
            Materialize.toast("Seleccione el grupo", 4500, 'red');
          }
        } else {
          Materialize.toast("Ingrese nombre de etad", 4500, 'red');
        }

      } else if (step == 6) {
        this.loadingCalendario(0);
        $('.stepper').nextStep();
      } else {
        $('.stepper').nextStep();
      }

    } else {
      Materialize.toast(menssage, 4500, 'red');
    }
  }

  validarVerificacion(step: number): void {
    this.showSteepEight = false;
    let b = false;
    let menssage = "";

    switch (step) {
      case 8:
        b = this.isValidStepOcho();
        menssage = "Ingrese todos los datos";

        break;
      case 9:
        b = true;
        menssage = "Ingrese todos los datos";
        break;
    }

    if (b) {

      if (step == 8) {

        this.showSteepEight = true;


      } else if (step == 9) {
        this.verificarModelo.emit({ ishikawa: this.ishikawa, action: this.action });
      }
    } else {
      Materialize.toast(menssage, 4500, 'red');
    }
  }

  isValidStepOcho(): boolean {
    let b = false;
    let contador = 0;

    do {

      if (isValidText(this.acciones[contador].porque)) {
        b = true;
      } else {
        b = false;
      }

      contador++;


    } while (b && contador < this.acciones.length);
    return b;
  }

  openModalIdea(event: any, eme: Catalogo, action: string, index: number, idea: PetIdeas): void {

    event.preventDefault();
    this.aux_texto_idea = "";

    if (action == 'add') {
      this.$modal.find('.btn-edit').hide();
      this.$modal.find('.btn-add').show();
      this.tmp_idea = new PetIdeas();
      this.tmp_idea.id_eme = eme.id;
      this.$modal.find('#titulo').html('Añadir a ' + eme.valor);

    } else if (action == 'edit') {
      this.aux_texto_idea = idea.idea;
      this.aux_index = index;
      this.tmp_idea = idea;
      this.$modal.find('.btn-add').hide();
      this.$modal.find('.btn-edit').show();
      this.$modal.find('#titulo').html(eme.valor + '<br><b>Haga clic en la opción deseada</b>');
    }

    this.$modal.modal('open');
  }

  revisarIshikawa(): void {
    this.revisaIshikawa.emit({ ishikawa: this.ishikawa });
  }

  loadingCalendario(indice: number): void {

    this.$tbody.find('.datepicker').each((index, value) => {
      $(value).pickadate({
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
        onClose: () => {
          // eme_idea[0]  id de la meta  
          // eme_idea[1] posicion de la idea dentro de la eme 
          let eme_idea = $(value).attr('id').split(',');
          this.ishikawa.listIdeas.filter(el => el.porques != undefined && el.id_eme == eme_idea[0])[eme_idea[1]].porques.planAccion.fecha_string = $(value).val();

        }
      });
    });

  }

  cancelar(): void {
    this.tmp_idea = new PetIdeas();
    this.$modal.modal('close');
  }

  cancelarEdit(): void {
    this.tmp_idea.idea = this.aux_texto_idea;
    this.aux_texto_idea = "";
    this.aux_index = -1;
    this.tmp_idea = new PetIdeas();
    this.$modal.modal('close');
  }



  editarIdea(): void {
    if (isValidText(this.tmp_idea.idea)) {
      this.tmp_idea = new PetIdeas();
      this.$modal.modal('close');
    } else {
      Materialize.toast("Escriba una idea", 4500, 'red');
    }
  }

  agregarIdea(): void {
    if (isValidText(this.tmp_idea.idea)) {
      this.ishikawa.listIdeas.push(this.tmp_idea);
      this.$modal.modal('close');
    } else {
      Materialize.toast("Escriba una idea", 4500, 'red');
    }

  }

  eliminarIdea(): void {
    let tmp_emes = this.ishikawa.listIdeas.filter(el => el.id_eme != this.tmp_idea.id_eme);
    let tmp_eme_selected = this.ishikawa.listIdeas.filter(el => el.id_eme == this.tmp_idea.id_eme)
    tmp_eme_selected.splice(this.aux_index, 1)

    tmp_emes = tmp_emes.concat(tmp_eme_selected);
    this.ishikawa.listIdeas = tmp_emes;

    this.$modal.modal('close');
  }

  cambioEstatus(event, idea: PetIdeas) {

    if (event.target.checked) {
      idea.porques = new PetPorques();
    } else {
      delete idea.porques;
    }

  }

  isChecked(idea: PetIdeas): boolean {
    return idea.porques != undefined;
  }

  getIdeasByEme(id_eme: number): Array<PetIdeas> {
    return this.ishikawa.listIdeas.filter(el => el.id_eme == id_eme);
  }

  generateDiagrama(): void {
    let canvas = <HTMLCanvasElement>document.getElementById('image');
    let ctx = canvas.getContext('2d');

    let img = new Image();

    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0);
      ctx.font = "12px Arial";

    
    }
    img.src = this.image_src;
    this.$modal_ishikawa.modal('open');
  }


  checkedQuestion(event: any, columna: string, id_pregunta: number): void {

    let tmp_consenso = this.ishikawa.listConsenso.map(el => el.id_pregunta);
    let nuevoConsenso: PetConsenso = new PetConsenso();

    if (!tmp_consenso.includes(id_pregunta)) {
      nuevoConsenso.id_pregunta = id_pregunta;
      this.ishikawa.listConsenso.push(nuevoConsenso);
    }


    if (event.target.checked) {
      if (columna == '1') {
        this.ishikawa.listConsenso.filter(el => el.id_pregunta == id_pregunta)[0].respuesta = 1;
      } else if (columna == '2') {
        this.ishikawa.listConsenso.filter(el => el.id_pregunta == id_pregunta)[0].respuesta = 0;
      }
    } else {
      this.ishikawa.listConsenso = this.ishikawa.listConsenso.filter(el => el.id_pregunta != id_pregunta);
    }

  }

  isCheckedQuestionTest(id_pregunta: number, consensos: Array<PetConsenso>, option: number): boolean {

    let resp = false;

    if (consensos.length > 0) {

      let tmp = consensos.filter(el => el.id_pregunta == id_pregunta);

      if (tmp.length > 0) {
        resp = tmp[0].respuesta == option;
      }

    }

    return resp;
  }

  getEmesPresentesIdeas(ideas: Array<PetIdeas>): Array<Catalogo> {
    let eme: Array<Catalogo> = [];
    let eme_tmp = this.emes.map(el => el);
    let emes_ideas = ideas.filter(el => el.porques != undefined).map(el => el.id_eme);

    eme_tmp.forEach((item, index, arg) => {

      if (emes_ideas.includes(item.id) && !eme.map(el => el.id).includes(item.id)) {
        eme.push(item)
      }

    });

    return eme;

  }

  agregarNuevo(): void {
    this.agregarOtro.emit({});
  }

  getAcciones(): Array<PetPlanAccion> {
    return this.ishikawa.listIdeas.filter(el => el.porques != undefined).map(el => el.porques.planAccion);
  }

  checkedVerficacion(option: number, planAccion: PetPlanAccion): void {
    planAccion.efectiva = option;
  }

  changeCheckVefificacion(option: number, tipo: string): void {
    if (tipo == 'solucionado') {
      this.ishikawa.solucionado = option;
    } else if (tipo == 'recurrente') {
      this.ishikawa.recurrente = option;
    } else if (tipo == 'analisis') {
      this.ishikawa.analisis = option;
    }
  }


}
