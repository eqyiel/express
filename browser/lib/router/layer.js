module.exports = Layer;
const debug = require('debug')('express:browser-router:layer');
const pathRegexp = require('path-to-regexp');

function Layer(path, options, fn) {
  if (!(this instanceof Layer)) {
    return new Layer(path, options, fn);
  }

  debug('new %o', path);
  const opts = options || {};

  this.handle = fn;
  this.name = fn.name || '<anonymous>';
  this.params = undefined;
  this.path = undefined;
  this.regexp = pathRegexp(path, this.keys = [], opts);

  // set fast path flags
  this.regexp.fast_star = path === '*';
  this.regexp.fast_slash = path === '/' && opts.end === false
}
