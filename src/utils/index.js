export function fromApp() {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

// 简单日期格式化：默认输出 YYYY-MM-DD HH:mm:ss
export function dateFormat(date, _formatter = "YYYY-MM-DD HH:mm:ss") {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const pad = n => (n < 10 ? `0${n}` : `${n}`);

  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const s = pad(d.getSeconds());

  return `${y}-${m}-${day} ${h}:${mi}:${s}`;
}

export function computeTimeDuration(startTime, endTime) {
  const toDate = t => {
    if (t instanceof Date) return t;
    if (typeof t === "number") return new Date(t);
    if (typeof t === "string") {
      const safe = t.replace(/-/g, "/");
      const d = new Date(safe);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return null;
  };

  const date1 = toDate(startTime);
  const date2 = toDate(endTime);
  if (!date1 || !date2) {
    return { durationText: "", days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const dateDiff = date2.getTime() - date1.getTime();
  const days = Math.floor(dateDiff / (24 * 3600 * 1000));
  const residue1 = dateDiff % (24 * 3600 * 1000);
  const hours = Math.floor(residue1 / (3600 * 1000));
  const residue2 = residue1 % (3600 * 1000);
  const minutes = Math.floor(residue2 / (60 * 1000));
  const residue3 = residue2 % (60 * 1000);
  const seconds = Math.round(residue3 / 1000);

  const durationText =
    (days === 0 ? "" : `${days}天`) +
    (hours === 0 ? "" : `${hours}时`) +
    (minutes === 0 ? "" : `${minutes}分`) +
    (seconds === 0 ? "" : `${seconds}秒`);

  return {
    durationText,
    days,
    hours,
    minutes,
    seconds,
  };
}

export function windowOpen(url, target = "_blank") {
  if (!url) return;
  try {
    window.open(url, target);
  } catch (e) {
    void e;
  }
}

// 解析时间
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

// 格式化时间
export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
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

// 生成 GUID
export function guid() {
  return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/x/g, () =>
    Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase()
  );
}

// 防抖函数
export function debounce(fn, wait, immediate) {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) fn.apply(this, arguments);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, wait);
    }
  };
}

// 表单重置（需要在 Vue 组件中使用）
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加 iframe
export function addFrame(url = "", width = "100px", height = "100px") {
  return `<iframe src="${url}" width="${width}" height="${height}" frameborder="0"></iframe>`;
}

// 预览 PDF 文件
export function viewPdf(fileUrl = "", isOpen = true) {
  const extension = fileUrl.split(".").pop().toUpperCase();
  if (extension !== "PDF") {
    console.error("文件格式错误：只能预览PDF文件");
    return;
  }
  const pdfUrl = isOpen
    ? `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`
    : `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
  window.open(pdfUrl, "_blank");
}
