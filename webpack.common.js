const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  entry: "./index.ts",
  output: {
    filename: "popup.js",
    path: path.resolve(__dirname, "dist"),
    chunkFilename: "[name].bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: {
          loader: "file-loader",
          options: { outputPath: "./src/public/icons", name: "[name].[ext]" },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: path.join(__dirname, "dist/popup.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "src/styles.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/public/icons"),
          to: "src/public/icons",
        },
      ],
    }),
    new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin(),
  ],
};
