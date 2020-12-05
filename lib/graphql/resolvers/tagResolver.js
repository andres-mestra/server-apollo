import { errors } from '../../util/errors';
import nodes from '../../util/nodes';
module.exports = {
  Tag:{
    posts: async (tag, {pages}, {loaders}, info) => {
      const posTags = await loaders.load('postags', 'tagId',pages, tag.id);
      let  postIds = [];
      if(posTags){
        //En cada iteración se esta retornando un arreglo de ids
        postIds = posTags.map(v => {
          return v.postId
        })
      }
      const posts  = await loaders.loadMany('post', 'id', pages,postIds,nodes(info));
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
    tag: async (_,{where} , {models},info) => {
      const tag = await models.tag.findOne({ 
        where:{...where},
        raw: true,
        benchmark: true,
        attributes:nodes(info),
      })
      return tag;
    },//tag
    tags: (_, {pages}, {models} , info) => {
      return models.tag.findAll({
        ...pages,
        benchmark: true,
        attributes:nodes(info),
      });
    }//tags
  }//Query
}