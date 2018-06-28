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
 * @param  {string} numero - Numero ingresado 
 * @return  boolean
 */
let isNumeroAsignacionValid = (numero) => {
    if (numero.trim() == '') {
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
 * @function getMesActual
 * @return  {string} 
 * @description Recupera el descriptivo del mes actual
 */
function getMesActual(): string {
    let nameMoth = '';
    const d: Date = new Date();
    switch (d.getMonth()) {
        case 0:
            nameMoth = 'Ene';
            break;
        case 1:
            nameMoth = 'Feb';
            break;
        case 2:
            nameMoth = 'Mar';
            break;
        case 3:
            nameMoth = 'Abr';
            break;
        case 4:
            nameMoth = 'May';
            break;
        case 5:
            nameMoth = 'Jun';
            break;
        case 6:
            nameMoth = 'Jul';
            break;
        case 7:
            nameMoth = 'Ago';
            break;
        case 8:
            nameMoth = 'Sep';
            break;
        case 9:
            nameMoth = 'Oct';
            break;
        case 10:
            nameMoth = 'Nov';
            break;
        case 11:
            nameMoth = 'Dic';
            break;
    }
    return nameMoth;
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
 * @function getTodayMilisegundos
 * @param date fecha 
 * @return  {string} 
 * @description Devuelve la fecha actual en milisegundos
 */
function getTodayMilisegundos(date: string): number {
    let numbers = date.split("/");
    let f = new Date(numbers[2] + "/" + numbers[1] + "/" + numbers[0]);
    return f.getTime();
}

/**
 * @function getMilisegundosHoras
 * @param date fecha 
 * @param hora HH:i 
 * @return  {string} 
 * @description Devuelve la fecha con hora convertida en milisegundos
 */
function getMilisegundosHoras(date: string, time: string): number {
    let numbers = date.split("/");
    let hora = time.split(":");

    let f = new Date(parseInt(numbers[2]), parseInt(numbers[1]) - 1, parseInt(numbers[0]), parseInt(hora[0]), parseInt(hora[1]));
    return f.getTime();
}

/**
 * @function DataTable
 * @param  {string} el - Elemento DOM. Tabla a la que se le cargará el plugin
 */
function DataTable(el): void {
    $(el).DataTable({
        "dom": '<lf<t>ip>',
        "ordering": false,
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
 * @function DataTable
 * @param  {string} el - Elemento DOM. Tabla a la que se le cargará el plugin
 */
function DataTableLiberadas(el): void {
    $(el).DataTable({
        "dom": '<lf<t>ip>',
        "ordering": false,
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

    $('tabla > select').val('10'); //seleccionar valor por defecto del select
    $('tabla > select').addClass("browser-default"); //agregar una clase de materializecss de esta forma ya no se pierde el select de numero de registros.
    $('tabla > select').material_select();
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
        "ordering": false,
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
 * @function DataTableProduccion
 * @param  {string} el - Elemento DOM. Tabla a la que se le cargará el plugin
 * @description Es usada para reportes sin opcion de paginacion y exportar a excel
 */
function DataTableProduccion(el): void {
    $(el).DataTable({
        "dom": '<lf<t>ip>',
        "bPaginate": false,
        "ordering": false,
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
 * @function DataTableFallas
 * @param  {string} el - Elemento DOM. Tabla a la que se le cargará el plugin
 * @description Es usada para reportes sin opcion de paginacion y exportar a excel
 */
function DataTableFallas(el): void {
    $(el).DataTable({
        "dom": '<lf<t>ip>',
        "bPaginate": false,
        "ordering": false,
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
 * @function contraseniaValida
 * @param {string} contrasenia
 * @return  {boolean} 
 * @description Devuelve un boolean si la contraseña cumple con la expresion regular
 * La contraseña debe tener al entre 6 y 10 caracteres, 
 * al menos un dígito, 
 * al menos una minúscula y 
 * al menos una mayúscula.
 */
function contraseniaValida(contrasenia: string): any {
    return /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,10}$/.test(contrasenia.trim());
}

/**
 * @function hasPermiso
 * @param  {number} idRol -  id del rol a buscar
 * @param  {String} roles -   string separado por comas con los roles
 * @return  {boolean} 
 * @description funcion utilizada para comprobar si existe el rol en el conjunto
 */
function findRol(idRol: number, roles: string): boolean {
    let idRoles = roles.split(",").map(el => parseInt(el));
    return idRoles.includes(idRol);
}

/**
 * @function getTablaUtf8
 * @param  {number} id -  Selector jquery de la tabla
 * @return  {string} 
 * @description funcion utilizada para quitar caracteres especiales cuando se exporta a excel
 */
function getTablaUtf8(id: string): string {
    let tabla = document.getElementById(id);
    return tabla.outerHTML.replace(/ /g, '%20')
        .replace(/á/g, '%e1')
        .replace(/Á/g, '%c1')
        .replace(/é/g, '%e9')
        .replace(/É/g, '%c9')
        .replace(/í/g, '%a1')
        .replace(/Í/g, '%ed')
        .replace(/ó/g, '%f3')
        .replace(/Ó/g, '%d3')
        .replace(/ú/g, '%fa')
        .replace(/Ú/g, '%da')
        .replace(/Ñ/g, '%d1')
        .replace(/ñ/g, '%f1');
}

/**
* @function clone
* @param  {JSON} json -  atributos
* @return  {string} 
* @description permite clonar objeto
*/
function clone(json) {
    return JSON.parse(JSON.stringify(json));
}

/**
* @function hmToMs
* @param  {string} hora -  hora en formato HH:mm
* @return  {number} 
* @description permite clonar objeto
*/
function hmToMs(hora: string): number {
    let HHmm = hora || "00:00";
    let arg = HHmm.split(':');
    let horaMs = parseInt(arg[0]) * 60 * 60 * 1000;
    let MinMs = parseInt(arg[1]) * 60 * 1000;
    return horaMs + MinMs;
}



// Tipo de metas disponibles
function getMetasKPI(): Array<any> {
    return [
        { id: 1, descripcion: 'ESTRATEGICAS', frecuencia: 2 },
        { id: 2, descripcion: 'OPERATIVAS', frecuencia: 0 },
        { id: 3, descripcion: 'KPI OPERATIVOS', frecuencia: 0 }
    ];
};

// Frecuencias de metas disponibles
// frecuencia: 2 significa que tiene anual y mensual 
// frecuencia: 0 solo anual
// frecuencia: 1 solo mensual
function getFrecuenciaMetaKPI(): Array<any> {
    return [
        { id: 0, value: 'anual', descripcion: 'ANUAL' },
        { id: 1, value: 'mensual', descripcion: 'MENSUAL' }
    ];
}


export {
    arrayObjectIndexOf,
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
    DataTableFallas,
    findRol,
    getMesActual,
    contraseniaValida,
    getTablaUtf8,
    clone,
    getTodayMilisegundos,
    DataTableProduccion,
    DataTableLiberadas,
    hmToMs,
    getMetasKPI,
    getFrecuenciaMetaKPI
}