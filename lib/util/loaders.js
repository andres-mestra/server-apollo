import DataLoader from 'dataloader';
import models from '../db/models';
class Cargador {
  constructor(){
    this.loaders = {};
  }

  async find(model, fkey ,keys, pages){
    let page = {};
    if(pages){
      page = {...pages }
      page.limit = pages.limit ? pages.limit*keys.length : 10*keys.length;
      //console.log({p})
    }
    const results = await models[model].findAll({
      where: {[fkey]: keys},
      benchmark: true,
      ...page
    })
    return results;
  }//find

  load(model,fkey,pages,key) {
    const loader = this.findLoader(model,fkey,pages);
    return loader.load(key)
  }//load

  loadMany(model,fkey,pages,keys){
    const loader = this.findLoader(model,fkey,pages);
    return loader.loadMany(keys);
  }//loadMany
  findLoader(model,fkey, pages) {
    if(!this.loaders[model]){
      this.loaders[model] = new DataLoader(async (keys) => {
        let results = await this.find(model,fkey, keys, pages);
        let resultsMap = keys.reduce((o, key) => Object.assign(o, {[key]: []}), {})
        keys.forEach(key => {
          results.forEach(result => {
            if(result[fkey] == key) resultsMap[key].push(result)
          });
        })
        return keys.map(key => resultsMap[key]);
      })
    }  
    return this.loaders[model];
  }//findLoader
}//Cargador

export default  Cargador;
