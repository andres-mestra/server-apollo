import { errors } from '../../util/errors';
module.exports = {
  Post:{
    tags: async (post, {pages}, {loaders}) => {
      const posTags = await loaders.load('postags', 'postId', pages, post.id);
      let tagIds = [];
      if(posTags){
        //En cada iteración se esta retornando un arreglo de ids
        tagIds = posTags.map(v => {
          return v.tagId
        })
      }
      //console.log([tagIds, post.id]);
      const tags  = await loaders.loadMany('tag', 'id', pages,tagIds);
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
    post: async (_, args , {models}) => {
      const user = await models.post.findOne({ 
        where:{ id: args.id },
        raw: true,
        benchmark: true,
      })
      return user;
    },//post
    posts: (_, {pages}, {models} , info) => {
      return models.post.findAll({
        ...pages,
        benchmark: true,
      });
    }//posts
  },//Query
  Mutation: {
    newPost: async (_,args ,{models}) => {
      try {
        const post = await models.post.create(
          args,
          {
            include: [{ 
                model: models.tag,
                as:'tags'
            }]
          }
        );
      
        //const tags = await post.getTags()
        //console.log({tags});
        return {post};

      }catch(err){
        console.error(err);
      }  
    }//newPost
  }//Mutation
}