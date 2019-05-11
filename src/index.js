// enables absolute imports
// https://www.npmjs.com/package/absolute-require
require('absolute-require')(__dirname, '__require')

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = __require('config/vars');
const app = __require('config/express');
const mongoose = __require('config/mongoose');

// open mongoose connection
mongoose.connect();

// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
