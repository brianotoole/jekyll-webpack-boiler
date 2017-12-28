// prod webpack configuration file 
// share webpack.common.js configuration and adds:
// - source map original source (lines only)
// - extract scss => css => site.min.css
// - Uglify javascript

const path = require('path');
const webpack = require('webpack');
const merge   = require('webpack-merge');
const ETP = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'cheap-module-source-map',
  module: {
    rules: [{
      // creates style nodes from JS strings
      // translates CSS into CommonJS
      // compiles Sass to CSS
      // minify css and autoprefix
      test: /\.scss$/,
      loader: ETP.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader', options: {minimize:true, discardComments: true }},
          { loader: 'postcss-loader' },
          { loader: 'sass-loader', options: { sourceMap: false, outputStyle: 'compressed' }}
        ]
      }),
      include: path.join(__dirname, 'src/styles')
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ETP({  
      disable: false, 
      allChunks: true,
      filename: (getPath) => {
        return getPath('css/app.min.css').replace('css/js', 'css');
      },
    }),
    new UglifyJsPlugin({
      sourceMap: true
    })
  ]
});
