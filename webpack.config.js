/** @type {import('webpack').Configuration} */
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const htmlFiles = [];
const directories = ['public'];
while (directories.length > 0) {
  const directory = directories.pop();
  const dirContents = fs.readdirSync(directory).map(file => path.join(directory, file));

  htmlFiles.push(...dirContents.filter(file => file.endsWith('.html')));
  directories.push(...dirContents.filter(file => fs.statSync(file).isDirectory()));
}

// configure source and distribution folder paths
const srcFolder = 'src';
const buidFolder = 'build';

module.exports = {
  entry: `./${srcFolder}/index.js`,
  output: {
    path: path.resolve(__dirname, buidFolder),
    filename: '[name].[contenthash].bundle.js',
    assetModuleFilename: 'assets/images/[name].[contenthash].[ext]',
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
      /* {
        test: /\.html$/i,
        use: 'html-loader'
      }, */
      // processes images files to use it in JS files
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        use: [{
          loader: 'image-webpack-loader',
          options: {
            pngquant: {
              quality: [0.90, 0.95]
            }
          }
        }],
        generator: {
          filename: 'assets/images/[name].[contenthash].[ext]'
        }
      },
      // processes woff files to use the fonts
      {
        test: /\.(woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[contenthash].[ext]'
        }
      },
      // processes JSON files, useful for config files and mock data
      {
        test: /\.json?$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    // copies the index.html file, and injects a reference to the output JS
    ...htmlFiles.map(htmlFile =>
      new HtmlWebpackPlugin({
        template: htmlFile,
        filename: htmlFile.replace(path.normalize('public/'), ''),
        inject: 'body',
        hash: true,
        templateParameters: {
          titulo: 'La Lana Land | '
        }
      })
    ),
    new MiniCssExtractPlugin({
      // filename: 'assets/[name].[contenthash].css'
      filename: 'assets/[name].css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, srcFolder, 'assets/images'),
          to: 'assets/images'
        }
      ]
    })
  ],
  optimization: {
    runtimeChunk: 'single',
    minimize: true
  },
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
};
