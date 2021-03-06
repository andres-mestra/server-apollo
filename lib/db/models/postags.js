'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PosTags extends Model {
    static associate(models) {

    }
  };
  PosTags.init({
    id:{
      primaryKey:true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    tagId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tags', 
        key: 'id'
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'posts',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'postags',
  });
  return PosTags;
};