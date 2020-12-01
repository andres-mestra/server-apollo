import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
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
  }
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

models.sequelize.sync(/*{force:true}*/).then(async() => {
  await app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
  
  /* let array = [17, 19, 4, 18, 16, 1, 5, 2, 13, 8];
  for( let i in array){
    await models.user.create({
      name: array[i]+"user",
      email: array[i]+"user@email.com",
      password: "holamundo"
    },{
      benchmark: true,
      logging: console.log,
    }).then( async (user) =>{

      for( let h in array){
        await models.post.create({
          title: array[h]+"post title",
          html: `<h1> post boby hola mundo ${array[h]}</h1>`,
          authorId: user.id,
          tags:[{name:"tecnologia"},{name:"politica"},{name:"arte"}]
        }, {
          include: [{ 
              model: models.tag,
              as:'tags'
          }],
          benchmark: true,
          logging: console.log,
        })
      }
    })
  }  */

})