import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import schema from './graphql/schema.js';
import db from './db/models';



const SECRET = process.env.SECRET || 'holamundo';
const server = new ApolloServer({
  schema: schema,
  context:{
    models:db,
    secret:SECRET,
  }
});

const app = express();
server.applyMiddleware({ app });

db.sequelize.sync(/*{force:true}*/).then(async() => {
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );

  /*const result = await db.user.findAll();
  console.log({result})
  */
    
})