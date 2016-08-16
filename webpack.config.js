const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./config/web-config');

const webpackConfig = {
  debug: config.DEBUG,
  devtool: config.DEBUG ? 'cheap-module-eval-source-map' : 'source-map',
  entry: ['./src/web/main.js'],
  output: {
    path: path.resolve(__dirname, './src/server/public'),
    publicPath: config.HOT ? `http://localhost:${config.PORT}/` : '',
    filename: config.DEBUG ? '[name].js' : '[name].[hash].js',
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
      'process.env': JSON.stringify(config),
    }),
    new webpack.NoErrorsPlugin(),
  ],
};

if (config.HOT) {
  webpackConfig.entry.unshift('webpack-hot-middleware/client');
  webpackConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin());
}

if (config.NODE_ENV === 'production') {
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
