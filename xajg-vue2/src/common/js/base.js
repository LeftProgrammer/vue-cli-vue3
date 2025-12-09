import config from "@/config/config.js";
import moment from "moment";
import { Message } from "element-ui";
import { getFile, getFileById, getYljoaFileStream, getFilePath } from "@/api/user.js";
import { sectionNameById } from "@/api/common.js";
import { getDictItemTree } from "@/utils/auth.js";
import { getByCode } from "@/components/PbsSelect/api";
import { windowOpen, fromApp } from "@/utils/index";

// 以下方法已被自动注入原型链上使用 this.$setStore() 调用
/**
 * Set storage
 * @param name
 * @param content
 * @param maxAge
 */
function setStorage(name, content, maxAge = null) {
  if (!global.window || !name) {
    return;
  }
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  let storage = global.window.localStorage;
  storage.setItem(`${config.$prefix}_${name}`, content);
  if (maxAge && !isNaN(parseInt(maxAge))) {
    let timeout = parseInt(new Date().getTime() / 1000);
    storage.setItem(`${name}_expire`, timeout + maxAge);
  }
}

/**
 * Get storage
 *
 * @param name
 * @returns {*}
 */
function getStorage(name) {
  if (!global.window || !name) {
    return;
  }

  let content = window.localStorage.getItem(`${config.$prefix}_${name}`);
  let _expire = window.localStorage.getItem(`${name}_expire`);

  if (_expire) {
    let now = parseInt(new Date().getTime() / 1000);
    if (now > _expire) {
      return;
    }
  }

  try {
    return JSON.parse(content);
  } catch (e) {
    return content;
  }
}

/**
 * Clear storage
 *
 * @param name
 */
function clearStorage(name) {
  if (!global.window || !name) {
    return;
  }

  window.localStorage.removeItem(`${config.$prefix}_${name}`);
  window.localStorage.removeItem(`${name}_expire`);
}

/**
 * Clear all storage
 */
function clearStorageAll() {
  if (!global.window || !name) {
    return;
  }
  window.localStorage.clear();
}

/**
 * @param dicts 字典源
 * @param key 字典key
 */
function DictionaryParsing(Dictionary, key) {
  let text = "";
  if (Array.isArray(Dictionary)) {
    let a = Dictionary.find(
      (item) => item.dictCode == key || item.dictId == key
    );
    if (a) {
      text = a.dictName;
    }
  }
  return text;
}

/**
 * @param dicts 字典源
 * @param key 字典key
 * @computedSzie 将kb数据转换成mb
 */
function computedSzie(value) {
  let size = "";
  value = Number(value);
  // 如果非数字类型 转换成数字类型
  if (typeof value != "number") {
    return size;
  }
  // 否则 就开始计算
  value = value / 1024 / 1024;
  // 保留两位小数
  value = value.toFixed(2);
  size = value + "MB";
  return size;
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

/**
 * 预览文件
 * @export
 * @param {file} [file={blobType:'',attId:''}] 必须有 id 以及 blob类型
 * @returns
 */
export function previewFile(file) {
  if (file?.blobType && (file?.attId || file?.fileId)) {
    // 需要 获取到文件资源 然后在新开页面打开
    let params = {
      attId: file.attId || file.fileId,
    };
    getFile(params).then((res) => {
      // 这里需要判断文件的类型。 来设置blob 的类型
      let blob = new Blob([res], {
        type: `${file.blobType};chartset=UTF-8`,
      });
      let url = window.URL.createObjectURL(blob);
      // window.open(url, "_blank");
      windowOpen(url);
    });
  } else {
    Message.warning("请检查文件类型或文件id");
    return;
  }
}
/**
 * 下载
 * @export
 * @param {file} [file={attId:''}] 必须有 attId
 * @returns
 */
export function downFile(file) {
  let params = {
    attId: file.attId || file.fileId,
  };
  console.log("下载文件", file);
  if (params?.attId || params?.fileId) {
    getFile(params).then((res) => {
      console.log("资源", res);
      // 这里需要判断文件的类型。 来设置blob 的类型
      let blob = new Blob([res], {
        type: `${file.blobType};chartset=UTF-8`,
      });
      let url = window.URL.createObjectURL(blob);
      // 创建一个下载a标签  并且 下载文件的比关切赋值文件名称
      let a = document.createElement("a");
      a.href = url;
      if (file?.name) {
        a.download = file.name;
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  } else {
    Message.warning("请检查文件id");
    return;
  }
}

/**
 * 返回 blob
 * @export
 * @param {file} [file={blobType:'',attId:''}] 必须有 id 以及 blob类型
 * @returns
 */
export function getBlobFile(fileList) {
  return new Promise((resolve) => {
    let request = [];
    fileList.forEach((item) => {
      let params = {
        attId: item.fileId,
      };
      request.push(getFile(params));
    });
    Promise.all(request).then((res) => {
      res.forEach((item, index) => {
        let blob = new Blob([item], {
          type: `${fileList[index].blobType};chartset=UTF-8`,
        });
        let url = window.URL.createObjectURL(blob);
        fileList[index].url = url;
      });
      resolve(fileList);
    });
  });
}

export async function getImgBlobFile(fileId) {
  let params = {
    attId: fileId,
  };
  let data = await new Promise((resolve, reject) => {
    getFile(params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
  let blob = new Blob([data], {
    type: `image/jpeg;chartset=UTF-8`,
  });
  let url = window.URL.createObjectURL(blob);
  console.log("-----------------".url);
  return url;
}

/**
 * 下载
 * @export
 * @param //对象
 * @returns
 */
export function arrTostr(obj) {
  // 循环对象 判断对象 的属性是是不是数组  如果是数组 就转成字符串
  for (let key in obj) {
    if (obj[key] instanceof Array) {
      // 转成字符串
      obj[key] = obj[key].toString();
    }
  }

  return obj;
}

/**
 * 保留小数
 * @export
 * @val // 参数  任意
 * @returns
 */

export function formatValue(val) {
  let checkPlan = "" + val;
  checkPlan = checkPlan
    .replace(/[^\d.]/g, "") // 清除“数字”和“.”以外的字符
    .replace(/\.{2,}/g, ".") // 只保留第一个. 清除多余的
    .replace(/^\./g, "") // 保证第一个为数字而不是.
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  if (checkPlan.indexOf(".") < 0 && checkPlan !== "") {
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    checkPlan = parseFloat(checkPlan) + "";
  } else if (checkPlan.indexOf(".") >= 0) {
    checkPlan = checkPlan.replace(/^()*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
  }
  return checkPlan;
}

// zhengshui
export function inNumber(value) {
  value = value.replace(/^0+(\d)|[^\d]+/g, "");
  return value;
}

export async function getDitTree(type) {
  let res = await getDictItemTree(type);
  if (res.success) {
    return res.data || [];
  } else {
    return [];
  }
}

// 获取pbs信息
export async function getPbsInfoByCode(pbsCode) {
  // 如果code   包含的 &&&  就切割 然后取第一个
  // 判断是否包含&&&
  if (!pbsCode) {
    Message.info("请传递pbsCode");
    return "";
  }
  let res = await getByCode(pbsCode);
  const { success, data } = res;
  if (success) {
    return data;
  } else {
    return {};
  }
}

/**
 * office文件的后缀名
 */
export const OfficeSuffixNames = [
  ".ppt",
  ".pptx",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".pdf",
];

/**
 * 新版本预览文件
 * @export
 * @param {file} [file={blobType:'',attId:''}] 必须有 id 以及 blob类型
 * @returns
 */
//    get请求  参数 fileInfoId
export async function previewFileById(file) {
  console.log("预览", file);
  // fileId, blobType
  try {
    if (file.source === 'yljoa') {
      const a = document.createElement("a");
      a.setAttribute("target", "_blank")
      a.href = "/api/synthesis/oa/getOaFileStream?isDownload=0&url=" + encodeURI(file.url);
      document.body.appendChild(a);
      a.click();
      // 从文档中移除a标签
      document.body.removeChild(a);
      return
    }

    if (!file.fileId || !file.blobType) {
      Message.warning("请检查文件类型或文件id");
      return;
    }

    let blobType = file.blobType.toLowerCase();

    // 如果 预览的是word 文档 就直接下载
    let officeType = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
    if (officeType.includes(file.blobType)) {
      downFileById(file)
      return
    }
    // 转换为小写
    if (!file.blobType || blobType.includes("pdf")) {
      file.blobType = "application/pdf";
    }
    const params = {
      fileInfoId: file.fileId,
      fileName: file.name || '无标题',
      isDownload: 0
    };
    let res;
    if (file.source === 'yljoa') {
      // 文件用特定的获取接口
      res = await getYljoaFileStream(file.url);

      if (res.byteLength === 0) {
        Message.warning("预览文件失败，未找到文件");
        return;
      }

      // 判断文件类型并设置blob类型
      const blob = new Blob([res], {
        type: `${file.blobType};charset=UTF-8`,
      });

      const url = window.URL.createObjectURL(blob);
      // window.open(url, "_blank");
      windowOpen(url);
    } else {
      //预览时也不能使用文件流方式，
      res = await getFilePath(params);
      console.log("资源", res);
      if (res.success && res.data) {
        let url = new URL(res.data);
        console.log('url.pathname + url.searchurl.pathname + url.search', url.pathname + url.search)
        window.open(url.pathname + url.search, "_blank")
      } else {
        Message.warning("预览文件失败：" + res.message);
      }
    }
  } catch (error) {
    console.error("预览文件失败:", error);
    // 在这里添加错误处理代码，例如显示错误消息给用户
  }
}
// 新版本下载文件资源
export function downFileById(file) {

  if (file.source === 'yljoa') {
    // 文件直接下载
    const a = document.createElement("a");
    a.setAttribute("target", "_blank")
    a.href = "/api/synthesis/oa/getOaFileStream?isDownload=1&url=" + encodeURI(file.url);
    document.body.appendChild(a);
    a.click();
    // 从文档中移除a标签
    document.body.removeChild(a);
  } else {

    if (!file.fileId || !file.blobType) {
      Message.warning("请检查文件类型或文件id");
      return;
    }
    let param = {
      fileInfoId: file.fileId,
      fileName: file.name || '无标题',
      isDownload: 1
    }

    getFilePath(param)
      .then((res) => {
        console.log("资源", res);

        if (res.success && res.data) {
          let url = new URL(res.data);
          window.open(url.pathname + url.search, "_blank")
        } else {
          Message.warning("下载文件失败：" + res.message);
        }
        //不能使用流blob下载，流blob下载用户体验极差，在文件较大或者网络较差情况下，需要长时间等待，且没有文件下载提醒。
        // if (res.byteLength === 0) {
        //   Message.warning("下载文件失败，未找到文件");
        //   return;
        // }

        // const blob = new Blob([res], {
        //   type: `${file.blobType};charset=UTF-8`,
        // });

        // // 创建一个下载a标签并设置属性
        // const a = document.createElement("a");
        // a.href = window.URL.createObjectURL(blob);
        // a.download = file.name || "文件下载";

        // // 添加a标签到文档并触发下载
        // document.body.appendChild(a);
        // a.click();

        // // 从文档中移除a标签
        // document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("下载文件失败:", error);
        Message.warning("下载文件失败");
        // 在这里添加错误处理代码，例如显示错误消息给用户
      });
  }

}

// 获取分包标段信息
export async function getSectionNameById(id, continiu) {
  try {
    if (!id) {
      return "";
    }
    const res = await sectionNameById(id);
    const { success, data } = res;
    if (success && data.length > 0) {
      return data[0].name;
    } else {
      return "";
    }
  } catch (error) {
    console.error("请求错误:", error);
  }
}

/** 导出按钮操作 */
export async function handleExport(url, queryParams, fileName) {
  this.download(url, {
    ...queryParams
  }, fileName + '.xlsx')
}

export function calculateWidth(baseWidth) {
  // 获取屏幕宽度
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  // 计算相对于1920分辨率的宽度比例
  const widthRatio = screenWidth / 1920;

  // 计算在当前分辨率下的宽度
  const calculatedWidth = baseWidth * widthRatio;

  return `${calculatedWidth}`; // 返回带单位的宽度值
}

/**
 * 防抖函数
 * @param func 用户传入的防抖函数
 * @param wait 等待的时间
 * @param immediate 是否立即执行
 */
export function debounce(func, wait = 50, immediate = false) {
  // 缓存一个定时器id
  let timer = null
  let result
  const debounced = function (...args) {
    // 如果已经设定过定时器了就清空上一次的定时器
    if (timer) {
      clearTimeout(timer)
    }
    if (immediate) {
      const callNow = !timer
      // 等待wait的时间间隔后，timer为null的时候，函数才可以继续执行
      timer = setTimeout(() => {
        timer = null
      }, wait)
      // 未执行过，执行
      if (callNow) result = func.apply(this, args)
    } else {
      // 开始一个定时器，延迟执行用户传入的方法
      timer = setTimeout(() => {
        // 将实际的this和参数传入用户实际调用的函数
        func.apply(this, args)
      }, wait)
    }
    return result
  }
  debounced.cancel = function () {
    clearTimeout(timer)
    timer = null
  }
  // 这里返回的函数时每次用户实际调用的防抖函数
  return debounced
}


export function moneyFormat(val) {
  // 检查类型的值
  if (!val || typeof val !== 'number') {
    return ''
  }
  const formattedNumber = val.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return formattedNumber

}

export function visibleChange(e, id) {
  let ev = event.target;
  let rect = ev.getBoundingClientRect();
  let fromapp = fromApp()
  if (!e || !fromapp) {
    return
  }

  // 获取<body>元素
  let bodyElement = document.getElementsByTagName("body")[0];
  // 获取transform样式
  let transformStyle =
    bodyElement.style.transform ||
    window.getComputedStyle(bodyElement).getPropertyValue("transform");
  // 提取缩放值
  let styleArr = transformStyle.match(/scale\(([^)]+)\)/);
  if (!styleArr) {
    return
  }
  let scaleValue = styleArr[1];
  console.log("缩放值: " + scaleValue);
  // 获取当前
  setTimeout(() => {
    let dom = document.getElementsByClassName(id);
    for (let i = 0; i < dom.length; i++) {
      if (id === 'el-tooltip__popper') {
        dom[i].style.display = 'none';
      }
      if (dom[i].style.display === 'none') {
        continue;
      }
      // 获取top值
      let left = dom[i].style.left;
      let top = dom[i].style.top;
      if (parseInt(left) >= 0) {
        let nowLeft = parseInt(left) * (1 / scaleValue) + 'px';
        let nowTop = parseInt(top) * (1 / scaleValue) + 'px';
        dom[i].style.left = nowLeft;
        dom[i].style.top = nowTop;

      } else {
        // 长度超出，先定位到input
        let nowTop = parseInt(top) * (1 / scaleValue) + 'px';
        dom[i].style.left = parseInt(rect.left) * (1 / scaleValue) + 'px';
        dom[i].style.top = nowTop;
        // 然后设置自动换行
        let options = dom[i].getElementsByClassName('el-select-dropdown__item');
        for (let j = 0; j < options.length; j++) {
          options[j].style.height = 'auto';
          let span = options[j].getElementsByTagName('span')[0];
          span.style.whiteSpace = 'normal';
          span.style.wordWrap = 'break-word';
        }
      }

    }
  });
}



// 在main.js挂载
export default {
  clearStorageAll,
  setStorage,
  getStorage,
  clearStorage,
  DictionaryParsing,
  computedSzie,
  dateFormat,
  moneyFormat,
  previewFile,
  downFile,
  getBlobFile,
  getImgBlobFile,
  arrTostr,
  formatValue,
  inNumber,
  getPbsInfoByCode,
  previewFileById,
  downFileById,
  getSectionNameById,
  handleExport,
  debounce,
  visibleChange,
  calculateWidth
};
