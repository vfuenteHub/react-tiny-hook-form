'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/cjs/react-tiny-hook-form.production.min.js');
} else {
  module.exports = require('./dist/cjs/react-tiny-hook-form.development.js');
}
