const express = require('express');
const validate = require('express-validation');
const Joi = require('joi');

const APIError = __require('utils/APIError');
const { authorize, ADMIN, LOGGED_USER } = __require('middlewares/auth');
const Folder = require('./model');
const validation = __require('utils/validation')

const router = express.Router();


router
  .route("/folder")
  .post(
    authorize(LOGGED_USER),
    validate({
      body: {
        idUser: Joi.string()
          .regex(validation.primaryKey.regex)
          .required(),
        name: Joi.string()
          .min(validation.name.minLength)
          .max(validation.name.maxLength)
          .required()
      }
    }),
    async (req, res, next) => {
      try {

        const folder = new Folder(req.body);
        const folderSaved = await folder.save();

        
        return res.status(201).json(folderSaved.toObject());
      } catch (error) {
        return next(error);
      }
    }
  );

router
  .route("/folder/:idFolder")
  .get(
    authorize(LOGGED_USER),
    validate({
      params: {
        idFolder: Joi.string()
          .regex(validation.primaryKey.regex)
          .required(),
      }
    }),
    async (req, res, next) => {

      try {

        const folder = await Folder.findById(req.params.idFolder);
        const isAuthorized = folder.idUser === req.user._id.toString();

        console.log('folder.idUser', folder.idUser)
        console.log('req.user._id.toString()', req.user._id.toString())


        if (!isAuthorized) throw new APIError({
          message: "Unauthorized",
          status: 401
        })

        else return res.status(200).json(folder.toObject());
      } catch (error) {
        return next(error);
      }
    }
  );

module.exports = router;
