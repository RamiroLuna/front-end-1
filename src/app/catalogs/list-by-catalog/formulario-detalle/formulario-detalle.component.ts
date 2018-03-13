import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Catalogo } from '../../../models/catalogo';

declare var Materialize: any;
@Component({
  selector: 'app-formulario-detalle',
  templateUrl: './formulario-detalle.component.html'
})
export class FormularioDetalleComponent implements OnInit {

  public nombre_catalogo: string;
  public nombre_tabla: string;
  public isCatalog: boolean = true;
  public link_back: string;
  public formCatalogs: FormGroup;
  public submitted: boolean;
  public itemCatalogo: Catalogo;
  public id: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.submitted = false;

    this.route.paramMap.subscribe(params => {

      if (params.get('id') == 'nuevo') {
        this.itemCatalogo = new Catalogo();
      } else {

      }

      switch (params.get('name')) {
        case 'perdidas':
          this.nombre_catalogo = 'Perdida';
          this.nombre_tabla = 'pet_cat_perdida';
          break;
        case 'planeado':
          this.nombre_catalogo = 'Paro planeado';
          this.nombre_tabla = 'pet_cat_planeado';
          break;
        case 'no_planeado':
          this.nombre_catalogo = 'Paro no planeado';
          this.nombre_tabla = 'pet_cat_noplaneado';
          break;
        case 'reduccion':
          this.nombre_catalogo = 'Reducción';
          this.nombre_tabla = 'pet_cat_reduc_velocidad';
          break;
        case 'calidad':
          this.nombre_catalogo = 'Calidad';
          this.nombre_tabla = 'pet_cat_calidad';
          break;
        case 'extrusores':
          this.nombre_catalogo = 'Nombre de equipos extrusores';
          this.nombre_tabla = 'pet_cat_equipos_extrusores_bulher';
          break;
        case 'ssp':
          this.nombre_catalogo = 'Nombre de equipos SSP';
          this.nombre_tabla = 'pet_cat_equipos_ssp';
          break;
        case 'grupo-linea':
          this.nombre_catalogo = 'Grupos de linea';
          this.nombre_tabla = 'pet_cat_gpo_linea';
          break;
        case 'grupos':
          this.nombre_catalogo = 'Grupos';
          this.nombre_tabla = 'pet_cat_grupos';
          break;
        case 'perfiles':
          this.nombre_catalogo = 'Perfiles';
          this.nombre_tabla = 'pet_cat_perfiles';
          break;
        case 'turnos':
          this.nombre_catalogo = 'Turno';
          this.nombre_tabla = 'pet_cat_turnos';
          break;
        default:
          this.isCatalog = false;
      }

      this.link_back = params.get('name');

    });

    this.formCatalogs = this.fb.group({
      descripcion: new FormControl(this.itemCatalogo.descripcion, [Validators.required])
    });

  }

  accion(item: Catalogo) {
    this.submitted = true;
    if (this.formCatalogs.valid) {

    } else {
      Materialize.toast('Se encontrarón errores!', 4000, 'red');
    }


  }
}


