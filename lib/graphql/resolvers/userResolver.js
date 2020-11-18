import { tryLogin, userResgister } from '../../util/auth';

module.exports = {
  Query: {
    users: async (_,args,{models}) => {
      return models.user.findAll();
    }
  },
  Mutation: {
    register: async (_,{name, email, password},{models, secret}) => 
      userResgister(name, email, password, models, secret),
    login: async (_,{email, password},{models, secret}) => 
      tryLogin(email, password,models,secret ), 
  }
}