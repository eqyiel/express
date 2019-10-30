const res = {};

res.get = function(field){
  return this.getHeader(field);
};

module.exports = res;
