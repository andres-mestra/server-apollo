'use strict';
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
      set(val){
        console.log('dentro')
        this.setDataValue('slug', this.title.replace(/\s/g, "-"))
      }
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
  });
  return Post;
};