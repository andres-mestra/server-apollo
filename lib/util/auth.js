import jwt from 'jsonwebtoken';
import argon2 from 'argon2';


export const createToken = async (userUid, secret) => {
  const token = await jwt.sign(
    { userUid: userUid },
    secret,
    { expiresIn: '15d' }
  );
  return token;
};

export const userResgister = async (name, email, password, models, secret) => {
  const hashPassword = await argon2.hash(password)
  try {
    const user = await models.user.create({
      name: name,
      email: email,
      password: hashPassword
    })

    const token = await createToken(user.uid, secret);
    return { 
      user,
      token 
    }

  } catch ({ errors }) {
    return {
      errors: [
        { field: errors[0].path, message: errors[0].message },
      ]
    }
  }
}

export const tryLogin = async (email, password, models, secret) => {
  //raw: es para indicarle a sequelize que retorne los datos sin procesar, puesto
  //que sequelize cuando ejecutamos a busqueda crea funciones  para eliminar o actualizar 
  //con el fin de optimizar si luego vamos a realizar alguna acción   con lo obtenido
  const user = await models.user.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      errors: [
        { field: 'email', message: 'El email no existe' },
      ]
    };
  }
  const valid = await argon2.verify(user.password, password);
  if (!valid) {
    return {
      errors: [
        { field: 'password', message: 'Contraseña incorrecta' },
      ]
    };
  }

  const token = await createToken(user.uid, secret);
  return {
    user,
    token,
  };
};

