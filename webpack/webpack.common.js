const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyFilesPlugin = require("./copy-files-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    publicPath: "/",
    filename: "assets/main.[contenthash].js",
    path: path.join(__dirname, "../build"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyFilesPlugin({
      source: "./public/icons",
      destination: "./build/icons",
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      inject: "body",
    }),
  ],
  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : false,
    maxAssetSize: 244 * 1024, // 244 KiB
    maxEntrypointSize: 244 * 1024, // 244 KiB
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
};
