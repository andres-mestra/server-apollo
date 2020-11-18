import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import schema from './graphql/schema.js';
import db from './db/models';
import { refreshToken } from './util/auth';
process.env.JWT_SECRET= 'holamundo';


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
  schema: schema,
  context:({ req }) =>{
    return {
      models:db,
      secret:SECRET,
      request: req,
    }
  }
});

const app = express();
app.use(
  '/graphql',
  addUser
);

server.applyMiddleware({ app });

db.sequelize.sync(/*{force:true}*/).then(async() => {
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );

  /*const result = await db.user.findAll();
  console.log({result})
  */
    
})