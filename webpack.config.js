/** @type {import('webpack').Configuration} */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin');

// configure source and distribution folder paths
const srcFolder = 'src'
const buidFolder = 'build'

module.exports = {
  entry: `./${srcFolder}/index.js`,
  output: {
    path: path.resolve(__dirname, buidFolder),
    filename: '[name].bundle.js',
    clean: true
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      // processes Javascript files
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      // transpiles global Stylus stylesheets
      {
        test: /\.css|.styl$/i,
        use: [MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader'
        ]
      },
      // processes JSON files, useful for config files and mock data
      {
        test: /\.json?$/,
        loader: 'json-loader'
      },
      // processes images files to use it in JS files
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    // copies the index.html file, and injects a reference to the output JS
    new HtmlWebpackPlugin({
      inject: 'body', // default true ... true || 'head' || 'body' || false
      filename: './index.html', // default index.html
      template: './public/index.html',
      templateParameters: {
        titulo: 'La Lana Land | Amigos Lanudos'
      }
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, srcFolder, 'assets/images'),
          to: 'assets/images'
        }
      ]
    })
  ],
  // use full source maps
  devtool: 'inline-source-map',
  // use the webpack dev server to serve up the web application
  devServer: {
    liveReload: true,
    port: 8000,
    static: {
      directory: `./${buidFolder}`,
      watch: true
    },
    watchFiles: ['src/', 'public/']
  }
}
