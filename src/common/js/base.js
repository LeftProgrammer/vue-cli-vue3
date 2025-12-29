import config from "@/config/config.js";
import { ElMessage } from "element-plus";
import { getFile, getFileById, getYljoaFileStream, getFilePath } from "@/api/user.js";
import { sectionNameById } from "@/api/common.js";
import { getDictItemTree } from "@/utils/auth.js";
import { getByCode } from "@/components/PbsSelect/api";
import { windowOpen, fromApp, dateFormat as utilDateFormat, debounce as utilDebounce } from "@/utils/index";

/**
 * Set storage
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
  if (!global.window) {
    return;
  }
  window.localStorage.clear();
}

/**
 * 字典解析
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
 * 计算文件大小（KB转MB）
 */
function computedSzie(value) {
  let size = "";
  value = Number(value);
  if (typeof value != "number") {
    return size;
  }
  value = value / 1024 / 1024;
  value = value.toFixed(2);
  size = value + "MB";
  return size;
}

/**
 * 日期格式化方法
 */
export function dateFormat(date = new Date(), formatter = "YYYY-MM-DD") {
  return utilDateFormat(date, formatter);
}

/**
 * 预览文件
 */
export function previewFile(file) {
  if (file?.blobType && (file?.attId || file?.fileId)) {
    let params = {
      attId: file.attId || file.fileId,
    };
    getFile(params).then((res) => {
      let blob = new Blob([res], {
        type: `${file.blobType};chartset=UTF-8`,
      });
      let url = window.URL.createObjectURL(blob);
      windowOpen(url);
    });
  } else {
    ElMessage.warning("请检查文件类型或文件id");
    return;
  }
}

/**
 * 下载文件
 */
export function downFile(file) {
  let params = {
    attId: file.attId || file.fileId,
  };
  if (params?.attId || params?.fileId) {
    getFile(params).then((res) => {
      let blob = new Blob([res], {
        type: `${file.blobType};chartset=UTF-8`,
      });
      let url = window.URL.createObjectURL(blob);
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
    ElMessage.warning("请检查文件id");
    return;
  }
}

/**
 * 返回 blob
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
  return url;
}

/**
 * 数组转字符串
 */
export function arrTostr(obj) {
  for (let key in obj) {
    if (obj[key] instanceof Array) {
      obj[key] = obj[key].toString();
    }
  }
  return obj;
}

/**
 * 保留小数
 */
export function formatValue(val) {
  let checkPlan = "" + val;
  checkPlan = checkPlan
    .replace(/[^\d.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^\./g, "")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  if (checkPlan.indexOf(".") < 0 && checkPlan !== "") {
    checkPlan = parseFloat(checkPlan) + "";
  } else if (checkPlan.indexOf(".") >= 0) {
    checkPlan = checkPlan.replace(/^()*(\d+)\.(\d\d).*$/, "$1$2.$3");
  }
  return checkPlan;
}

/**
 * 只允许输入正整数
 */
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

/**
 * 获取pbs信息
 */
export async function getPbsInfoByCode(pbsCode) {
  if (!pbsCode) {
    ElMessage.info("请传递pbsCode");
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
 */
export async function previewFileById(file) {
  try {
    if (file.source === 'yljoa') {
      const a = document.createElement("a");
      a.setAttribute("target", "_blank")
      a.href = "/api/synthesis/oa/getOaFileStream?isDownload=0&url=" + encodeURI(file.url);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return
    }

    if (!file.fileId || !file.blobType) {
      ElMessage.warning("请检查文件类型或文件id");
      return;
    }

    let blobType = file.blobType.toLowerCase();
    let officeType = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
    if (officeType.includes(file.blobType)) {
      downFileById(file)
      return
    }
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
      res = await getYljoaFileStream(file.url);
      if (res.byteLength === 0) {
        ElMessage.warning("预览文件失败，未找到文件");
        return;
      }
      const blob = new Blob([res], {
        type: `${file.blobType};charset=UTF-8`,
      });
      const url = window.URL.createObjectURL(blob);
      windowOpen(url);
    } else {
      res = await getFilePath(params);
      if (res.success && res.data) {
        let url = new URL(res.data);
        window.open(url.pathname + url.search, "_blank")
      } else {
        ElMessage.warning("预览文件失败：" + res.message);
      }
    }
  } catch (error) {
    console.error("预览文件失败:", error);
  }
}

/**
 * 新版本下载文件资源
 */
export function downFileById(file) {
  if (file.source === 'yljoa') {
    const a = document.createElement("a");
    a.setAttribute("target", "_blank")
    a.href = "/api/synthesis/oa/getOaFileStream?isDownload=1&url=" + encodeURI(file.url);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    if (!file.fileId || !file.blobType) {
      ElMessage.warning("请检查文件类型或文件id");
      return;
    }
    let param = {
      fileInfoId: file.fileId,
      fileName: file.name || '无标题',
      isDownload: 1
    }
    getFilePath(param)
      .then((res) => {
        if (res.success && res.data) {
          let url = new URL(res.data);
          window.open(url.pathname + url.search, "_blank")
        } else {
          ElMessage.warning("下载文件失败：" + res.message);
        }
      })
      .catch((error) => {
        console.error("下载文件失败:", error);
        ElMessage.warning("下载文件失败");
      });
  }
}

/**
 * 获取分包标段信息
 */
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

/**
 * 导出按钮操作
 */
export async function handleExport(url, queryParams, fileName) {
  this.download(url, {
    ...queryParams
  }, fileName + '.xlsx')
}

/**
 * 计算相对宽度
 */
export function calculateWidth(baseWidth) {
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const widthRatio = screenWidth / 1920;
  const calculatedWidth = baseWidth * widthRatio;
  return `${calculatedWidth}`;
}

/**
 * 防抖函数
 */
export function debounce(func, wait = 50, immediate = false) {
  return utilDebounce(func, wait, immediate);
}

/**
 * 金额格式化
 */
export function moneyFormat(val) {
  if (!val || typeof val !== 'number') {
    return ''
  }
  const formattedNumber = val.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return formattedNumber
}

/**
 * 下拉框位置调整（移动端适配）
 */
export function visibleChange(e, id) {
  let ev = event.target;
  let rect = ev.getBoundingClientRect();
  let fromapp = fromApp()
  if (!e || !fromapp) {
    return
  }
  let bodyElement = document.getElementsByTagName("body")[0];
  let transformStyle =
    bodyElement.style.transform ||
    window.getComputedStyle(bodyElement).getPropertyValue("transform");
  let styleArr = transformStyle.match(/scale\(([^)]+)\)/);
  if (!styleArr) {
    return
  }
  let scaleValue = styleArr[1];
  setTimeout(() => {
    let dom = document.getElementsByClassName(id);
    for (let i = 0; i < dom.length; i++) {
      if (id === 'el-tooltip__popper') {
        dom[i].style.display = 'none';
      }
      if (dom[i].style.display === 'none') {
        continue;
      }
      let left = dom[i].style.left;
      let top = dom[i].style.top;
      if (parseInt(left) >= 0) {
        let nowLeft = parseInt(left) * (1 / scaleValue) + 'px';
        let nowTop = parseInt(top) * (1 / scaleValue) + 'px';
        dom[i].style.left = nowLeft;
        dom[i].style.top = nowTop;
      } else {
        let nowTop = parseInt(top) * (1 / scaleValue) + 'px';
        dom[i].style.left = parseInt(rect.left) * (1 / scaleValue) + 'px';
        dom[i].style.top = nowTop;
        let options = dom[i].getElementsByClassName('el-select-dropdown__item');
        for (let j = 0; j < options.length; j++) {
          options[j].style.height = 'auto';
          let span = options[j].getElementsByTagName('span')[0];
          if (span) {
            span.style.whiteSpace = 'normal';
            span.style.wordWrap = 'break-word';
          }
        }
      }
    }
  });
}

// 导出所有方法
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
