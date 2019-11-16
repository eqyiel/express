const setPrototypeOf = require('setprototypeof');
const superTest = require('supertest/lib/test.js');

var Module = require('module');
var originalRequire = Module.prototype.require;

const supertest = (app) => {

  const _asserts = [];
  const _assertHeader = superTest.prototype._assertHeader;
  const _assertStatus = superTest.prototype._assertStatus;
  const _assertBody = superTest.prototype._assertBody;
  const _assertFunction = superTest.prototype._assertFunction;

  let endCallback;
  let ended = false;

  const req = {
    headers: {},
    secret: true,
    socket: { destroy: () => {} },
  };

  const res = {
    body: undefined,
    text: undefined,
    status: undefined,
    statusCode: undefined,
    statusMessage: undefined,
    headers: {},
    headersSent: false,
    getHeader(key) {
      return this.headers[key];
    },
    setHeader(key, value) {
      if (!this.headers[key.toLowerCase()]) {
        this.headers[key.toLowerCase()] = [value]
      } else{
        this.headers[key.toLowerCase()].push(value);
      }
      console.log(this.headers)
    },
    end(chunk, _encoding) {
      this.headersSent = true;

      console.log('hi, a hacker got your', chunk)

      this.body = chunk;

      if (typeof this.body === 'string') {
        this.text = this.body;
      }

      if (typeof this.statusCode === number && typeof this.statusMessage === 'string') {
        this.status = `${this.statusCode} ${this.statusMessage}`;
      }

      assert(null, this, endCallback);
    },
  };

  const err = undefined;

  setPrototypeOf(req, app.request);
  setPrototypeOf(res, app.response);

  const assert = (err, res, fn) => {
    let error;
    let i;

    for (i = 0; i < _asserts.length && !error; i += 1) {
      error = _assertFunction(_asserts[i], res);
    }

    fn.call(proxy, error || null, res);
  }

  const proxy = new Proxy({
    app,
  }, {
    get: function(target, prop, receiver) {
      switch (prop) {
        case 'acl':
        case 'bind':
        case 'checkout':
        case 'connect':
        case 'copy':
        case 'del':
        case 'delete': //        same as 'del'?
        case 'get':
        case 'head':
        case 'link':
        case 'lock':
        case 'm-search':
        case 'merge':
        case 'mkactivity':
        case 'mkcalendar':
        case 'mkcol':
        case 'move':
        case 'notify':
        case 'options':
        case 'patch':
        case 'post':
        case 'propfind':
        case 'proppatch':
        case 'purge':
        case 'put':
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
          return url => {
            req.method = prop.toUpperCase();
            req.url = url;
            return receiver;
          };
        case '_server':
          return { address: () => ({ address: '' })};
        case 'send':
          return (body) => {
            req.body = body;
            return receiver;
          }
        case 'unset':{
          return (key) => {
            delete req.headers[key.toLowerCase()];
            return receiver;
          }
        }
        case 'write': {
          return (data, encoding) => {
            // I don't think we can support partial writes
            return receiver;
          }
        }
        case 'type': {
          return (value) => receiver.set('Content-Type', value)
        }
        case 'set':
          return (a, b) => {
            res.setHeader(a, b);
            return receiver;
          };
        case 'expect':
          return (a, b, c) => {
            if(typeof a === 'function') {
              _asserts.push(a);
              return receiver;
            }
            if(typeof b === 'function') {
              receiver.end(b);
            }
            if (typeof c === 'function') {
              receiver.end(c);
            }

            if (typeof a === 'number') {
              _asserts.push(_assertStatus.bind(receiver, a));
              if (typeof b !== 'function' && arguments.length > 1) {
                _asserts.push(_assertBody.bind(receiver, b));
              }
              return receiver;
            }

            if (typeof b === 'string' || typeof b === 'number' || b instanceof RegExp) {
              _asserts.push(_assertHeader.bind(target, { name: '' + a, value: b }));
              return receiver;
            }

            _asserts.push(_assertBody.bind(receiver, a))

            return receiver;
          };
        case 'end':
          return callback => {
            endCallback = callback;
            setImmediate(() => app.handle(req, res));
          };
        case 'abort':
          return () => receiver;
        default:
          throw new Error(prop);
      }
      return () => receiver;
    }
  });

  return proxy;
};

Module.prototype.require = function(){
  if(arguments[0] === 'supertest') {
    return supertest;
  }
  //do your thing here
  return originalRequire.apply(this, arguments);
};

process.env.NODE_ENV = 'test';
process.env.NO_DEPRECATION = 'body-parser,express';
