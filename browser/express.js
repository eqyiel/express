/**
 * @format
 */

const { EventEmitter } = require('events');
const mixin = require('merge-descriptors');
const proto = require('./application');

function createApplication() {
  const app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  app.init();
  return app;
}

module.exports = createApplication;
exports = module.exports;
