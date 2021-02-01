const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');


module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index: "./client/index.js",
    editor: "./client/editor.js"
  },
  plugins: [
    new WebpackShellPluginNext({
      "onBuildStart": {
        scripts: ["node theme-manager-cli.mjs -o client/themes.json"],
        blocking: true,
        parallel: false
      }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Resume JSON Editor',
      cache: false
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
};