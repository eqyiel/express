const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './',
  plugins: [new BundleAnalyzerPlugin()],
  watch: true,
};
