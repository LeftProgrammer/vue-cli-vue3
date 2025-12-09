const HOST = {
  local: ["192.168.70.52", 8092, "http"],
  gzz: ["192.168.70.90", 8092, "http"],
  cl: ["192.168.70.110", 8092, "http"],
  bim: ["127.0.0.1", 8086, "http"],
  bimengine: ["192.168.10.110", 8056, "http"],
  ntkoengine: ["192.168.10.110", 8056, "http"],
  minioengine: ["192.168.10.100", 9000, "http"],
  minioengine2: ["192.168.183.134", 17859, "http"],
  app: [
    "127.0.0.1",
    8081,
    "http",
    {
      "^/app/": "/",
      "^/app/index.html#/": "/#/",
    },
  ],
  test: ["192.168.10.110", 8056, "http"],
  test2: ["192.168.183.134", 28092, "http"],
  pro: ["mdgzhpt.ylhdc.com.cn", 443, "https"],
  pre: ["10.64.5.22", 8092, "http"],
  lly: ["192.168.183.134", 16687, "http"],
  yyx: ["192.168.183.134", 17997, "http"],
  online: ["mdgzhpt.ylhdc.com.cn", "", "https"],
};

const config = HOST.test;

const createProxyTable = (
  keys = [],
  ip = "0.0.0.0",
  port = "8080",
  protocol = "http",
  pathRewrite = null
) => {
  const proxyTable = {};

  keys.map((d) => {
    if (port === 80) {
      proxyTable[d] = {
        target: protocol + "://" + ip + "/",
        changeOrigin: true,
        secure: false,
        headers: {
          Referer: protocol + "://" + ip,
        },
      };
    } else {
      proxyTable[d] = {
        changeOrigin: true,
        target: protocol + "://" + ip + ":" + port + "/",
      };
      if (pathRewrite) {
        proxyTable[d].pathRewrite = pathRewrite;
      }
    }
  });

  return proxyTable;
};

function proxyWsTable(apis = [], host, port) {
  const proxyTable = {};
  apis.map((d) => {
    proxyTable[d] = {
      target: `ws://${host}:${port}`,
      ws: true,
      secure: false,
    };
  });
  return proxyTable;
}

module.exports = {
  ...proxyWsTable(["/ws/"], ...config),
  ...createProxyTable(
    ["/ntko-doc-viewer/", "/ntko-doc-viewer-key/"],
    ...HOST.ntkoengine
  ),
  ...createProxyTable(
    [
      "/api/app/combine/",
      "/api/app/document/",
      "/api/app/model/",
      "/tools/output/model/",
    ],
    ...HOST.bimengine
  ),
  ...createProxyTable(["/bim"], ...HOST.bim),
  ...createProxyTable(["/temp/"], ...HOST.minioengine),
  ...createProxyTable(
    [
      "/admin",
      "/menu",
      "/meet",
      "/transferRecord",
      "/transferStructure",
      "/modelData",
      "/dover",
      "/role-api",
      "/auth",
      "/authc",
      "/unauthc",
      "/login",
      "/dev-api",
      "/api/",
      "/authc-api/",
      "/admin-api/",
      "/security/",
      "/resources/",
      "/images/",
      "/iserver/",
      "/logout",
      "/train/",
      "/system/",
      "/temporary/",
      "/process/",
      "/process-flow/",
      "/incomingController/",
      "/leaveAndCancellation/",
      "/designConstruction/",
      "/process-public-resouce/",
    ],
    ...config
  ),
};
