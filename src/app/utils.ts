declare var $: any;


/**
 * @function arrayObjectIndexOf
 * @param  {Array} arr -  Arreglo 
 * @param  {any} searchTerm - que se busca 
 * @param  {string} property - Propiedad en la que se buscará searchTerm
 * @return  {number} 
 * @description Regresa un numero >= 0 si encuentra el elemento que se esta buscando
 */
function arrayObjectIndexOf(arr, searchTerm, property): number {

    for (let i = 0, len = arr.length; i < len; i++) {

        if (arr[i][property] === searchTerm) {
            return i;
        }
    }
    return -1;
}

/**
 * @function deleteItemArray
 * @param  {Array} arreglo -  Arreglo al que se eliminará un valor
 * @param  {any} valor - Valor que será eliminado 
 * @param  {string} propiedad - Propiedad en la que se buscará el valor
 * @return  {Array} 
 * @description Contiene los años que serán mostrados en el combo
 */
function deleteItemArray(arreglo, valor, propiedad) {
    if (arreglo.length > 0) {
        let exist = arrayObjectIndexOf(arreglo, valor, propiedad);
        if (exist != -1) {
            arreglo.splice(exist, 1);
        }

    }
}

/**
 * @function isValidId
 * @param  {any} id -   Parametro recuperado en la url
 * @return  {boolean} 
 * @description funcion utilizada para verificar que sea un número lo que se manda por la url
 * cuando se va editar un registro en un formulario
 */
function isValidId(id: any): boolean {
    return /^[0-9]+$/.test(id);
}


/**
 * @function isNumeroAsignacionValid
 * @param  {int} numero - Numero ingresado 
 * @return  boolean
 */
let isNumeroAsignacionValid = (numero) => {
    if (numero == undefined || numero.trim() == '') {
        return false;
    } else {
        return /^[0-9]*([.][0-9]+)?$/.test(numero.trim())
    }

};

/**
 * @function getAnioActual
 * @return  {number} 
 * @description Recupera el año actual en la aplicación
 */
function getAnioActual(): number {
    const d: Date = new Date();
    return d.getFullYear();
}

/**
 * @function getFechaActual
 * @return  {string} 
 * @description Devuelve la fecha actual del sistema
 */
function getFechaActual(): string {
    const d: Date = new Date();
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}

/**
 * @function getMilisegundos
 * @param date fecha 
 * @return  {string} 
 * @description Devuelve la fecha convertida en milisegundos
 */
function getMilisegundos(date: string): number {
    let numbers = date.split("/");
    let f = new Date(numbers[1] + "/" + numbers[0] + "/" + numbers[2]);
    return f.getTime();
}
/**
 * @function getMilisegundosHoras
 * @param date fecha 
 * @param hora HH:i 
 * @return  {string} 
 * @description Devuelve la fecha con hora convertida en milisegundos
 */
function getMilisegundosHoras(date: string, time:string): number {
    let numbers = date.split("/");
    let hora = time.split(":");

    let f = new Date(parseInt(numbers[2]) ,  parseInt(numbers[1] ) ,parseInt(numbers[0]), parseInt(hora[0]), parseInt(hora[1]));
    return f.getTime();
}

/**
 * @function DataTable
 * @param  {string} el - Elemento DOM. Tabla a la que se le cargará el plugin
 */
function DataTable(el): void {
    $(el).DataTable({
        "dom": '<lf<t>ip>',
        "bPaginate": true,
        "scrollX": true,
        "autoWidth": "*",
        "scrollCollapse": true,
        "bLengthChange": true,
        "lengthChange": true,
        "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "Todos"]],
        "iDisplayLength": 10,
        "language": {
            "zeroRecords": "No se encontrarón registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 a 0 de 0 registros",
            "infoFiltered": "(filtrado de _MAX_ total registros)",
            "lengthMenu": "Mostrar _MENU_ regitros",
            "search": "Filtrar:",
            "paginate": {
                "first": "Inicio",
                "last": "Fin",
                "next": "Sig.",
                "previous": "Anterior"
            }
        }
    });

    $('select').val('10'); //seleccionar valor por defecto del select
    $('select').addClass("browser-default"); //agregar una clase de materializecss de esta forma ya no se pierde el select de numero de registros.
    $('select').material_select();
}


/**
 * @function DataTableReporte
 * @param  {string} el - Elemento DOM. Tabla a la que se le cargará el plugin
 * @description Es usada para reportes sin opcion de paginacion y exportar a excel
 */
function DataTableReporte(el): void {
    $(el).DataTable({
        "dom": '<l<t>ip>',
        "bPaginate": false,
        "scrollX": true,
        "autoWidth": "*",
        "scrollCollapse": true,
        "bLengthChange": true,
        "lengthChange": true,
        "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "Todos"]],
        "iDisplayLength": 10,
        "language": {
            "zeroRecords": "No se encontrarón registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 a 0 de 0 registros",
            "infoFiltered": "(filtrado de _MAX_ total registros)",
            "lengthMenu": "Mostrar _MENU_ regitros",
            "search": "Filtrar:",
            "paginate": {
                "first": "Inicio",
                "last": "Fin",
                "next": "Sig.",
                "previous": "Anterior"
            }
        }
    });

    $('table > select').val('10'); //seleccionar valor por defecto del select
    $('table > select').addClass("browser-default"); //agregar una clase de materializecss de esta forma ya no se pierde el select de numero de registros.
    $('table > select').material_select();
}

/**
 * @function getYears
 * @return  {Array} 
 * @description Contiene los años que serán mostrados en el combo
 */
function getYears(): any {
    let years: any = {
        '2015': '2015',
        '2016': '2016',
        '2017': '2017',
        '2018': '2018',
        '2019': '2019',
        '2020': '2020',
        '2021': '2021',
        '2022': '2022',
        '2023': '2023',
        '2024': '2024',
        '2025': '2025'
    }

    return years;
}

/**
 * @function calculaDiaPorMes
 * @param {string} mes mes
 * @return  {number} 
 * @description Regresa el numero de dias que tiene el mes
 */
function calculaDiaPorMes(anio: number, mes: number): number {
    let totalDias;
    switch (mes) {
        case 1:  // Enero
        case 3:  // Marzo
        case 5:  // Mayo
        case 7:  // Julio
        case 8:  // Agosto
        case 10:  // Octubre
        case 12: // Diciembre
            return 31;
        case 4:  // Abril
        case 6:  // Junio
        case 9:  // Septiembre
        case 11: // Noviembre
            return 30;
        case 2:  // Febrero
            if (((anio % 100 == 0) && (anio % 400 == 0)) ||
                ((anio % 100 != 0) && (anio % 4 == 0)))
                return 29;  // Año Bisiesto
            else
                return 28;
        default:
        return -1;
    }
}


/**
 * @function getLabels
 * @param arg Arreglo de los datos 
 * @return  {Array} 
 * @description Esta funcion devuelve las etiquetas que serán graficadas
 */
function getLabels(arg: Array<any>): any {

    return [];
}


export {
    deleteItemArray,
    isValidId,
    getAnioActual,
    DataTable,
    getYears,
    getFechaActual,
    getMilisegundos,
    isNumeroAsignacionValid,
    DataTableReporte,
    calculaDiaPorMes,
    getMilisegundosHoras,
    getLabels
}