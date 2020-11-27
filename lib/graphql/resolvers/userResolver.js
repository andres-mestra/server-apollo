import { tryLogin, userResgister } from '../../util/auth';

module.exports = {
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
      let keys = users.map((v,i) => {
        return v.id
      })
      const postsSearch = await ctx.loaders.posts.loadMany(keys);
      
      let result = users.map((u,i) => {
        if(postsSearch[i][0]?.authorId == u.id){
          u.posts = postsSearch[i];
        }
        return u;
      })
      return result;
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
