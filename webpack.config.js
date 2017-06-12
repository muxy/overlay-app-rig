const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const _ = require('lodash');
const AppConfig = require('./src/config.json');

const port = process.env.PORT || 9000;

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  devtool: 'inline-source-map',

  entry: {
    rig: './lib/rig/index.js',
    config: './lib/config/index.js',
    live: './lib/live/index.js',
    viewer: './lib/viewer/index.js'
  },

  output: {
    filename: '[name].js',
    path: resolve('dist'),
    publicPath: './'
  },

  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    enforceExtension: false,
    modules: [resolve('src'), 'node_modules'],
    alias: {
      '@': resolve('lib'),
      vue$: 'vue/dist/vue.esm.js',
      shared: resolve('lib/shared'),
      src: resolve('lib'),
      app: resolve('src'),
      manifest$: resolve('manifest.json')
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['rig'],
      template: 'lib/rig/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'config.html',
      chunks: ['config'],
      template: 'lib/config/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'live.html',
      chunks: ['live'],
      template: 'lib/live/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'viewer.html',
      chunks: ['viewer'],
      template: 'lib/viewer/index.html'
    })
  ],

  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'dist'),
    port: port,
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader!preprocess-loader?' + JSON.stringify(_.extend(AppConfig, { ppOptions: { type:'js' }})),
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', 'fonts/[name].[ext]')
        }
      }
    ]
  }
};