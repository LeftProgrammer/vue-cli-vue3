"use strict";
const path = require("path");
const webpack = require("webpack");
const { defineConfig } = require("@vue/cli-service");
const proxy = require("./config/proxy.config");

const port = process.env.port || process.env.npm_config_port || 3000;

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  runtimeCompiler: true,
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all",
    proxy,
    port,
    open: true,
    https: false,
    client: {
      overlay: {
        errors: false,
        warnings: false,
        runtimeErrors: false,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.$": "jquery",
        "window.jQuery": "jquery",
      }),
    ],
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));

    const svgRule = config.module.rule("svg");
    svgRule.exclude.add(resolve("src/icons")).end();

    const iconsRule = config.module.rule("icons");
    iconsRule.uses.clear();
    iconsRule.test(/\.svg$/);
    iconsRule.include.add(resolve("src/icons")).end();
    iconsRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    config.optimization.minimizer("terser").tap((args) => {
      if (!args[0].terserOptions) {
        args[0].terserOptions = {};
      }
      if (!args[0].terserOptions.output) {
        args[0].terserOptions.output = {};
      }
      args[0].terserOptions.output.comments = false;
      return args;
    });
  },
});
