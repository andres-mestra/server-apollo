import DataLoader from 'dataloader';
import models from '../db/models';
class Cargador {
  constructor(){
    this.loaders = {};
  }

  async find(model, fkey,  keys, pages, attributes){
     pages.limit = pages.limit ? pages.limit*keys.length : 5*keys.length;
   
    //Nos aseguranos que attributes contenga la clave foranea
    if(attributes) attributes =  [...new Set([...attributes, fkey])]; 

    const results = await models[model].findAll({
      where: {[fkey]: keys},
      benchmark: true,
      attributes,
      ...pages
    })
    return results;
  }//find
  
  /**
   * Busca la Instancia del Loader y ejecuta el metodo load de dataloader 
   * @param {string} nameLoader - Nombre de la instancia de dataloader 
   * @param {string} model - Nombre del modelo de la db 
   * @param {string} fkey - Clave por la cual se buscara 
   * @param {Object} pages - Estructura de paginaciรณn de acuerdo a Sequelize.js
   * @param {*} key - Clave de busqueda  
   * @param {String[]} attributes - Attributes que se  retornaran
   */
  load(nameLoader,model,fkey,pages,key,attributes) {
    const loader = this.findLoader(nameLoader,model,fkey,pages,attributes);
    return loader.load(key)
  }//load

  loadMany(nameLoader,model,fkey,pages,keys,attributes){
    const loader = this.findLoader(nameLoader,model,fkey,pages,attributes);
    return loader.loadMany(keys);
  }//loadMany
  
  /**
   * Crea instancia de dataloader
   * @param {string} nameLoader - Nombre de la instancia de dataloader 
   * @param {string} model - Nombre del modelo de la db 
   * @param {string} fkey - Clave por la cual se buscara 
   * @param {Object} pages - Estructura de paginaciรณn de acuerdo a Sequelize.js
   * @param {String[]} attributes - Attributes que se  retornaran
   */
  findLoader(nameLoader,model,fkey,pages,attributes) {
    if(!this.loaders[nameLoader]){
      this.loaders[nameLoader] = new DataLoader(async (keys) => {
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
    return this.loaders[nameLoader];
  }//findLoader
}//Cargador

export default  Cargador;
