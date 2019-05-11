const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = __require('utils/APIError');
const validation = __require('utils/validation')

const FolderSchema = new mongoose.Schema({
  idUser: {
    type: String,
    match: validation.primaryKey.regex,
    required: true,
    index: true,
    trim: true,
  },
  name: {
    type: String,
    minlength: validation.name.minLength,
    maxlength: validation.name.maxLength,
    required: true,
    trim: true,
  },
}, {
  collection: 'Folder',
  timestamps: true,
});

module.exports = mongoose.model('Folder', FolderSchema);
