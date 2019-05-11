const mongoose = require('mongoose');
const validation = __require('utils/validation')


const JsonWebTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  idUser: {
    type: String,
    match: validation.primaryKey.regex,
    required: true,
  },
  userEmail: {
    type: 'String',
    ref: 'User',
    required: true,
  },
  expires: { type: Date },
}, {
  collection: 'JsonWebToken',
});


/**
 * @typedef JsonWebToken
 */
module.exports = mongoose.model('JsonWebToken', JsonWebTokenSchema);
