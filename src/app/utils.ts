function arrayObjectIndexOf(arr, searchTerm, property): number {

    for (let i = 0, len = arr.length; i < len; i++) {

        if (arr[i][property] === searchTerm) {
            return i;
        }
    }
    return -1;
}


function deleteItemArray(arreglo, valor, propiedad) {
    if (arreglo.length > 0) {
        let exist = arrayObjectIndexOf(arreglo, valor, propiedad);
        if (exist != -1) {
            arreglo.splice(exist, 1);
        }

    }
}



export { deleteItemArray };