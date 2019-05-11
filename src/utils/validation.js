module.exports = {
  email: {
    regex: /^\S+@\S+\.\S+$/,
  },
  password: {
    minLength: 6,
    maxLength: 128,
  },
  primaryKey: {
    regex: /^[a-fA-F0-9]{24}$/,
  },
  name: {
    minLength: 0,
    maxLength: 128,
  },
  roles: ['admin', 'user'],
}