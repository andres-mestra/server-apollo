export function unique(array){
  return [... new Set(array)]
}
export function addUnique(array,v){
  return unique([...array, v]);
}
