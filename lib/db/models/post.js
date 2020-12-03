'use strict';
import slug from '../../util/slug';

const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      models.post.belongsToMany(models.tag, {
        as:'tags',
        through: 'postags'
      });
    }
  };

  Post.init({
    uid:{
      type:DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM('PUBLICADO', 'EDICION', 'NOPUBLICADO'),
      defaultValue: 'EDICION',
    },
    image:{
      type: DataTypes.STRING,
      allowNull:true
    },
    slug:{
      type: DataTypes.STRING,
      unique:true,
    },
    description: {
      type:DataTypes.TEXT,
      allowNull:true,
    },
    createdAt: DataTypes.DATE,
    updatedAt:DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'post',
    hooks: {
      beforeCreate: (post, options) => {
        const transPost = post;
        transPost.slug = post.slug ? slug(post.slug,true) : slug(post.title,true);
        return transPost;
      }
    }
  });

  return Post;
};