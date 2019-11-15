/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var bodyParser = {
  json: (arg) => {
    if (arg && arg.verify) {
      if (typeof arg.verify !== 'function') {
        throw new TypeError('option verify must be function')
      }
    }
    return () => {};
    },
  raw: (arg) => {
    if (arg && arg.verify) {
      if (typeof arg.verify !== 'function') {
        throw new TypeError('option verify must be function')
      }
    }
    return () => {};
  },
  text: (arg) => {
    if (arg && arg.verify) {
      if (typeof arg.verify !== 'function') {
        throw new TypeError('option verify must be function')
      }
    }
    return () => {};
  },
  urlencoded: (arg) => {
    if (arg) {
      if (arg.parameterLimit !== undefined) {
        if ((typeof arg.parameterLimit === 'number' && arg.parameterLimit < 1) || (typeof arg.parameterLimit === 'string')) {
          throw new TypeError('TypeError: option parameterLimit must be a positive number')
        }
      }
      if (arg.verify && typeof arg.verify !== 'function') {
        throw new TypeError('option verify must be function')
      }
    }
    return () => {};
  },
};
var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('./application');
var Route = require('./router/route');
var Router = require('./router');
var req = require('./request');
var res = require('./response');

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;
}

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req;
exports.response = res;
exports.bind = (a, b) => b;

/**
 * Expose constructors.
 */

exports.Route = Route;
exports.Router = Router;

/**
 * Expose middleware
 */

exports.json = bodyParser.json
exports.query = require('./middleware/query');
exports.raw = bodyParser.raw
exports.static = (a, b) => {
  if (!a && !b) {
    throw new Error('root path required')
  } else if (!b && typeof a === 'number') {
    throw new Error('root path string')
  }
  if (b && b.setHeaders) {
    if (typeof b.setHeaders !== 'function') {
      throw new Error('setHeaders function')
    }
  }
  return () => {};
};
exports.text = bodyParser.text
exports.urlencoded = bodyParser.urlencoded

/**
 * Replace removed middleware with an appropriate error message.
 */

var removedMiddlewares = [
  'bodyParser',
  'compress',
  'cookieSession',
  'session',
  'logger',
  'cookieParser',
  'favicon',
  'responseTime',
  'errorHandler',
  'timeout',
  'methodOverride',
  'vhost',
  'csrf',
  'directory',
  'limit',
  'multipart',
  'staticCache'
]

removedMiddlewares.forEach(function (name) {
  Object.defineProperty(exports, name, {
    get: function () {
      throw new Error('Most middleware (like ' + name + ') is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.');
    },
    configurable: true
  });
});
