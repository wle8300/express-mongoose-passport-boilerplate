const httpStatus = require('http-status');
const passport = require('passport');
const User = __require('api/User/model');
const APIError = require('../utils/APIError');
const validation = __require('utils/validation')

const ADMIN = "admin";
const LOGGED_USER = "_loggedUser";

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : "Authentication Required",
    status: 407,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) throw error;
    await logIn(user, {
      session: false
    });
  } catch (e) {
    return next(apiError);
  }

  // (req.body.idUser && req.body.idUser !== user._id.toString())

  /*
  this should be designed to let
  "admin": do whatevers
  "user": do whatevers to their own data
           (one exception User.role)
  -wle8300
  */
  if (roles === LOGGED_USER) {
    if (
      (user.role !== "admin"
        && req.params.idUser !== user._id.toString())
    ) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = "Forbidden";

      return next(apiError);
    }
  } else if (!roles.includes(user.role)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = "Forbidden";

    return next(apiError);
  } else if (err || !user) return next(apiError);

  req.user = user;

  return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;

exports.authorize = (roles = validation.roles) => (req, res, next) =>
  passport.authenticate(
    "jwt",
    {
      session: false
    },
    handleJWT(req, res, next, roles)
  )(req, res, next);
