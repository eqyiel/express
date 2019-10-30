module.exports = View;

function View(name, options) {
  // const opts = options || {};
  //
  // this.defaultEngine = opts.defaultEngine;
  // // this.ext = extname(name);
  // this.name = name;
  // this.root = opts.root;
  //
  // if (!this.ext && !this.defaultEngine) {
  //   throw new Error('No default engine was specified and no extension was provided.');
  // }
  //
  // let fileName = name;
  //
  // if (!this.ext) {
  //   // get extension from default engine name
  //   this.ext = this.defaultEngine[0] !== '.'
  //     ? `.${  this.defaultEngine}`
  //     : this.defaultEngine;
  //
  //   fileName += this.ext;
  // }
  //
  // if (!opts.engines[this.ext]) {
  //   // load engine
  //   const mod = this.ext.substr(1);
  //   debug('require "%s"', mod);
  //
  //   // default engine export
  //   const fn = require(mod).__express;
  //
  //   if (typeof fn !== 'function') {
  //     throw new Error(`Module "${  mod  }" does not provide a view engine.`)
  //   }
  //
  //   opts.engines[this.ext] = fn;
  // }
  //
  // // store loaded engine
  // this.engine = opts.engines[this.ext];
  //
  // // lookup path
  // this.path = this.lookup(fileName);
}
