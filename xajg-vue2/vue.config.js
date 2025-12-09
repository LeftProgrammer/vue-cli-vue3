"use strict";
const path = require("path");
const { defineConfig } = require("@vue/cli-service");
function resolve(dir) {
  return path.join(__dirname, dir);
}
require("events").EventEmitter.defaultMaxListeners = 0;
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 3000; // dev port
console.log(port, "port");
const proxy = require("./config/proxy.config");
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = defineConfig({
  runtimeCompiler: true,
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    allowedHosts: "all",
    proxy,
    port: port,
    open: true,
    https: false, // 是否https
    client: {
      overlay: {
        errors: false,
        warnings: false,
        runtimeErrors: false,
      },
    },
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      alias: {
        "@": resolve("src"),
      },
      fallback: {
        // 这里写你需要polyfill的模块
        fs: require.resolve("browserify-fs"),
        path: require.resolve("path-browserify"),
        // 以此类推...
      },
    },
    plugins: [],
    module: {
      // 不让webpack打印载入特定库时候警告
      unknownContextCritical: false,
      // 配置相应的loader
      rules: [
        {
          // Remove pragmas within cesium as recommended - https://github.com/AnalyticalGraphicsInc/cesium-webpack-example/blob/master/webpack.release.config.js
          test: /\.js$/,
          enforce: "pre",
          include: path.resolve(__dirname, "node_modules/cesium/Source"),
          sideEffects: false,
          use: [
            {
              loader: "strip-pragma-loader",
              options: {
                pragmas: {
                  debug: false,
                },
              },
            },
          ],
        },
      ],
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));

    // svg rule loader
    let svgRule = config.module.rule("svg"); // 找到svg-loader
    svgRule.uses.clear();
    svgRule.exclude
      .add([/node_modules/, resolve("src/icons"), resolve("src/views")]) // 正则匹配排除node_modules目录
      .end();

    let iconsRule = config.module.rule("icons");
    iconsRule.uses.clear();
    iconsRule.include.add([resolve("src/icons")]);
    iconsRule
      .test(/\.svg$/)
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    // 删除注释
    config.optimization.minimizer("terser").tap((args) => {
      // 直接修改 terserOptions 下的属性值，保留原有配置
      // 这里访问 terserOptions 的时候并没有 output，访问不到 output.comments 需要直接赋值
      args[0].terserOptions.output = {
        comments: false,
      };
      return args;
    });
  },
  // chainWebpack: (config) => {
  //   console.log(config)
  //   config.module
  //     .rule('scss')
  //     .test(/\.scss$/)
  //     .oneOf('vue')
  //     .use('px2rem-loader')
  //     .loader('px2rem-loader')
  //     .before('postcss-loader')
  //     .options({
  //       remUnit: 16, // 1rem = 16px
  //       remPrecision: 8,
  //       unitPrecision: 4
  //     })
  //     .end()
  // }
});
