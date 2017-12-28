// dev webpack configuration file 
// share webpack.common.js configuration and adds:
// - css and js source-maps
// - webpack-dashboard (https://github.com/FormidableLabs/electron-webpack-dashboard)
// - Liverealod with BrowserSync
//   * if you are not using lando just update the [proxy] to match your server

const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ETP = require('extract-text-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = merge(common, {
  devtool: 'inline-source-map',
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
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      }),
      include: path.join(__dirname, 'src/styles')
    }]
  },
  plugins: [
    new WebpackNotifierPlugin(
      { excludeWarnings: true, skipFirstNotification: true }
    ),
    new DashboardPlugin(),
    new BrowserSyncPlugin({
      notify: false,
      host: '127.0.0.1', // or localhost
      port: 4000, // this is the port you develop on. Can be anything.
      logLevel: 'info',
      files: [
        'dist/**/*.js',
        'dist/**/*.css',
        'dist/**/*.html',
        'dist/assets/**/{*.png|*.jpg|*.svg}',
      ],
      proxy: 'http://localhost:4000/'
    }),
    new ETP({
      disable: false,
      allChunks: true,
      filename: (getPath) => {
        return getPath('css/app.css').replace('css/js', 'css');
      },
    }),
  ]
});
