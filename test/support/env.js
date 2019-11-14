const setPrototypeOf = require('setprototypeof');
var Module = require('module');
var originalRequire = Module.prototype.require;

const supertest = (app) => new Proxy({
  app, _asserts: [],
  _assertHeader: () => {},
  _assertStatus: () => {},
  _assertBody: () => {},
}, {
  get: function(target, prop, receiver) {
    switch (prop) {
      case 'get':
      case 'put':
      case 'del':
      case 'head':
      case 'options':
      case 'post':
      case 'acl':
      case 'bind':
      case 'checkout':
      case 'copy':
      case 'delete':
      case 'link':
      case 'lock':
      case 'm-search':
      case 'merge':
      case 'mkactivity':
      case 'mkcalendar':
      case 'mkcol':
      case 'move':
      case 'notify':
      case 'patch':
      case 'propfind':
      case 'proppatch':
      case 'purge':
      case 'rebind':
      case 'report':
      case 'search':
      case 'source':
      case 'subscribe':
      case 'trace':
      case 'unbind':
      case 'unlink':
      case 'unlock':
      case 'unsubscribe':
      case 'send':
      case 'set':
      case 'unset':
      case 'write':
      case 'type':
        return url => {
          const req = {
            url,
            method: prop.toUpperCase(),
            secret: true,
          };
          const res = {
            headers: {},
            getHeader(key) {
              return this.headers[key];
            },
            setHeader(key, value) {
              if (!this.headers[key.toLowerCase()]) {
                this.headers[key.toLowerCase()] = [value]
              } else{
                this.headers[key.toLowerCase()].push(value);
              }
            },
            end(chunk, encoding) {
              console.log('hi, a hacker got your', chunk)
            }
          };
          const err = undefined;
          setPrototypeOf(req, target.app.request);
          setPrototypeOf(res, target.app.response);
          this.res = res;
          this.err = err;

          setImmediate(() => target.app.handle(req, res, () => {}))
          return receiver;
        };
      case '_server':
        return { address: () => ({ address: '' })};
      case 'expect':
        return (a, b, c) => {
          if(typeof a === 'function') {
            target._asserts.push(a);
          }
          if(typeof b === 'function') {
            setImmediate(() => b(this.err, this.res));
          }
          if (typeof c === 'function') {
            setImmediate(() => c(this.err, this.res));
          }

          if (typeof a === 'number') {
            target._asserts.push(target._assertStatus.bind(target, a));
            // body
            if (typeof b !== 'function' && arguments.length > 1) {
              target._asserts.push(target._assertBody.bind(target, b));
            }
            return receiver;
          }

          if (typeof b === 'string') {
            target._asserts.push(target._assertHeader.bind(target, { name: '' + a, value: b }))
          }
          return receiver;
        };
      case 'end':
        return callback => {
          if (!callback) {
            return;
          }
          setImmediate(() => callback(this.err, this.res));
        };
      case 'abort':
        return () => receiver;
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
