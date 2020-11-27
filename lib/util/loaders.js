import DataLoader from 'dataloader';
import models from '../db/models'

class Cargador {
  constructor(){
    this.loaders = {};
  }

  async find(model, fkey ,keys, limit = 10, order = 'DESC'){
    const results = await models[model].findAll({
      where: {[fkey]: keys},
      order:[['id', order ]],
      limit: limit*keys.length,
      benchmark: true,
    })
    return results;
  }

  load(model,fkey,pages,key) {
    const loader = this.findLoader(model,fkey,pages);
    return loader.load(key)
  }
  findLoader(model,fkey, pages) {
    if(!this.loaders[model]){
      this.loaders[model] = new DataLoader(async (keys) => {
        let results = await this.find(model,fkey, keys, pages?.limit, pages?.order);
        let resultsMap = keys.reduce((o, key) => Object.assign(o, {[key]: []}), {})
        keys.forEach(key => {
          results.forEach(result => {
            if(result.authorId == key) resultsMap[key].push(result)
          });
        })
        return keys.map(key => resultsMap[key]);
      })
    }  
    return this.loaders[model];
  }
}

export default  Cargador;

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

/* export default {
  posts,
  test,
  //paginacion,
  //expe: expe(),
}   */



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

