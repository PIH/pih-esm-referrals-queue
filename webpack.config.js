const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = webpackConfigEnv => {
  const defaultConfig = singleSpaDefaults({
    orgName: "pih",
    projectName: "esm-referrals-queue",
    webpackConfigEnv
  });

  return webpackMerge.smart(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
  });
};

//const path = require("path");
//const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
//const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

//module.exports = {
//entry: path.resolve(__dirname, "src/pih-esm-referrals-queue.tsx"),
//output: {
//filename: "pih-esm-referrals-queue.js",
//libraryTarget: "system",
//path: path.resolve(__dirname, "dist"),
//jsonpFunction: "webpackJsonp_pih_esm_referrals_queue"
//},
//module: {
//rules: [
//{
//parser: {
//system: false
//}
//},
//{
//test: /\.m?(js|ts|tsx)$/,
//exclude: /(node_modules|bower_components)/,
//use: {
//loader: "babel-loader"
//}
//},
//{
//test: /\.css$/,
//use: [
//{ loader: "style-loader" },
//{
//loader: "css-loader",
//options: {
//modules: true
//}
//}
//]
//}
//]
//},
//devtool: "sourcemap",
//devServer: {
//headers: {
//"Access-Control-Allow-Origin": "*"
//},
//disableHostCheck: true
//},
//externals: [
//"react",
//"react-dom",
///^@openmrs\/esm.*/,
//"i18next",
//"react-i18next"
//],
//plugins: [new ForkTsCheckerWebpackPlugin(), new CleanWebpackPlugin()],
//resolve: {
//extensions: [".tsx", ".ts", ".jsx", ".js"]
//}
//};
