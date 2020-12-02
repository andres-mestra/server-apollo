import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { refreshToken } from './util/auth';

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


const app = express();
app.use(cors({
  credentials:true,
  origin:'http://localhost:3000' 
}))
app.use(
  '/graphql',
  addUser
);

export default app;