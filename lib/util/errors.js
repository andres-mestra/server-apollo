export const Errors =  (path, message) =>{
  return {
    errors: [
      { path: path, message: message },
    ]
  }
}
export const ErrorAdd = (err, path, message) => {
  return {
    errors: [ ... erro.errors, { path: path, message: message}]
  };
}