import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './types';
import resolvers from './resolvers';
export default  makeExecutableSchema({
  typeDefs,
  resolvers,
});