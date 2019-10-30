const debug = require('debug')('express:browser-router');
const methods = require('methods');

console.log(methods);
const flatten = require('array-flatten');
const Layer = require('./layer');

module.exports = Route;

const {slice} = Array.prototype;

function Route(path) {
  this.path = path;
  this.stack = [];

  debug('new %o', path);

  // route handlers for letious http methods
  this.methods = {};
}

Route.prototype.dispatch = function dispatch(req, res, done) {
  let idx = 0;
  const {stack} = this;
  if (stack.length === 0) {
    return done();
  }

  let method = req.method.toLowerCase();
  if (method === 'head' && !this.methods.head) {
    method = 'get';
  }

  req.route = this;

  next();

  function next(err) {
    // signal to exit route
    if (err && err === 'route') {
      return done();
    }

    // signal to exit router
    if (err && err === 'router') {
      return done(err)
    }

    const layer = stack[idx++];
    if (!layer) {
      return done(err);
    }

    if (layer.method && layer.method !== method) {
      return next(err);
    }

    if (err) {
      layer.handle_error(err, req, res, next);
    } else {
      layer.handle_request(req, res, next);
    }
  }
};

methods.forEach(function(method){
  Route.prototype[method] = function(){
    console.log(method);
    const handles = flatten(slice.call(arguments));
    console.log(arguments);

    for (let i = 0; i < handles.length; i++) {
      const handle = handles[i];

      if (typeof handle !== 'function') {
        const type = toString.call(handle);
        const msg = `Route.${  method  }() requires a callback function but got a ${  type}`
        throw new Error(msg);
      }

      debug('%s %o', method, this.path)

      const layer = Layer('/', {}, handle);
      layer.method = method;

      this.methods[method] = true;
      this.stack.push(layer);
    }

    return this;
  };
  console.log(Route.prototype.get);
});
