const modeType = {
  dev: "dev",
  test: "test",
  pre: "pre",
  pro: "pro",
};

// 默认使用 dev 配置
let mode = modeType.dev;

const modeReady = (async () => {
  try {
    const res = await fetch(`/static/environment.json?t=${Date.now()}`);
    const res2 = await res.json();
    if (res2 && res2.environment) {
      mode = res2.environment;
    }
  } catch (e) {
    void e;
  }
  return mode;
})();

export function ensureMode() {
  return modeReady;
}

export { mode as default };
