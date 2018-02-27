import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';



declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  public data:any = {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
  }

  public catalogos:any[]=[
      { id : 1 , nombre: 'Ejemplo catalogo 1' , descripcion: 'descripcion'},
      { id : 2 , nombre: 'Ejemplo catalogo 2' , descripcion: 'descripcion'},
      { id : 3 , nombre: 'Ejemplo catalogo 3' , descripcion: 'descripcion'},
      { id : 4 , nombre: 'Ejemplo catalogo 4' , descripcion: 'descripcion'},
      { id : 5 , nombre: 'Ejemplo catalogo 5' , descripcion: 'descripcion'},
      { id : 6 , nombre: 'Ejemplo catalogo 6' , descripcion: 'descripcion'},
      { id : 7 , nombre: 'Ejemplo catalogo 7' , descripcion: 'descripcion'},
      { id : 8 , nombre: 'Ejemplo catalogo 8' , descripcion: 'descripcion'},
    
    ]
 
    

    public equipos:any[]=[
        { id : 1 , nombre: 'Catalogo equipo 1' , descripcion: 'descripcion'},
        { id : 2 , nombre: 'Catalogo equipo 2' , descripcion: 'descripcion'},
        { id : 3 , nombre: 'Catalogo equipo 3' , descripcion: 'descripcion'},
        { id : 4 , nombre: 'Catalogo equipo 4' , descripcion: 'descripcion'},
        { id : 5 , nombre: 'Catalogo equipo 5' , descripcion: 'descripcion'},
        { id : 6 , nombre: 'Catalogo equipo 6' , descripcion: 'descripcion'},
        { id : 7 , nombre: 'Catalogo equipo 7' , descripcion: 'descripcion'},
        { id : 8 , nombre: 'Catalogo equipo 8' , descripcion: 'descripcion'},
        { id : 1 , nombre: 'Catalogo equipo 1' , descripcion: 'descripcion'},
        { id : 2 , nombre: 'Catalogo equipo 2' , descripcion: 'descripcion'},
        { id : 3 , nombre: 'Catalogo equipo 3' , descripcion: 'descripcion'},
        { id : 4 , nombre: 'Catalogo equipo 4' , descripcion: 'descripcion'},
        { id : 5 , nombre: 'Catalogo equipo 5' , descripcion: 'descripcion'},
        { id : 6 , nombre: 'Catalogo equipo 6' , descripcion: 'descripcion'},
        { id : 7 , nombre: 'Catalogo equipo 7' , descripcion: 'descripcion'},
        { id : 8 , nombre: 'Catalogo equipo 8' , descripcion: 'descripcion'},
        { id : 1 , nombre: 'Catalogo equipo 1' , descripcion: 'descripcion'},
        { id : 2 , nombre: 'Catalogo equipo 2' , descripcion: 'descripcion'},
        { id : 3 , nombre: 'Catalogo equipo 3' , descripcion: 'descripcion'},
        { id : 4 , nombre: 'Catalogo equipo 4' , descripcion: 'descripcion'},
        { id : 5 , nombre: 'Catalogo equipo 5' , descripcion: 'descripcion'},
        { id : 6 , nombre: 'Catalogo equipo 6' , descripcion: 'descripcion'},
        { id : 7 , nombre: 'Catalogo equipo 7' , descripcion: 'descripcion'},
        { id : 8 , nombre: 'Catalogo equipo 8' , descripcion: 'descripcion'}
      
      ]

    public texto_busqueda:string = "";

  constructor() { }

  ngOnInit() {
    $(".button-collapse").sideNav();
    

  }

  ngAfterViewInit() {
    $('#tabla').DataTable({
        "dom": '<lf<t>ip>',
        "bPaginate": true, 
        "bLengthChange": true,
        "lengthChange": true,
        "aLengthMenu": [[10,25, 50, 75, -1], [10,25, 50, 75, "Todos"]],
        "iDisplayLength": 10,
        "language": {
            "zeroRecords": "No se encontrarón coincidencias",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
            "infoFiltered":   "(filtrado de _MAX_ total registros)",
            "lengthMenu":     "Mostrar _MENU_ regitros",
            "search": "Buscar:",
            "paginate": {
                "first":      "Inicio",
                "last":       "Fin",
                "next":       "Sig.",
                "previous":   "Anterior"
            }
        }

    });

    $('select').val('10'); //seleccionar valor por defecto del select
    $('select').addClass("browser-default"); //agregar una clase de materializecss de esta forma ya no se pierde el select de numero de registros.
    $('select').material_select();

    var ctx = $("#myChart").get(0).getContext("2d");
    var ctx1 = $("#myChart1").get(0).getContext("2d");
    var ctx2 = $("#myChart2").get(0).getContext("2d");
    var ctx3 = $("#myChart3").get(0).getContext("2d");
    var ctx4 = $("#myChart4").get(0).getContext("2d");
    var ctx5 = $("#myChart5").get(0).getContext("2d");
      new Chart(ctx, this.data);
      new Chart(ctx1, this.data);
      new Chart(ctx2, this.data);
      new Chart(ctx3, this.data);
      new Chart(ctx4, this.data);
      new Chart(ctx5, this.data);

  }

  limpiarInput(){
      this.texto_busqueda="";
  }

}
