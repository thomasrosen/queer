var yamlLint = require('yaml-lint');

module.exports = function (source) {
  if (this.cacheable) this.cacheable();
  var callback = this.async();

  yamlLint.lint(source).then(() => {
    callback(null, source);
  }).catch((error) => {
    callback(error);
  });
};
