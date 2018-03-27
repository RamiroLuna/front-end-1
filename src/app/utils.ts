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
    return d.getDate() + "/" + (d.getMonth() + 1 ) + "/"+ d.getFullYear();
}

/**
 * @function getMilisegundos
 * @param date fecha 
 * @return  {string} 
 * @description Devuelve la fecha convertida en milisegundos
 */
function getMilisegundos(date:string): number {
    let numbers = date.split("/");
    let f = new Date(numbers[1] + "/" + numbers[0] + "/" +numbers[2]);
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
 * @function getYears
 * @return  {Array} 
 * @description Contiene los años que serán mostrados en el combo
 */
function getYears(): any{
    let years:any = {
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




export { deleteItemArray, isValidId, getAnioActual, DataTable, getYears , getFechaActual, getMilisegundos}