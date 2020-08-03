const path = require("path");
const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = webpackConfigEnv => {
  const defaultConfig = singleSpaDefaults({
    orgName: "pih",
    projectName: "esm-referrals-queue",
    webpackConfigEnv
  });

  return webpackMerge.smart(defaultConfig, {
    entry: path.resolve(__dirname, "src/pih-esm-referrals-queue.tsx"),
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.m?(js|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    externals: [
      "react",
      "react-dom",
      /^@openmrs\/esm.*/,
      "i18next",
      "react-i18next"
    ]
  });
};
