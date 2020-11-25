export const errors =  (field, message) =>{
  return {
    errors: [
      { field: field, message: message },
    ]
  }
}
export const errorAdd = (err, field, message) => {
  return {
    errors: [ ... erro.errors, { field: field, message: message}]
  };
}