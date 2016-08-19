const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const values = require('postcss-modules-values');

const webConfig = require('./config/web-config');
const serverConfig = require('./config/server-config');

const styleLoaders = [
  'style',
  'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&postcss',
  'sass?sourceMap',
];

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
      exclude: /node_modules(?!\/normalize)/,
      loaders: serverConfig.DEBUG ? styleLoaders : [ExtractTextPlugin.extract(styleLoaders)],
    }, {
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.(png|jpe?g|gif)$/,
      include: __dirname,
      exclude: /node_modules/,
      loaders: ['file', 'image-webpack'],
    }, {
      test: /\.svg$/,
      include: [__dirname, path.resolve(__dirname, 'assets')],
      exclude: /node_modules/,
      loader: 'babel!react-svg',
    }],
  },
  postcss: [
    values,
  ],
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
