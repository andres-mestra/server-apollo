const path = require('path');
const { mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');
import { createIntScalar } from 'graphql-scalar';


const resolversArray = loadFilesSync(path.join(__dirname, './'), {ignoreIndex:true});
const intSegurity = createIntScalar({
  name:"IntSegurity",
  description:"Tipo Int que permite un valor entre 1 y 50",
  maximum:50,
  minimum:1,
  errorHandler:() => {
    throw new Error("Valor fuera del rango permitido")
  },
})//Scalar IntSegurity


module.exports = mergeResolvers([
  {IntSegurity:intSegurity},
  ...resolversArray
]);