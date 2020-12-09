import { tryLogin, userResgister } from '../../util/auth';
import nodes from '../../util/nodes';

module.exports = {
  User:{
    posts: (user, {pages}, {loaders},info) => {
      return loaders.load('posts','post', 'authorId', pages, user.id,nodes(info))
    }//posts
  },//User
  Query: {
    user: (_,{where}, {models},info) => {
      const user =  models.user.findOne({ 
        where:{...where},
        attributes:nodes(info),
        raw: true,
        benchmark: true,
      })
      return user;
    },//user
    users: (_, {pages} ,ctx,info) => {
      const users = ctx.models.user.findAll({
        ...pages,
        attributes:nodes(info,true, 2)['users'],
        benchmark: true,
      });
      
      return {
        users,
        pages:{}
      };

    }//users
  },//Query
  Mutation: {
    register: async (_,{username, email, password},{models, secret}) => {
      return userResgister(username, email, password, models, secret)
    },
    login: async (_,{email, password},{models, secret}) => {
      return tryLogin(email, password,models,secret );
    }
  }//Mutation
}
