let modeType = {
  dev: "dev",
  test: "test",
  pre: "pre",
  pro: "pro",
};

// 切换环境入口
let mode = modeType.dev;
try {
  let res = await fetch("/static/environment.json?t="+new Date().getTime());
  let res2 = await res.json();
  if (res2.environment) {
    mode = res2.environment;
  }
} catch (error) {}

console.log("config mode", mode);

export default mode;
