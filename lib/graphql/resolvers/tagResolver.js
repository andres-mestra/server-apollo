import { flattenDeep } from 'lodash';
import { addUnique } from '../../util/tools';
import { errors } from '../../util/errors';
import nodes from '../../util/nodes';
module.exports = {
  Tag:{
    posts: async (tag, {pages}, {loaders}, info) => {
      const posTags = await loaders.load('postsOftag','postags', 'tagId',pages, tag.id);
      let  postIds = [];
      if(posTags){
        //En cada iteración se esta retornando un arreglo de ids
        postIds = posTags.map(v => {
          return v.postId
        })
      }
      const posts  = await loaders.loadMany('posts','post', 'id', pages,postIds, addUnique(nodes(info),'authorId'));
      let resPosts = [];
      if(posts){
        resPosts = flattenDeep(posts);
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
    tags: async(_, {pages}, {models} , info) => {
      const tags = await models.tag.findAll({
        ...pages,
        benchmark: true,
        attributes:nodes(info,true, 2)['tags'],
      });
      return {
        tags
      }
    }//tags
  }//Query
}