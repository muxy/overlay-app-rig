const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = process.env.PORT || 9000;

function resolve(dir) {
  return path.resolve(__dirname, '..', dir);
}

module.exports = {
  devtool: 'inline-source-map',

  entry: {
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
      app: resolve('src')
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'config.html',
      chunks: ['config'],
      template: 'src/config/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'live.html',
      chunks: ['live'],
      template: 'src/live/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'viewer.html',
      chunks: ['viewer'],
      template: 'src/viewer/index.html'
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
        loader: 'vue-loader',
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
      }
    ]
  }
};