import { Message } from 'element-ui';
import store from '@/store';
import { windowOpen } from '@/utils/index';
import json from '/public/static/const-config.json';
import router from '../router';

export function getNtkoInstalled() {
  return ntkoBrowser.ExtensionInstalled();
}

export function getNtkoVersion() {
  return ntkoBrowser.NtkoExtensionVersion();
}

// 所以总结最全的兼容方式获取为
export const clientWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
export const clientHeight =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

/**
 * 文件地址转换
 * */
export function getMinioUrl(url) {
  if (!url) {
    return '';
  }
  if (url.indexOf("http://") != -1 || url.indexOf("https://") != -1) {
    let uri = new URL(url)
    url = uri.href.substring(uri.origin.length)
  } else {
    if (url.indexOf("/api/") == -1 && url.indexOf("?") != -1) {
      url = url.substr(0, url.indexOf("?"));
    }
    let minioConfig = store.state.minioConfig;
    if (minioConfig) {
      let fontUrl = minioConfig.fontUrl;
      let backUrl = minioConfig.backUrl;
      // url.indexOf(backUrl) >= 0
      if (fontUrl && backUrl && Array.isArray(backUrl)) {
        let index = -1
        // 找到数组中的项目是不是包含在url中项目  并且返回下标
        for (let i = 0; i < backUrl.length; i++) {
          if (url.includes(backUrl[i])) {
            index = i;
            break
          }
          index = -1; // 如果没有找到匹配项，则返回-1
        }
        if (index != -1) {
          let fileId;
          let idx1 = url.lastIndexOf("/") + 1;
          let idx2 = url.lastIndexOf(".");
          if (idx2 > idx1) {
            fileId = url.substring(idx1, idx2);
            if (fontUrl.indexOf("{fileId}") != -1) {
              fontUrl = fontUrl.replaceAll("{fileId}", fileId);
              return fontUrl;
            }
          }
          url = url.replaceAll(backUrl[i], fontUrl);
        }
      }
    }
  }
  return url;
}

/**
 * Ntko插件下载页面
 * */
export function getNtkoExe() {
  var ntkourl = window.location.host;
  var ntkoprotocol = window.location.protocol;
  Message.error('没有安装ntko浏览器插件！');
  window.open(ntkoprotocol + '//' + ntkourl + '/ntko/exeindex.html', '_blank');
}

export function ntkoFilePreview(file, ntkoConfig) {
  //判断插件是否安装
  var ntkoed = getNtkoInstalled();
  var ntkoversion = getNtkoVersion();
  var ntkourl = window.location.host;
  var ntkoprotocol = window.location.protocol;
  // let fileurl = getMinioUrl(file.url); //地址不需要再转化了
  console.log('当前ntkoversion', ntkoversion, JSON.stringify(file), file.url);
  let params = {
    url: file.url,
    name: file.name,
    isRevision: file.isRevision,
    cmd: 1, //预览 1、电子签章 2
    fileid: file.fileId
  };
  console.log('word 参数', params)
  if (ntkoConfig) {
    Object.assign(params, ntkoConfig);
  }
  if (ntkoed) {
    let fileurl =
      ntkoprotocol +
      '//' +
      ntkourl +
      '/ntko/officeTemplate/ntko.html?t=' +
      new Date().getTime() +
      '&cmd=' +
      encodeURIComponent(JSON.stringify(params));
    ntkoBrowser.openWindow(fileurl, false);
  } else {
    getNtkoExe();
  }
}

/**
 * 获取电子签章的签章参数
 * @param {*} file
 * @param {*} username
 * @returns
 */
export const getNtkoSignParams = function (
  file,
  username,
  compKey,
  signPosition,
  ntkoConfig
) {
  let ntkoUsername = store.state.ntkoConfig.username;
  if (username) {
    ntkoUsername = username;
  }
  // console.log('getNtkoSignParams/file.url', file.url);
  let params = {
    //url: getMinioUrl(file.url),
    url: file.url,
    compKey: compKey,
    fileid: file.fileId,
    name: encodeURIComponent(file.name),
    cmd: 2, //预览 1、电子签章 2
    serverUrl: store.state.ntkoConfig.serverUrl,
    serverUrlKey: store.state.ntkoConfig.serverUrlKey,
    username: ntkoUsername,
    userpwd: store.state.ntkoConfig.userpwd,
    password: store.state.ntkoConfig.password,
    verifyMode: store.state.ntkoConfig.verifyMode,
    signPosition: signPosition,
    ntkoH5SignClientName: store.state.ntkoConfig.ntkoH5SignClientName,
    ntkoH5SignEkeyClientName: store.state.ntkoConfig.ntkoH5SignEkeyClientName
  };
  if (ntkoConfig) {
    Object.assign(params, ntkoConfig);
  }
  console.log('获取电子签章的签章参数', params);
  return params;
};

//关闭控件页面
export function ntkoClosed(cmd) {
  var ntkourl = window.location.host;
  var ntkoprotocol = window.location.protocol;
  ntkoBrowser.ntkoClose(
    ntkoprotocol + '//' + ntkourl + '/editindex.html?cmd=' + cmd
  );
}

/**
 * 获取h5签章地址
 */
export function getH5Url(file, username, compKey, signPosition, ntkoConfig) {

  let params = getNtkoSignParams(
    file,
    username,
    compKey,
    signPosition,
    ntkoConfig
  );
  var ntkourl = window.location.host;
  var ntkoprotocol = window.location.protocol;
  let url =
    ntkoprotocol +
    '//' +
    ntkourl +
    '/ntko/officeTemplate/ntkoh5.html?t=' +
    new Date().getTime() +
    '&params=' +
    encodeURIComponent(JSON.stringify(params));
  console.info('ntkoh5 url', url);
  return url;
}

/**
 * 获取h5签章地址
 */
export function getH5PreviewUrl(file, username, compKey, signPosition, ntkoConfig) {

  let params = getNtkoSignParams(
    file,
    username,
    compKey,
    signPosition,
    ntkoConfig
  );
  // console.log("getNtkoSignParams", params)
  var ntkourl = window.location.host;
  var ntkoprotocol = window.location.protocol;
  let url =
    ntkoprotocol +
    '//' +
    ntkourl +
    '/ntko/officeTemplate/ntkoh5preview.html?t=' +
    new Date().getTime() +
    '&params=' +
    encodeURIComponent(JSON.stringify(params));
  console.info('ntkoh5 url', url);
  return url;
}


/**
 * h5签章
 */
export function ntkoFileSign(
  file,
  username,
  compKey,
  signPosition,
  ntkoConfig
) {
  //判断插件是否安装
  console.info('********进入h5签章********');
  // let ntkoConfig = {
  //   "keySign": useKeySign?useKeySign:false,
  //   "showDate": showDate?showDate:false,
  // }
  let url = getH5Url(file, username, compKey, signPosition, ntkoConfig);
  //使用路由打开
  // let url = "/ntko?t="+new Date().getTime()+"&params=" +encodeURIComponent(JSON.stringify(params));
  windowOpen(url);
}

/**
 * 表单数据预览
 * @param {*} formData 表单数据
 * @param {*} template word模板地址
 * @param {*} ntkoConfig ntko相关配置
 */
export function ntkoFormPreview(formData, template, ntkoConfig) {
  if (
    !template ||
    (!template.toLocaleString().endsWith('.doc') &&
      !template.toLocaleString().endsWith('.docx'))
  ) {
    console.error(
      '表单数据预览模板路径必须是word模板，当前template：' + template
    );
    return;
  }
  //判断插件是否安装
  var ntkoed = getNtkoInstalled();
  var ntkoversion = getNtkoVersion();
  console.log('当前ntkoversion', ntkoversion, formData, template);
  var ntkourl = window.location.host;
  var ntkoprotocol = window.location.protocol;
  let params = {
    isRevision: formData.isRevision,// 是否开启修订模式
    cmd: 3, //预览 1、电子签章 2、表单数据预览 3
    template: template, //模板
    name: formData.fileName //文件名
  };
  console.log('接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订接受所有修订')
  console.log(params)
  if (ntkoConfig) {
    Object.assign(params, ntkoConfig);
  }
  if (ntkoed) {
    let ntkotext = encodeURIComponent(JSON.stringify(formData));
    let str = encodeURIComponent(JSON.stringify(params));
    let url =
      ntkoprotocol +
      '//' +
      ntkourl +
      '/ntko/officeTemplate/ntko.html?cmd=' +
      str;
    ntkoBrowser.openWindow(url, false, '', '', '', '', ntkotext, 1600, 1248);
  } else {
    getNtkoExe();
  }
}

/**
 * 表单数据自动转pdf保存
 * @param {*} formData 表单数据
 * @param {*} template word模板地址
 */
export function ntkoFormSavePDF(formData, template) {
  if (
    !template ||
    (!template.toLocaleString().endsWith('.doc') &&
      !template.toLocaleString().endsWith('.docx'))
  ) {
    console.error(
      '表单数据预览模板路径必须是word模板，当前template：' + template
    );
    return;
  }
  //判断插件是否安装
  var ntkoed = getNtkoInstalled();
  var ntkoversion = getNtkoVersion();
  console.log('当前ntkoversion', ntkoversion, formData, template);
  var ntkourl = window.location.host;
  var ntkoprotocol = window.location.protocol;
  let params = {
    cmd: 4, //预览 1、电子签章 2、表单数据预览 3、提交表单前调用，自动转pfd并保存到服务器 4
    template: template //模板
  };
  if (ntkoed) {
    let ntkotext = encodeURIComponent(JSON.stringify(formData));
    let str = encodeURIComponent(JSON.stringify(params));
    let url =
      ntkoprotocol +
      '//' +
      ntkourl +
      '/ntko/officeTemplate/ntko.html?cmd=' +
      str;
    console.log('ntko本地模板', url);
    ntkoBrowser.openWindow(url, false, '', '', '', '', ntkotext, 1600, 1248);
  } else {
    getNtkoExe();
  }
}

export function getNtkoSignConfig() {
  var routeName = router.currentRoute.meta.auth;
  // var routeName = this.$route.meta.auth;
  let { ntkoSignMapConfig } = json;
  // this.signMarkBooksMap = ntkoSignMapConfig[routeName];
  return ntkoSignMapConfig[routeName];
}
