const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const { peerDependencies } = require("./package.json");

const cssLoader = {
  loader: "css-loader",
  options: {
    modules: {
      localIdentName: "esm-referrals-queue__[name]__[local]___[hash:base64:5]"
    }
  }
};

module.exports = {
  entry: [
    path.resolve(__dirname, "src/set-public-path.ts"),
    path.resolve(__dirname, "src/index.ts")
  ],
  output: {
    filename: "pih-esm-referrals-queue-app.js",
    libraryTarget: "system",
    path: path.resolve(__dirname, "dist"),
    jsonpFunction: "webpackJsonp_pih_esm_referrals_queue"
  },
  module: {
    rules: [
      {
        parser: {
          system: false
        }
      },
      {
        test: /\.m?(js|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", cssLoader]
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", cssLoader, "sass-loader"]
      },
      {
        test: /\.(png|jpe?g)$/i,
        use: [
          {
            loader: "file-loader"
          }
        ]
      }
    ]
  },
  devtool: "sourcemap",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    disableHostCheck: true
  },
  externals: Object.keys(peerDependencies),
  plugins: [new ForkTsCheckerWebpackPlugin(), new CleanWebpackPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"]
  }
};
