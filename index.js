/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

if (process.env.SHOULD_REPLACE_EXPRESS_DEPENDENCY) {
  module.exports = require('./browser');
} else {
  module.exports = require('./lib/express');
}
