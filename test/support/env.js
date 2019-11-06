const setPrototypeOf = require('setprototypeof');
var Module = require('module');
var originalRequire = Module.prototype.require;

const supertest = (app) => new Proxy({
  app, _asserts: []
}, {
  get: function(target, prop, receiver) {
    switch (prop) {
      case 'get':
      case 'put':
      case 'del':
      case 'head':
        return url => {
          const req = {
            url,
            method: prop.toUpperCase(),
          };
          const res = {
            headers: {},
            getHeader(key) {
              return this.headers[key];
            },
            setHeader(key, value) {
              this.headers[key] = value;
            },
            end(chunk, encoding) {
              console.log('hi, a hacker got your', chunk)
            }
          };
          setPrototypeOf(req, target.app.request);
          setPrototypeOf(res, target.app.response);

          target.app.handle(req, res, () => {});
          return receiver;
        };
      case 'expect':
        return (a, b, c) => {
          if(typeof a === 'function') {
            target._asserts.push(a);
          }
          if(typeof b === 'function') {
            b();
          }
          return receiver;
        };
      default:
        throw new Error(prop);
    }
    return () => receiver;
  }
});

Module.prototype.require = function(){
  if(arguments[0] === 'supertest') {
    return supertest;
  }
  //do your thing here
  return originalRequire.apply(this, arguments);
};

process.env.NODE_ENV = 'test';
process.env.NO_DEPRECATION = 'body-parser,express';
