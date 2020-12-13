import { flattenDeep} from 'lodash';
import { addUnique, parentPaginate, posTags ,pageInfo ,childPaginate} from '../../util/tools';

import nodes from '../../util/nodes';
module.exports = {
  Post:{
    author:async (post, _, {loaders}, info ) =>{
      const author = await loaders.load('author','user', 'id', _ , post.authorId, nodes(info))
      return author[0];
    },
    tags: async (post, {pages}, {loaders}, info) => {
      const posTags = await loaders.load(
		  'tagsOfpost',
		  'postags', 
		  'postId',
		  childPaginate(pages), 
		  post.id
	  );
		
      let tagIds = [];
      if(posTags){
        //En cada iteraciรณn se esta retornando un arreglo de ids
        tagIds = posTags.map(v => {
          return v.tagId
        })
      }
      const tags  = await loaders.loadMany(
		  'tags',
		  'tag', 
		  'id',           
		  childPaginate(pages),
		  tagIds,
		  nodes(info)
	  );
		
      let resTags = [];
      if(tags){
        resTags = flattenDeep(tags);
      }
      return resTags;
    }//tags
  },//Post 
  Query: {
    post: (_, {where}, {models},info) => {
      const post = models.post.findOne({ 
        where:{...where},
        raw: true,
        benchmark: true,
        attributes: addUnique(nodes(info),'authorId')
      })
      return post;
    },//post
    allPosts: async(_, {pages}, {models} , info) => {
      const posts = await models.post.findAll({
        ...parentPaginate(pages),
        benchmark: true,
        attributes: addUnique(nodes(info,true, 2)['posts'],'authorId')
      });
     
      return {
        posts,
        ...pageInfo(posts[0], posts[posts.length -1])
      }
    }//posts
  },//Query
  Mutation: {
    newPost: (_,args ,{models, loaders}) => {
      const post = models.post.create(
        args
      ).then(async newPost => {
        if(args.tags){
          
          const tagsReq = args.tags.map( t =>  t.name);
          await loaders.loadMany('existsTags', 'tag', 'name', _ , tagsReq ,['name','id'])
          .then(result => {

            const tagsDb = flattenDeep(result);
            const tagsDbName = tagsDb.map( t => t.name);
            posTags(tagsReq, tagsDbName, tagsDb, models, newPost.id);
          
          })
        }
        return newPost
      })

      return post;
    },

  }//Mutation
}