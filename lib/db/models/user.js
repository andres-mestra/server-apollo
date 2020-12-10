'use strict';
import slug from '../../util/slug';

const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.user.hasMany(models.post,{
        foreignKey: {
          name:'authorId'
        }
      })
    }
  };
  User.init({
    uid:{
      type:DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "El name solo debe tener letras o numeros"
        },
        len: {
          args: [4, 20],
          msg: "El name debe tener de 4 a 20 carapteres"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "El email es invalido"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'NORMAL', 'EDITOR'),
      defaultValue: 'NORMAL',
    },
    avatar:{
      type: DataTypes.STRING,
      allowNull:true
    },
    slug:{
      type: DataTypes.STRING,
      unique:true,
    },
    bio: {
      type:DataTypes.TEXT,
      allowNull:true,
    },
    coverImage: {
      type:DataTypes.STRING,
      allowNull:true,
    },
    facebook: {
      type:DataTypes.STRING,
      allowNull:true,
    },
    twitter: {
      type:DataTypes.STRING,
      allowNull:true,
    },
    createdAt: DataTypes.DATE,
    updatedAt:DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'user',
    hooks: {
      beforeCreate: (user, options) => {
        const transUser = user;
        transUser.slug = user.slug ? slug(user.slug) : user.username;
        return transUser;
      }
    }
  });
  return User;
};