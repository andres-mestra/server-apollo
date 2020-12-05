/**
 * Construye un array a partir de los FieldNodes del Query Graphql
 * @param {object} info - Objeto info de Query Graphql
 * @param {string} keyInc -Attribute que se incluye adicional
 * @returns {string[]} Array
 */
function nodes(info, keyInc){
  const fieldNodes = info.fieldNodes[0].selectionSet.selections
  let n = keyInc ? [keyInc]: [];
  fieldNodes.forEach(element => {
    if(!element.selectionSet && element.name.value != "__typename"){
      n.push(element.name.value);
    }
  });
  
  //Nos aseguramos de tener el id en los attributes para garantizar
  //algunas consultas relacionales
  return [...new Set([...n,'id'])];
}

export default nodes;