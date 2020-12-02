import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import depthLimit from 'graphql-depth-limit';
import cors from 'cors';

import schema from './graphql/schema.js';
import models from './db/models';
import { refreshToken } from './util/auth';
import Loader from './util/loaders';
process.env.JWT_SECRET =  'holamundo';


const SECRET = process.env.SECRET || 'holamundo';

const addUser = async (req, res, next) => {
  const token = req.headers['authorization'];
  if(token){
    try{
      const { userUid, role } = jwt.verify(token, SECRET);
    }catch(err){
      const newToken = await refreshToken(token, db, SECRET);
      if(newToken){
        res.set('Access-Control-Expose-Headers','authorization');
        res.set('authorization', newToken);
      }
      req.headers['authorization'] = newToken;
    }
  }
  next();
};

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
  validationRules: [ depthLimit(3)]
});

const app = express();
app.use(cors({
  credentials:true,
  origin:'http://localhost:3000' 
}))
app.use(
  '/graphql',
  addUser
);

server.applyMiddleware({ 
  app,
  cors: false,
  path:'/graphql'
});

models.sequelize.sync(/* {force:true} */).then(async() => {
  await app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );

})