'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
     models.tag.belongsToMany(models.post, {
      as:'posts',
      through: 'postags'
     });
    }
  };
  Tag.init({
    uid:{
      type:DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug:{
      type: DataTypes.STRING,
      set(val){
        this.setDataValue('slug', this.name.replace(/\s/g, "-"))
      }
    },
  }, {
    sequelize,
    modelName: 'tag',
  });
  return Tag;
};