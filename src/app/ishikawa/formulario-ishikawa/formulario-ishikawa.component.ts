import { Component, OnInit } from '@angular/core';
import { Catalogo } from '../../models/catalogo';
import { PetIshikawa } from '../../models/pet-ishikawa';
import { PetIdeas } from '../../models/pet-ideas';
import { PetPorques } from '../../models/pet-porques';

declare var $: any;
@Component({
  selector: 'app-formulario-ishikawa',
  templateUrl: './formulario-ishikawa.component.html',
  styleUrls: ['./formulario-ishikawa.component.css']
})
export class FormularioIshikawaComponent implements OnInit {

  public emes: Array<Catalogo>;
  public preguntas: Array<Catalogo>;
  public ishikawa: PetIshikawa;
  public tmp_idea: PetIdeas;
  public aux_texto_idea: string;
  public aux_index: number;
  public $modal: any;
  public $modal_ishikawa: any;

  constructor() { }

  ngOnInit() {

    this.ishikawa = new PetIshikawa();
    this.tmp_idea = new PetIdeas();
    this.aux_texto_idea = "";
    this.aux_index = -1;

    this.emes = [
      { id: 1, valor: 'Mano de obra', descripcion: 'Mano de obra', activo: 1 },
      { id: 2, valor: 'Maquinaría', descripcion: 'Maquinaría', activo: 1 },
      { id: 3, valor: 'Mediciones', descripcion: 'Mediciones', activo: 1 },
      { id: 4, valor: 'Método', descripcion: 'Método', activo: 1 },
      { id: 5, valor: 'Material', descripcion: 'Material', activo: 1 },
      { id: 6, valor: 'Medio ambiente', descripcion: 'Medio ambiente', activo: 1 }
    ];

    this.preguntas = [
      { id: 1, valor: '¿El enunciado de la causa raíz identifica a algún elemento del proceso? ', descripcion: '  ¿El enunciado de la causa raíz identifica a algún elemento del proceso? ', activo: 1 },
      { id: 2, valor: '¿Es controlable la causa raíz?', descripcion: '¿Es controlable la causa raíz?', activo: 1 },
      { id: 3, valor: '¿Se puede preguntar “por qué” otra vez y obtener otra causa raíz controlable? ', descripcion: '¿Se puede preguntar “por qué” otra vez y obtener otra causa raíz controlable? ', activo: 1 },
      { id: 4, valor: '¿La causa raíz identificada es la falla fundamental del proceso?', descripcion: ' ¿La causa raíz identificada es la falla fundamental del proceso?', activo: 1 },
      { id: 5, valor: 'Si corregimos o mejoramos la causa raíz identificada,  ¿Asegurará que el problema identificado no vuelva a ocurrir?', descripcion: 'sin descripcion', activo: 1 },
      { id: 6, valor: '¿Hemos identificado la causa raíz del problema? ', descripcion: '  ¿Hemos identificado la causa raíz del problema? ', activo: 1 }
    ];

    setTimeout(() => {

      $('.stepper').activateStepper({
        linearStepsNavigation: false, //allow navigation by clicking on the next and previous steps on linear steppers
        autoFocusInput: true, //since 2.1.1, stepper can auto focus on first input of each step
        autoFormCreation: false, //control the auto generation of a form around the stepper (in case you want to disable it)
        showFeedbackLoader: true //set if a loading screen will appear while feedbacks functions are running
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





    }, 100);
  }

  validar(): void {
    $('.stepper').nextStep();
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
    this.tmp_idea = new PetIdeas();
    this.$modal.modal('close');
  }

  agregarIdea(): void {
    this.ishikawa.listIdeas.push(this.tmp_idea);
    this.$modal.modal('close');

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

  getIdeasByEmeSelected(id_eme: number): Array<PetIdeas> {
    return this.ishikawa.listIdeas.filter(el => el.id_eme == id_eme && el.porques != undefined);
  }

  generateDiagrama(): void {
    this.$modal_ishikawa.modal('open');
  }

  checkedQuestion(event: any, renglon: number, columna: string): void {
    if (event.target.checked) {
      if (columna == '1') {
        $('#' + renglon + '2').prop("checked", false);
      } else if (columna == '2') {
        $('#' + renglon + '1').prop("checked", false);
      }
    }
  }





}
