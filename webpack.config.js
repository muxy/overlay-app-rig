const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

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
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('lib'),
      manifest$: resolve('manifest.json'),
      shared: resolve('lib/shared'),
      src: resolve('lib'),
      app: resolve('src'),
      static: resolve('static')
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin(
      [
        { from: 'static', to: 'static' },
        { from: 'node_modules/keen-ui/dist/keen-ui.min.js', to: 'vendor/js/'},
        { from: 'node_modules/animejs/anime.min.js', to: 'vendor/js/'}
      ],
      { ignore: ['.DS_Store'] }
    ),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['rig'],
      template: 'lib/rig/index.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'config.html',
      chunks: ['config'],
      template: 'lib/config/index.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'live.html',
      chunks: ['live'],
      template: 'lib/live/index.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'viewer.html',
      chunks: ['viewer'],
      template: 'lib/viewer/index.html',
      inject: true
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['vendor/js/keen-ui.min.js', 'vendor/js/anime.min.js'],
      append: true
    }),
    new FriendlyErrorsPlugin()
  ],

  externals: {
    animejs: {
      commonjs: 'animejs',
      amd: 'animejs',
      root: 'anime'
    },
    'keen-ui': {
      commonjs: 'keen-ui',
      amd: 'keen-ui',
      root: 'KeenUI' // indicates global variable
    }
  },

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
        loader: 'babel-loader!preprocess-loader?' + JSON.stringify(_.extend(AppConfig, { ppOptions: { type:'js' }})),
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
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[path][name].[ext]?[hash]',
          useRelativePaths: true
        }
      }
    ]
  }
};