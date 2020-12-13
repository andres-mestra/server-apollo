import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { AuthenticationError } from 'apollo-server-express';


export const createToken = (userUid, role, secret) => {
  const token =  jwt.sign(
    {
      userUid: userUid,
      role: role
    },
    secret,
    { expiresIn: '15d' }
  );
  return token;
};


export const refreshToken = async ( token, models, secret) => {
  let uid = '';
  try {
    
    uid = jwt.decode(token).userUid;
    
  } catch (error) {
    throw new AuthenticationError('Token no valido.');
  }

  if (!uid) return '';

  const user = await models.user.findOne({ where: { uid }, raw: true });
  if(!user) return '';

  const newtoken = await createToken(user.uid, user.role, secret);
  return newtoken;
}

export const userResgister = async (username, email, password, models, secret) => {
  const hashPassword =  await argon2.hash(password)
  try {
    const user = await models.user.create({
      username: username,
      email: email,
      password: hashPassword
    })

    const token = await createToken(user.uid, user.role, secret);
    return {
      user,
      token
    }

  } catch ( {errors} ) {
    throw new AuthenticationError(errors[0].message);
  }
}

export const tryLogin = async (email, password, models, secret) => {
  //raw: es para indicarle a sequelize que retorne los datos sin procesar, puesto
  //que sequelize cuando ejecutamos a busqueda crea funciones  para eliminar o actualizar 
  //con el fin de optimizar si luego vamos a realizar alguna acción   con lo obtenido
  const user = await models.user.findOne({ where: { email }, raw: true });
  if (!user) {
    throw new AuthenticationError('No se encontro el usuario.');
  }
  const valid = await argon2.verify(user.password, password);
  if (!valid) {
    throw new AuthenticationError('Contraseña incorrecta.');
  }

  const token = await createToken(user.uid, user.role, secret);
  return {
    user,
    token,
  };
};


