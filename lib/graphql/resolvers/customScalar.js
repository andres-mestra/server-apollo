import { EmailAddressResolver, PositiveIntResolver} from 'graphql-scalars';
import { createIntScalar } from 'graphql-scalar';

module.exports = {
  IntSegurity:createIntScalar({
    name:"IntSegurity",
    description:"Tipo Int que permite un valor entre 1 y 25",
    maximum:25,
    minimum:1,
    errorHandler:() => {
      throw new Error("Valor fuera del rango permitido")
    },
  }),
  Email: EmailAddressResolver,
  PositiveInt: PositiveIntResolver,
}