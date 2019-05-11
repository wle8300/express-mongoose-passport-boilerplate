const express = require('express');
const validate = require('express-validation');
const moment = require('moment-timezone');
const Joi = require('joi');
const crypto = require('crypto');

const JsonWebToken = require('./model');
const { jwtExpirationInterval } = __require('config/vars');
const User = require('../User/model')
const validation = __require('utils/validation')

const router = express.Router();


function generateTokenResponse(user, accessToken) {

  const tokenType = 'Bearer';
  const generateToken = (user) => {
    const idUser = user._id;
    const userEmail = user.email;
    const token = `${idUser}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(30, 'days').toDate();
    const tokenObject = new JsonWebToken({
      token, idUser, userEmail, expires,
    });
    tokenObject.save();
    return tokenObject;
  }
  const refreshToken = generateToken(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');

  
  return {
    tokenType, accessToken, refreshToken, expiresIn,
  };
}

router
  .route('/jsonwebtoken/')
  .post(
    validate({
      body: {
        email: Joi.string()
          .regex(validation.email.regex)
          .required(),
        password: Joi.string()
          .min(validation.password.minLength)
          .max(validation.password.maxLength)
          .required(),
      },
    }),
    async (req, res, next) => {
      try {

        const { user, accessToken } = await User.findAndGenerateToken(req.body)
        const token = generateTokenResponse(user, accessToken)


        return res
          .status(200)
          .json({
            token: token,
            user: user.toObject()
          })
      } catch (error) {
        return next(error)
      }
    }
  );

router
  .route('/jsonwebtoken/refresh-token')
  .post(
    validate({
      body: {
        email: Joi.string()
          .regex(validation.email.regex)
          .required(),
        refreshToken: Joi.string().required(),
      },
    }),
    async ({ email, refreshToken }) => {
      try {
        const refreshObject = await JsonWebToken.findOneAndRemove({
          userEmail: email,
          token: refreshToken,
        });
        const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
        return generateTokenResponse(user, accessToken);
      } catch (error) {
        throw error;
      }
    }
  );


module.exports = router;
