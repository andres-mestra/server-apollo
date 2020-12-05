function nodes(info){
  const fieldNodes = info.fieldNodes[0].selectionSet.selections
  let n = [];
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