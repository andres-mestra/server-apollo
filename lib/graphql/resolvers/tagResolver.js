import { errors } from '../../util/errors';
module.exports = {
  Tag:{
    posts: async (tag, {pages}, {loaders}) => {
      const posTags = await loaders.load('postags', 'tagId', pages, tag.id);
      let  postIds = [];
      if(posTags){
        //En cada iteración se esta retornando un arreglo de ids
        postIds = posTags.map(v => {
          return v.postId
        })
      }
      const posts  = await loaders.loadMany('post', 'id', pages,postIds);
      let resPosts = [];
      if(posts){
        resPosts = posts.map(v => {
          return v[0];
        })
      }
      return resPosts;
    }//posts
  },//Tag
  Query: {
    tag: async (_,{where} , {models}) => {
      const tag = await models.tag.findOne({ 
        where:{...where},
        raw: true,
        benchmark: true,
      })
      return tag;
    },//tag
    tags: (_, {pages}, {models} , info) => {
      return models.tag.findAll({
        ...pages,
        benchmark: true,
      });
    }//tags
  }//Query
}