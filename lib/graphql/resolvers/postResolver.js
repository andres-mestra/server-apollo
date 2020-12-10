import { flattenDeep } from 'lodash';
import { addUnique, parentPaginate } from '../../util/tools';
import nodes from '../../util/nodes';
module.exports = {
  Post:{
    author:async(post, _, {loaders}, info ) =>{
      const author = await loaders.load('author','user', 'id', _ , post.authorId, nodes(info));
      return author[0];
    },
    tags: async (post, {pages}, {loaders}, info) => {
      const posTags = await loaders.load('tagsOfpost','postags', 'postId', pages, post.id);
      let tagIds = [];
      if(posTags){
        //En cada iteración se esta retornando un arreglo de ids
        tagIds = posTags.map(v => {
          return v.tagId
        })
      }
      const tags  = await loaders.loadMany('tags','tag', 'id', pages,tagIds,nodes(info));
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
    posts: async(_, {pages}, {models} , info) => {
      const posts = await models.post.findAll({
        ...parentPaginate(pages),
        benchmark: true,
        attributes: addUnique(nodes(info,true, 2)['posts'],'authorId')
      });

      return {
        posts,
        pages:{
          start: posts[0] ? posts[0]?.id : null,
          end: posts.length ? posts[posts.length -1]?.id : null,
        }
      }
    }//posts
  },//Query
  Mutation: {
    newPost: async (_,args ,{models}) => {
      try {
        const post = await models.post.create(
          args
        );
        
        if(args.tags){
          await Promise.all(
            args.tags.map(tag => {
              return models.tag.findOrCreate(
                {where: {name: tag.name},
                dafaults:tag
              });
            })
          ).then(async tagsCreate => {
            await Promise.all(
              tagsCreate.map(([tag, created]) => {
                return models.postags.create({
                  postId: post.id,
                  tagId: tag.id
                })
              })
            );
          }) 
        }//crear relación postags.
      
        return {
          post
        };

      }catch(err){
        console.error(err);
      }  
    }//newPost
  }//Mutation
}