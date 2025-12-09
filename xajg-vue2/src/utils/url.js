import base from "@/common/js/base.js";
import { getToken, getSid } from "@/utils/auth";

/**
 *
 * @param {*} url 地址
 */
export function convertUrl(url) {
  let userInfo = base.getStorage("userInfo");
  let obj = {
    "{token}": getToken(),
    "{sid}": getSid(),
    "{userInfo.mobile}": userInfo.mobile,
    "{userInfo.realName}": userInfo.realName,
  };
  for (let k in obj) {
    if (url.indexOf(k) >= 0) {
      url = url.replaceAll(k, obj[k]);
    }
  }
  return url;
}

/**
 *
 * @param {*} url 地址
 */
export function computeUrl(url) {
  url = convertUrl(url);
  // return new Promise((resolve, reject) => {
  //   if (url.indexOf("{userInfo") >= 0) {
  //     store.dispatch("user/getInfo").then((userInfo) => {
  //       if (userInfo) {
  //         url = url
  //           .replaceAll("{userInfo.mobile}", userInfo.mobile)
  //           .replaceAll(
  //             "{userInfo.realName}",
  //             userInfo.realName?.replaceAll(" ", "")
  //           );
  //       }
  //       resolve(url);
  //     });
  //   } else {
  //     resolve(url);
  //   }
  // });
  return url;
}

/**
 * 判断Url是否可以访问
 * @param {*} url
 * @returns
 */
export function getURLOk(url, { success, fail }) {
  function getXmlHttpRequest() {
    var request = false;
    if (window.XMLHttpRequest) {
      request = new XMLHttpRequest();
      if (request.overrideMimeType) {
        request.overrideMimeType("text/xml");
      }
    } else if (window.ActiveXObject) {
      var versions = [
        "Microsoft.XMLHTTP",
        "MSXML.XMLHTTP",
        "Microsoft.XMLHTTP",

        "Msxml2.XMLHTTP.7.0",
        "Msxml2.XMLHTTP.6.0",
        "Msxml2.XMLHTTP.5.0",

        "Msxml2.XMLHTTP.4.0",
        "MSXML2.XMLHTTP.3.0",
        "MSXML2.XMLHTTP",
      ];
      for (var i = 0; i < versions.length; i++) {
        try {
          request = new ActiveXObject(versions[i]);
          if (request) {
            return request;
          }
        } catch (e) {
          console.log("getURLOk error", e, url);
        }
      }
    }
    return request;
  }

  function ajax(xmlhttp, _method, _url, _param, _callback) {
    if (typeof xmlhttp == "undefined") return;
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        _callback(xmlhttp);
      }
    };
    xmlhttp.open(_method, _url, true);
    if (_method == "POST") {
      xmlhttp.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
      xmlhttp.setRequestHeader("Content-Length", _param.length);

      xmlhttp.send(_param);
    } else {
      xmlhttp.send(null);
    }
  }

  //使用举例
  var xmlhttp = getXmlHttpRequest();
  var t1; //用来作超时处理

  function responseOk(request) {
    // console.info("getURLOk responseOk", request.responseText, url);

    if (t1) clearTimeout(t1);

    try {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          typeof success === "function" && success();
        } else {
          console.log("getURLOk fail", xmlhttp.status, url);
          typeof fail === "function" && fail();
        }
      }
    } catch (error) {
      console.log("getURLOk error", error, url);
      fail();
    }
  }

  function connecttoFail() {
    if (xmlhttp) xmlhttp.abort();
    console.error("getURLOk Time out", url);
    fail();
  }

  if (xmlhttp) {
    ajax(xmlhttp, "GET", url, "", responseOk);

    t1 = setTimeout(connecttoFail, 1000);
  } else {
    console.error("getURLOk Init xmlhttprequest fail");
    fail();
  }
}
