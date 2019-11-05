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
        return url => {
          const req = {
            url,
          };
          target.app.handle(req, {}, () => {});
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
    console.log('supertest')
    return supertest;
  }
  //do your thing here
  return originalRequire.apply(this, arguments);
};

process.env.NODE_ENV = 'test';
process.env.NO_DEPRECATION = 'body-parser,express';
