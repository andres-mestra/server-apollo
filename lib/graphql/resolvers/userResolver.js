import { tryLogin, userResgister } from '../../util/auth';
import nodes from '../../util/nodes';

module.exports = {
  User:{
    posts: (user, {pages}, {loaders},info) => {
      return loaders.load('post', 'authorId', pages, user.id,nodes(info))
    }//posts
  },//User
  Query: {
    user: async (_,{where}, {models},info) => {
      const user = await models.user.findOne({ 
        where:{...where},
        attributes:nodes(info),
        raw: true,
        benchmark: true,
      })
      return user;
    },//user
    users: async (_, {pages} ,ctx,info) => {
      const users = await ctx.models.user.findAll({
        ...pages,
        attributes:nodes(info),
        benchmark: true,
      });
      
      return users;

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
