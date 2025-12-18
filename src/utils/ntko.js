import store from "@/store";

export function getMinioUrl(url) {
  if (!url) return "";

  try {
    if (url.includes("http://") || url.includes("https://")) {
      const uri = new URL(url);
      url = uri.href.substring(uri.origin.length);
    } else {
      if (!url.includes("/api/") && url.includes("?")) {
        url = url.substring(0, url.indexOf("?"));
      }

      const minioConfig = store.state.minioConfig;
      if (minioConfig) {
        let fontUrl = minioConfig.fontUrl;
        const backUrl = minioConfig.backUrl;
        if (fontUrl && backUrl && Array.isArray(backUrl)) {
          let index = -1;
          for (let i = 0; i < backUrl.length; i++) {
            if (url.includes(backUrl[i])) {
              index = i;
              break;
            }
          }
          if (index !== -1) {
            const idx1 = url.lastIndexOf("/") + 1;
            const idx2 = url.lastIndexOf(".");
            if (idx2 > idx1 && fontUrl.includes("{fileId}")) {
              const fileId = url.substring(idx1, idx2);
              return fontUrl.replaceAll("{fileId}", fileId);
            }
            url = url.replaceAll(backUrl[index], fontUrl);
          }
        }
      }
    }
  } catch (e) {
    void e;
  }

  return url;
}

export function getNtkoSignParams(file, username, compKey, signPosition, ntkoConfig) {
  const cfg = store.state.ntkoConfig || {};
  const ntkoUsername = username || cfg.username;

  const params = {
    url: file && file.url,
    compKey,
    fileid: file && file.fileId,
    name: file && file.name ? encodeURIComponent(file.name) : "",
    cmd: 2,
    serverUrl: cfg.serverUrl,
    serverUrlKey: cfg.serverUrlKey,
    username: ntkoUsername,
    userpwd: cfg.userpwd,
    password: cfg.password,
    verifyMode: cfg.verifyMode,
    signPosition,
    ntkoH5SignClientName: cfg.ntkoH5SignClientName,
    ntkoH5SignEkeyClientName: cfg.ntkoH5SignEkeyClientName,
  };

  if (ntkoConfig) {
    Object.assign(params, ntkoConfig);
  }
  return params;
}

export function getH5PreviewUrl(file, username, compKey, signPosition, ntkoConfig) {
  const params = getNtkoSignParams(file, username, compKey, signPosition, ntkoConfig);
  const host = window.location.host;
  const protocol = window.location.protocol;
  return (
    protocol +
    "//" +
    host +
    "/ntko/officeTemplate/ntkoh5preview.html?t=" +
    Date.now() +
    "&params=" +
    encodeURIComponent(JSON.stringify(params))
  );
}
