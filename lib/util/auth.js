import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { Errors } from './errors';


export const createToken = async (userUid, role, secret) => {
  const token = await jwt.sign(
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
    return '';
  }

  if (!uid) return '';

  const user = await models.user.findOne({ where: { uid }, raw: true });
  if(!user) return '';

  const newtoken = await createToken(user.uid, user.role, secret);
  return newtoken;
}

export const userResgister = async (username, email, password, models, secret) => {
  const hashPassword = await argon2.hash(password)
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
    return {errors}
  }
}

export const tryLogin = async (email, password, models, secret) => {
  //raw: es para indicarle a sequelize que retorne los datos sin procesar, puesto
  //que sequelize cuando ejecutamos a busqueda crea funciones  para eliminar o actualizar 
  //con el fin de optimizar si luego vamos a realizar alguna acción   con lo obtenido
  const user = await models.user.findOne({ where: { email }, raw: true });
  if (!user) {
    return Errors('email','El email no existe' )
  }
  const valid = await argon2.verify(user.password, password);
  if (!valid) {
    return Errors('password', 'Contraseña incorrecta');
  }

  const token = await createToken(user.uid, user.role, secret);
  return {
    user,
    token,
  };
};


