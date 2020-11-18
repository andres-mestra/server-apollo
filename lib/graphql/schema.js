import { makeExecutableSchema } from '@graphql-tools/schema';
import { IsAuthenticatedDirective, HasRoleDirective, HasScopeDirective } from "graphql-auth-directives";
import typeDefs from './types';
import resolvers from './resolvers';
export default  makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuth: IsAuthenticatedDirective,
    hasRole: HasRoleDirective,
  }
});