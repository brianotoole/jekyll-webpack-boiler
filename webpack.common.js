// common webpack configuration file
// the exports object is share between dev and prod builds.
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	node: {
		fs: 'empty'
  },
  // Entry point of our app
  entry: path.resolve(__dirname, 'src/js/app.js'),
	output: {
		filename: 'app.js',
    path: path.resolve(__dirname, 'jekyll/assets')
	},
	plugins: [
    new CleanWebpackPlugin(['jekyll/assets/app.js', 'jekyll/assets/css'])
	],
	module: {
    rules: [
      {
        // allows us to use imports and all the es6 stuff
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        use: { 
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      
      {
        // return a DataURL if the file is smaller than a byte limit. 
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        exclude: /node_modules/,
        use: [
          { loader: 'url-loader', options: { limit: 8192 } }, 
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'styles': path.resolve(__dirname, 'src/styles')
    }
  },
};