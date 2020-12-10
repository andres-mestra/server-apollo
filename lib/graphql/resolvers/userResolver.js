import { tryLogin, userResgister } from '../../util/auth';
import nodes from '../../util/nodes';
import { parentPaginate } from '../../util/tools';

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
    users:async (_, {pages} ,{models},info) => {
      const users = await models.user.findAll({
        ...parentPaginate(pages),
        attributes:nodes(info,true, 2)['users'],
        benchmark: true,
      });
      return {
        users,
        pages:{
          start: users[0] ? users[0]?.id : null,
          end: users.length ? users[users.length -1]?.id : null,
        }
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
