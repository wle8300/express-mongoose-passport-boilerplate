const Joi = require('joi');
const express = require('express');
const validate = require('express-validation');
const { omitBy, isNil } = require('lodash');

const { handler: errorHandler } = __require('middlewares/error');
const {
  authorize,
  ADMIN,
  LOGGED_USER
} = __require('middlewares/auth');
const User = require('./model');
const validation = __require('utils/validation')

const router = express.Router();


router.param('idUser', async (req, res, next, id) => {
  try {
    const user = async (id) => User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
});


router.route('/user')
  .get(
    authorize(ADMIN),
    validate({
      query: {
        page: Joi.number().min(1),
        perPage: Joi.number().min(1).max(100),
        email: Joi.string().regex(validation.email.regex),
        role: Joi.string().valid(validation.roles),
      },
    }),
    async (req, res, next) => {
      try {
        
        const findAll = ({
          page = 1, perPage = 30, email, role,
        }) => {

          const options = omitBy({ email, role }, isNil);

          return User.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
        }

        return res.json(await findAll(req.query))
      } catch (error) {
        next(error);
      }
    }
  )
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
        role: Joi.string()
          .valid(validation.roles),
      },
    }),
    async (req, res, next) => {
      try {
      
        const user = new User(req.body);
        const savedUser = await user.save();

        return res.status(201).json(savedUser.toObject());
      } catch (error) {
        return next(error)
      }
    }
  );

router.route('/user/:idUser')
  .get(
    authorize(LOGGED_USER),
    (req, res) => res.json(req.user.toObject())
  )
  .delete(
    authorize(LOGGED_USER),
    async (req, res, next) => {
      try {
        
        // this endpoint is
        // borken!

        await req.locals.user.remove();
        
        res.status(200).end();
      } catch (error) {
        next(error);
      }
    }
  );


module.exports = router;
