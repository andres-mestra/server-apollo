import { tryLogin, userResgister } from '../../util/auth';

module.exports = {
  User:{
    posts: (user, {pages}, {loaders}) => {
      return loaders.load('post', 'authorId', pages, user.id)
    }
  },
  Query: {
    user: async (_, args , {models}) => {
      const user = await models.user.findOne({ 
        where:{ id: args.id },
        raw: true,
        benchmark: true,
      })
      return user;
    },
    users: async (_, {pages} ,ctx,info) => {
      //console.log({nodes:info.fieldNodes[0].selectionSet.selections[0].name, path:info.fieldNodes[0].name})
      let users = await ctx.models.user.findAll({
        order: [['id', pages?.order || 'ASC']],
        limit:pages?.limit || 0,
        benchmark: true,
      });
      return users;
    }
  },
  Mutation: {
    register: async (_,{name, email, password},{models, secret}) => {
      return userResgister(name, email, password, models, secret)
    },
    login: async (_,{email, password},{models, secret}) => 
      tryLogin(email, password,models,secret ), 
  }
}
