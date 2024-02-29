const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    port: 3000,
    hot: true,
    static: {
      directory: path.resolve(__dirname, "../build"),
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
});
