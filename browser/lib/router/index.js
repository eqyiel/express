const setPrototypeOf = require('setprototypeof');
const flatten = require('array-flatten');
const debug = require('debug')('express:browser-router');
const Layer = require('./layer');
const Route = require('./route');

const {slice} = Array.prototype;

const proto = module.exports = function(options) {
  const opts = options || {};

  function router(req, res, next) {
    router.handle(req, res, next);
  }

  // mixin Router class functions
  setPrototypeOf(router, proto);

  router.params = {};
  router._params = [];
  router.caseSensitive = opts.caseSensitive;
  router.mergeParams = opts.mergeParams;
  router.strict = opts.strict;
  router.stack = [];

  return router;
};

proto.use = function use(fn) {
  let offset = 0;
  let path = '/';

  // default path to '/'
  // disambiguate router.use([fn])
  if (typeof fn !== 'function') {
    let arg = fn;

    while (Array.isArray(arg) && arg.length !== 0) {
      arg = arg[0];
    }

    // first arg is the path
    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }

  const callbacks = flatten(slice.call(arguments, offset));

  if (callbacks.length === 0) {
    throw new TypeError('Router.use() requires a middleware function')
  }

  for (let i = 0; i < callbacks.length; i++) {
    const fn = callbacks[i];

    if (typeof fn !== 'function') {
      throw new TypeError(`Router.use() requires a middleware function but got a ${  gettype(fn)}`)
    }

    // add the middleware
    debug('use %o %s', path, fn.name || '<anonymous>');

    const layer = new Layer(path, {
      sensitive: this.caseSensitive,
      strict: false,
      end: false
    }, fn);

    layer.route = undefined;

    this.stack.push(layer);
  }

  return this;
};

proto.route = function route(path) {
  const route = new Route(path);

  const layer = new Layer(path, {
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  }, route.dispatch.bind(route));

  layer.route = route;

  this.stack.push(layer);
  return route;
};
