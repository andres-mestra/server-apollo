import {addUnique} from './tools'

/**
 * Extrae los nodos del info graphql
 * @param {[object]} array - un array de objetos del selections de graphql info
 * @param {boolean} root - Si es true se creara un objeto para la respesta, si false se crea un array
 * se hace necesario porque estructuras mas complejas de querys    
 * @param {int} prof - Se establece para controlar la profundidad en el mapeo del los selections 
 * de graphql
 */
function findElement(array, root = false, prof = 1){
  let names = root ? {} : []
  array.forEach(element => {
    if(!element.selectionSet && element.name.value != "__typename"){
      names.push(element.name.value); 
    }else if(prof > 1){
      names[element.name.value] = findElement(element.selectionSet.selections);
    }
  });

  return root ? names : addUnique(names,'id');
}


/**
 * Construye un array a partir de los FieldNodes del Query Graphql
 * @param {object} info - Objeto info de Query Graphql
 * @param {string} keyInc -Attribute que se incluye adicional
 * @returns {string[]} Array
 */
function nodes(info,root, prof){
  const atributos = findElement(info.fieldNodes[0].selectionSet.selections, root, prof);
  return atributos;
  /*
  Es necesario pasar por aqui siempre ?
  */
}

export default nodes;