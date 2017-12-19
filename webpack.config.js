const pkg = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => {
  const ENV = (env && env.env) || 'dev';
  const VERSION = pkg.version;

  return {
    context: path.resolve(__dirname, "source"),
    entry: {
      index: './javascript/index.js',
      vendor: ['preact', 'preact-router', 'preact-async-route', 'idb'],
    },
    output: {
      path:  path.resolve(__dirname, 'public'),
      publicPath: '/',
      chunkFilename: ENV === 'prod' ? '[name].[chunkhash].js' : '[name].js',
      filename: ENV === 'prod' ? '[name].[chunkhash].js' : '[name].js',
    },
    stats: {
      colors: true,
      reasons: true,
    },
    resolve: {
      alias: {
        css: path.resolve(__dirname, 'source/css'),
      },
      extensions: ['.js', '.json', '.css'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/(node_modules)/, /sw.js/],
          use: [{
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                [
                  'env', 
                  { 
                    'targets': { 
                      browsers: ['last 2 versions', 'not ie >= 10', 'not ExplorerMobile >= 10'] 
                    } 
                  }
                ],
              ],
              plugins: [
                'transform-object-rest-spread',
                ['transform-react-jsx', { 'pragma': 'h' }],
                'syntax-dynamic-import',
              ]
            }
          }]
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                }
              }
            ]
          })
        },
        {
          test: /\.(woff|woff2)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          }]
        },
      ]
    },
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      host: '0.0.0.0',
      port: 3000,
      hot: true,
      overlay: true,
      historyApiFallback: true,
      disableHostCheck: true,
      useLocalIp: true,
    },
    devtool: ENV === 'prod' ? 'source-map' : 'cheap-module-eval-source-map',
    plugins: ([
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'source/index.html'),
        minify: { collapseWhitespace: false },
        excludeChunks: ['sw'],
      }),
      new ExtractTextPlugin({
        filename: '[name].[chunkhash].css',
        allChunks: true,
        disable: ENV!=='prod'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      }),
      new CopyWebpackPlugin([{ from: 'static' }]),
      new ServiceWorkerWebpackPlugin({
        entry: './javascript/sw.js',
        excludes: ['*.json', '*.map', 'transaction.*.js', 'index.html', '**/*.png', '**/*.ico'],
        transformOptions: (serviceWorkerOption) => {
          const {assets} = serviceWorkerOption;
          return {
            version: VERSION,
            assets,
          };
        }
      }),
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(ENV==='prod'),
        VERSION: JSON.stringify(VERSION),
        STRIPE_API_KEY: JSON.stringify(ENV === 'prod' ? 'pk_live_NLjdwuBQDHVBWxp2vFkU4R3q' : 'pk_test_2V6L1LQDF85u3yQsLSQ9f69z'),
        PAYMENT_URL: JSON.stringify(ENV === 'prod' ? 'https://e3fg7yfkd4.execute-api.us-east-1.amazonaws.com/prod/payment' : 'https://bjx84jln04.execute-api.us-east-1.amazonaws.com/dev/payment'),
      }),
      new CleanWebpackPlugin(['public']),
      new webpack.NamedModulesPlugin(),
    ]).concat(ENV==='prod' ? [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.HashedModuleIdsPlugin(),
      new UglifyJSPlugin({
        sourceMap: true
      })
    ] : [
      new webpack.HotModuleReplacementPlugin(),
    ])
  }
}