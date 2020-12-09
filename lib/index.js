import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';

import app from './middleware';
import schema from './graphql/schema.js';
import models from './db/models';
import Loader from './util/loaders';
process.env.JWT_SECRET =  'holamundo';


const SECRET = process.env.SECRET || 'holamundo';

const server = new ApolloServer({
  cors:false,
  schema: schema,
  context:({ req }) =>{
    return {
      models,
      secret:SECRET,
      request: req,
      loaders: new Loader()
    }
  },
  validationRules: [ depthLimit(4)],
  formatError:(err)=>{
	return {
		path:err?.path,
		message:err?.message
	}
  }
});

server.applyMiddleware({ 
  app,
  cors: false,
  path:'/graphql'
});

models.sequelize.sync(/*{force:true}*/).then(() => {
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
})