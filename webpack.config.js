const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webConfig = require('./config/web-config');
const serverConfig = require('./config/server-config');

const webpackConfig = {
  debug: serverConfig.DEBUG,
  devtool: serverConfig.DEBUG ? 'cheap-module-eval-source-map' : 'source-map',
  entry: ['./src/web/main.js'],
  output: {
    path: path.resolve(__dirname, './src/server/public'),
    publicPath: serverConfig.HOT ? `http://${serverConfig.HOSTNAME}:${serverConfig.PROXY_PORT}/public/` : '/public/',
    // publicPath: '/public/',
    filename: serverConfig.DEBUG ? '[name].js' : '[name].[hash].js',
    chunkFileName: '[id].js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: __dirname,
      exclude: /node_modules/,
      loader: 'babel',
    }, {
      test: /\.scss$/,
      include: __dirname,
      exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap'),
    }, {
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.(png|jpe?g|gif|svg)$/,
      include: __dirname,
      exclude: /node_modules/,
      loaders: ['file', 'image-webpack'],
    }],
  },
  plugins: [
    new ExtractTextPlugin('main.css', { allChunks: true }),
    new HtmlWebpackPlugin({
      template: './src/web/index.html.tmpl',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(webConfig),
    }),
    new webpack.NoErrorsPlugin(),
  ],
};

if (serverConfig.HOT) {
  webpackConfig.entry.unshift('webpack-hot-middleware/client');
  webpackConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin());
}

if (serverConfig.NODE_ENV === 'production') {
  webpackConfig.plugins.unshift(new webpack.optimize.DedupePlugin());
  webpackConfig.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      pure_getters: true,
      screw_ie8: true,
      warnings: false,
    },
  }));
}

module.exports = webpackConfig;
