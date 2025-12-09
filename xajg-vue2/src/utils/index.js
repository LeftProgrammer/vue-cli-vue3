import { Message } from "element-ui";
import moment from "moment";

import router from "@/router";
/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (("" + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a") {
      return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

/**
 * JS 计算两个时间间隔多久（时分秒）
 * @param startTime "2019-10-23 15:27:23"
 * @param endTime "2019-10-23 15:27:55"
 * @return 1天2时3分5秒
 */
export function computeTimeDuration(startTime, endTime) {
  if (Number.isInteger(startTime)) {
    startTime = new Date(startTime);
  }
  if (Number.isInteger(endTime)) {
    endTime = new Date(endTime);
  }

  if (startTime instanceof Date) {
    startTime = moment(startTime).format("YYYY-MM-DD HH:mm:ss");
  }
  if (endTime instanceof Date) {
    endTime = moment(endTime).format("YYYY-MM-DD HH:mm:ss");
  }

  // 开始时间
  let d1 = startTime.replace(/\-/g, "/");
  let date1 = new Date(d1);

  // 结束时间
  let d2 = endTime.replace(/\-/g, "/");
  let date2 = new Date(d2);

  // 时间相差秒数
  let dateDiff = date2.getTime() - date1.getTime();

  // 计算出相差天数
  let days = Math.floor(dateDiff / (24 * 3600 * 1000));

  // 计算出小时数
  let residue1 = dateDiff % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
  let hours = Math.floor(residue1 / (3600 * 1000));

  // 计算相差分钟数
  let residue2 = residue1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
  let minutes = Math.floor(residue2 / (60 * 1000));

  // 计算相差秒数
  let residue3 = residue2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
  let seconds = Math.round(residue3 / 1000);

  let returnVal =
    (days == 0 ? "" : days + "天") +
    (hours == 0 ? "" : hours + "时") +
    (minutes == 0 ? "" : minutes + "分") +
    (seconds == 0 ? "" : seconds + "秒");

  return {
    durationText: returnVal,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

export function addFrame(url = "", width = "100px", height = "100px") {
  /*  <iframe src="${url}" width="100%" height="100%" frameborder="0"></iframe> */
  // <div class='riverInfoContentClass'>
  // <table class='riverInfoTableClasss'>
  // <thead>
  //   <tr>
  //       <th>河道信息</th>
  //       <th>河长信息</th>
  //   </tr>
  //   </thead>
  //  <tbody>
  //     <tr>
  //         <td>12312</td>
  //         <td>12312</td>
  //       </tr>
  //  </tbody>
  //  <table>
  //  </div>
  // <iframe src="${url}" width="100%" height="100%" frameborder="0"></iframe>
  return `
    <div style="width:${width};height:${height};background-color:#FFF;">
      <iframe src="${url}" width="100%" height="100%" frameborder="0"></iframe>
    </div>
  `;
}

/**
 * 预览pdf文件
 * @export
 * @param {string} [fileUrl=''] 文件资源地址，暂时只支持静态文件路径，不支持二进制流
 * @param {*} isOpen 是否是开放性页面访问，非开放性页面需要登录后才能访问
 * @returns
 */
export function viewPdf(fileUrl = "", isOpen = true) {
  const extension = fileUrl.split(".").pop().toUpperCase();
  if (extension !== "PDF") {
    Message.error("文件格式错误：只能预览PDF文件");
    return;
  }

  const src = isOpen ? "/static/pdf-view/index.html" : "/#/pdf-view";
  const opener = window.open(src);
  opener.fileUrl = fileUrl;
}

/**
 * 日期格式化方法
 * @export
 * @param {*} [date=new Date()]
 * @param {string} [formatter='YYYY-MM-DD']
 * @returns
 */
export function dateFormat(date = new Date(), formatter = "YYYY-MM-DD") {
  return moment(date).format(formatter);
}

export function debounce(fn, wait, immediate) {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) {
        fn.apply(this, arguments);
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, wait);
    }
  };
}
export function guid() {
  return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/x/g, () =>
    Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase()
  );
}
// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

/**
 * 是否来自app
 */
export function fromApp() {
  let fromapp =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  // console.log("fromapp", fromapp);
  return fromapp;
}

/**
 * window.open
 * @param {*} url
 */
export function windowOpen(url) {
  console.info("打开的页面地址", url);
  if (fromApp()) {
    window.open(url, "_blank");
    // window.open(url, "_blank", "newwindow", "noopener=yes");
    // window.location.href = url;
  } else {
    // //获取字符串 ? 后面的部分
    // let routUrl = url
    // let queryObj = {};
    // if(url.split('?').length==2){
    //   routUrl = url.split('?')[0];
    //   queryObj.queryStr = url.split('?')[1];
    // }
    // if(router.app.$router){
    //   router.push({
    //     path: routUrl,
    //     query: queryObj
    //   });
    // }
    window.open(url, "_blank");
    // window.open(url, "_blank", "newwindow", "noopener=yes");
    // window.location.href = url;
  }
}
