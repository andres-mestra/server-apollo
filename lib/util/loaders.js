import DataLoader from 'dataloader';
import models from '../db/models'


async function buscar(modelName, clave ,keys, limit = 10, order = 'DESC'){
  const results = await models[modelName].findAll({
    where: {[clave]: keys},
    order:[['id', order ]],
    limit: limit*keys.length,
    benchmark: true,
  })

  return results;
}


const posts = new DataLoader(async (keys) => {
  let results = await buscar('post','authorId', keys);
  let resultsMap = keys.reduce((o, key) => Object.assign(o, {[key]: []}), {})
  keys.forEach(key => {
    results.forEach(result => {
      if(result.authorId == key) resultsMap[key].push(result)
    });
  })

  return keys.map(key => resultsMap[key]);
},{})

const test = new DataLoader(async (keys) =>{
  console.log({keys})
  return keys;
})

export default {
  posts,
  test,
  //paginacion,
  //expe: expe(),
}  



/*function expe(){
  return new DataLoader(async (keys) =>{
    var result = Promise.all([
      posts().load(keys[0]),
      posts().load(keys[1]),
      posts().load(keys[2]),
    ])
    
    let resultsMap = keys.reduce((o, key) => Object.assign(o, {[key]: []}), {})

    return keys
  })
}

export default {
  posts: posts(),
  expe: expe(),
}*/

