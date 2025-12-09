"use strict";
const path = require("path");
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
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));

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
