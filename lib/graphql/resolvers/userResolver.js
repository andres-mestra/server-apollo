import { tryLogin, userResgister } from '../../util/auth';

module.exports = {
  User:{
    posts: (user, {pages}, {loaders}) => {
      return loaders.load('post', 'authorId', pages, user.id)
    }//posts
  },//User
  Query: {
    user: async (_,{where}, {models}) => {
      const user = await models.user.findOne({ 
        where:{...where},
        raw: true,
        benchmark: true,
      })
      return user;
    },//users
    users: async (_, {pages} ,ctx,info) => {
      //console.log({nodes:info.fieldNodes[0].selectionSet.selections[0].name, path:info.fieldNodes[0].name})
      let users = await ctx.models.user.findAll({
        ...pages,
        benchmark: true,
      });
      return users;
    }//users
  },//Query
  Mutation: {
    register: async (_,{name, email, password},{models, secret}) => {
      return userResgister(name, email, password, models, secret)
    },
    login: async (_,{email, password},{models, secret}) => 
      tryLogin(email, password,models,secret ), 
  }//Mutation
}
