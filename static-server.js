const path = require('path');

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./config/server-config');
const webpackConfig = require('./webpack.config');

const app = express();

if (!config.DEBUG) {
  throw new Error('Static server should not be run in production');
}

const compiler = webpack(webpackConfig);
const indexFilename = path.join(compiler.outputPath, 'index.html');

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(webpackHotMiddleware(compiler));

app.use((req, res, next) => {
  compiler.outputFileSystem.readFile(indexFilename, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.set('content-type', 'text/html');
      res.send(result);
    }
  });
});

module.exports = app;
