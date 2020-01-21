const HtmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  resolve: {
    modules: ['src', 'node_modules'],
  },
  devtool: 'source-map',
  entry: {
    vendor: ['react', 'react-dom'],
    client: './src/index.js',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].chunkhash.bundle.js',
    chunkFilename: '[name].chunkhash.bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 8080,
  },
  plugins: [
    new copyWebpackPlugin([{ from: './_redirects' }]),
    new HtmlWebpackPlugin({
      title: 'Bridged',
      template: './src/index.html',
      filename: './index.html',
      inject: true,
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        minifyCSS: true,
        minifyURLs: true,
        minifyJS: true,
        removeComments: true,
        removeRedundantAttributes: true,
      },
    }),
  ],
};
