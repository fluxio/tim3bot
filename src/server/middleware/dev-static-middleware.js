const path = require('path');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../../../webpack.config');
const config = require('../../../config/server-config');

const compiler = webpack(webpackConfig);
const indexFilename = path.join(compiler.outputPath, 'index.html');

const applyWebpackDevMiddleware = webpackDevMiddleware(compiler, {
  inline: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
  stats: {
    colors: true,
  },
});

const applyWebpackHotMiddleware = webpackHotMiddleware(compiler);

function staticMiddleware() {
  return (req, res, next) => {
    applyWebpackDevMiddleware(req, res, () => {
      if (config.HOT) {
        applyWebpackHotMiddleware(req, res, next);
      } else {
        next();
      }
    });
  };
}

function indexMiddleware() {
  return (req, res, next) => {
    if (!req.is('json')) {
      compiler.outputFileSystem.readFile(indexFilename, (err, result) => {
        if (err) {
          next(err);
        } else {
          res.set('content-type', 'text/html');
          res.send(result);
        }
      });
    }
  };
}

module.exports = {
  staticMiddleware,
  indexMiddleware,
};
