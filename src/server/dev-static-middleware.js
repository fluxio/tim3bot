const url = require('url');
const path = require('path');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../../webpack.config');
const config = require('../../config/server-config');

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

function applyIndexMiddleware(req, res, next) {
  if (url.parse(req.url).pathname === '/') {
    compiler.outputFileSystem.readFile(indexFilename, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.set('content-type', 'text/html');
        res.send(result);
      }
    });
  }
}

function devStaticMiddleware() {
  return (req, res, next) => {
    applyWebpackDevMiddleware(req, res, () => {
      if (config.HOT) {
        applyWebpackHotMiddleware(req, res, () => {
          applyIndexMiddleware(req, res, next);
        });
      } else {
        applyIndexMiddleware(req, res, next);
      }
    });
  };
}

module.exports = devStaticMiddleware;
