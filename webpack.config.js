const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Import the plugin
const CopyWebpackPlugin = require("copy-webpack-plugin"); // Import the plugin

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg|webp)$/i, // Test for image files
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(mp3|wav|ogg)$/i, // Test for audio files
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/audio/[name].[ext]", // Output audio files to a specific folder
            },
          },
        ],
      },
    ],
  },
  devtool: "source-map",
  devServer: {
    static: path.join(__dirname, "public"),
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"), // Path to your HTML template
      filename: "index.html", // Output HTML file
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/_redirects", to: "_redirects" }, // Copy _redirects to dist
      ],
    }),
  ],
};
