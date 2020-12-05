import DataLoader from 'dataloader';
import models from '../db/models';
class Cargador {
  constructor(){
    this.loaders = {};
  }

  async find(model, fkey,  keys, pages, attributes){
    let page = {};
    if(pages){
      page = {...pages }
      page.limit = pages.limit ? pages.limit*keys.length : 10*keys.length;
    }
    //Nos aseguranos que attributes contenga la clave foranea
    if(attributes) attributes =  [...new Set([...attributes, fkey])]; 

    const results = await models[model].findAll({
      where: {[fkey]: keys},
      benchmark: true,
      attributes,
      ...page
    })
    return results;
  }//find

  load(model,fkey,pages,key,attributes) {
    const loader = this.findLoader(model,fkey,pages,attributes);
    return loader.load(key)
  }//load

  loadMany(model,fkey,pages,keys,attributes){
    const loader = this.findLoader(model,fkey,pages,attributes);
    return loader.loadMany(keys);
  }//loadMany
  findLoader(model,fkey,pages,attributes) {
    if(!this.loaders[model]){
      this.loaders[model] = new DataLoader(async (keys) => {
        let results = await this.find(model,fkey, keys, pages,attributes);
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
