'use strict';
import slug from '../../util/slug';

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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    slug:{
      type: DataTypes.STRING,
      unique:true,
    },
  }, {
    sequelize,
    modelName: 'tag',
    hooks: {
      beforeCreate: (tag, options) => {
        const transTag = tag;
        transTag.slug = tag.slug ? slug(tag.slug) : slug(tag.name);
        return transTag;
      }
    }
  });
  return Tag;
};