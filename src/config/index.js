const modeType = {
  dev: "dev",
  test: "test",
  pre: "pre",
  pro: "pro",
};

// 默认使用 dev 配置；如需按环境切换，可后续增加 environment.json 动态配置
const mode = modeType.dev;

export default mode;
