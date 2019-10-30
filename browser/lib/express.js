/**
 * @format
 */

const { EventEmitter } = require('events');
const mixin = require('merge-descriptors');
const proto = require('./application');
const Route = require('./router/route');
const Router = require('./router');

console.log(Router.prototype.get);
const res = require('./response');

exports = module.exports = createApplication;

function createApplication() {
  const app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  app.init();
  return app;
}

exports.response = res;
exports.Route = Route;
exports.Router = Router;
