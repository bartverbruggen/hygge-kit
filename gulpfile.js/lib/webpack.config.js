var config = require('../../gulp.config');
var path = require('path');
var webpack = require('webpack');
var pathToUrl = require('../lib/pathToUrl');

module.exports = function(env) {
  var jsSrc = path.resolve(config.root.src, config.tasks.js.src);
  var jsDest = path.resolve(config.root.dest, config.tasks.js.dest);
  var publicPath = pathToUrl(config.tasks.js.dest, '/');

  env = 'development';

  var extensions = config.tasks.js.extensions.map(function(extension) {
    return '.' + extension;
  });

  var rev = config.tasks.production.rev && env === 'production';
  var filenamePattern = rev ? '[name]-[hash].js' : '[name].js';

  // console.log('');
  // console.log(rev);
  // console.log('');

  var webpackConfig = {
    context: jsSrc,
    plugins: [],
    resolve: {
      extensions: extensions,
      modules: ["node_modules", jsSrc]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: config.tasks.js.babel
        }
      ]
    }
  };

  if (env === 'development') {
    for (var key in config.tasks.js.entries) {
      var entry = config.tasks.js.entries[key];
      config.tasks.js.entries[key] = ['webpack-hot-middleware/client?&reload=true'].concat(entry);
    }
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  webpackConfig.entry = config.tasks.js.entries;
  webpackConfig.output= {
    path: path.normalize(jsDest),
    filename: filenamePattern,
    publicPath: publicPath
  };

  if(env === 'production') {
    // if(rev) {
    //   webpackConfig.plugins.push(new webpackManifest(publicPath, config.root.dest))
    // }
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.NoErrorsPlugin()
    );
  }

  // plugins: [
  //   new webpack.optimize.DedupePlugin(),
  //   new webpack.optimize.UglifyJsPlugin(),
  //   new webpack.NoErrorsPlugin()
  // ],

  return webpackConfig;
};
