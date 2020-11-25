import DataLoader from 'dataloader';
import models from '../db/models'

async function buscar(modelName, clave ,keys, limit = 5, order = 'DESC'){
  const results = await models[modelName].findAll({
    where: {[clave]: keys},
    order:[['id', order ]],
    limit: limit*keys.length,
    benchmark: true,
  })

  return results;
}
const posts = () => {
  return new DataLoader(async (keys) => {
    let results = await buscar('post','authorId', keys);

    let resultsMap = keys.reduce((o, key) => Object.assign(o, {[key]: []}), {})
    keys.forEach(key => {
      results.forEach(result => {
        if(result.authorId == key) resultsMap[key].push(result)
      });
    })

    return keys.map(key => resultsMap[key]);
  });

}

export default {
  posts: posts
}
