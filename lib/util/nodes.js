import {addUnique} from './tools'
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

  /* const fieldNodes = info.fieldNodes[0].selectionSet.selections
  let n = keyInc ? [keyInc]: [];
  fieldNodes.forEach()
  fieldNodes.forEach(element => {
    if(!element.selectionSet && element.name.value != "__typename"){
      n.push(element.name.value);
    }
  }); */
  
  //Nos aseguramos de tener el id en los attributes para garantizar
  //algunas consultas relacionales
  //return [...new Set([...n,'id'])];
}

export default nodes;