export const errors =  (path, message) =>{
  return {
    errors: [
      { path: path, message: message },
    ]
  }
}
export const errorAdd = (err, path, message) => {
  return {
    errors: [ ... erro.errors, { path: path, message: message}]
  };
}