import { errors } from '../../util/errors';
import nodes from '../../util/nodes';
module.exports = {
  Post:{
    tags: async (post, {pages}, {loaders}, info) => {
      const posTags = await loaders.load('postags', 'postId', pages, post.id);
      let tagIds = [];
      if(posTags){
        //En cada iteración se esta retornando un arreglo de ids
        tagIds = posTags.map(v => {
          return v.tagId
        })
      }
      //console.log([tagIds, post.id]);
      const tags  = await loaders.loadMany('tag', 'id', pages,tagIds,nodes(info));
      let resTags = [];
      if(tags){
        resTags = tags.map(v => {
          return v[0];
        })
      }
      return resTags;
    }//tags
  },//Post 
  Query: {
    post: async (_, {where}, {models}) => {
      const post = await models.post.findOne({ 
        where:{...where},
        raw: true,
        benchmark: true,
        attributes:nodes(info),
      })
      return post;
    },//post
    posts: (_, {pages}, {models} , info) => {
      return models.post.findAll({
        ...pages,
        benchmark: true,
        attributes:nodes(info),
      });
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