import { errors } from '../../util/errors';
module.exports = {
  /*Post:{
    tags: async (post, args)=>{
      console.log(post)
      return [{name:'test'}]
    }
  },*/ 
  Query: {
    posts: (_,args, {models} , info) => {
      return models.post.findAll({
        order:[['id','DESC']],
        include: [{ 
          model: models.tag,
          as:'tags'
        }]
      });
    }
  },
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
      
    }
  }
}