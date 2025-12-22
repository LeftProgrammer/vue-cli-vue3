import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "normalize.css/normalize.css";
import "@/styles/index.scss";
import "./permission";
import { download as handleExportDownload } from "@/utils/request";
import setupSvgIcon from "@/icons";
import draggable from "@/utils/dialogdrag";
import { fromApp } from "@/utils";

const app = createApp(App);

setupSvgIcon(app);

const bus = {
  arr: [],
  callbacks: {},
  on(eventname, callback) {
    if (!this.arr.includes(eventname)) {
      this.arr.push(eventname);
      this.callbacks[eventname] = [];
    }
    this.callbacks[eventname].push(callback);
  },
  emit(eventname, ...arg) {
    const cbs = this.callbacks[eventname];
    if (cbs && cbs.length) {
      cbs.forEach(cb => cb(...arg));
    }
  },
  off(eventname, callback) {
    const index = this.arr.indexOf(eventname);
    if (index > -1) {
      this.arr.splice(index, 1);
    }
    const cbs = this.callbacks[eventname];
    if (!cbs) return;
    if (callback) {
      this.callbacks[eventname] = cbs.filter(cb => cb !== callback);
    } else {
      delete this.callbacks[eventname];
    }
  },
};

app.config.globalProperties.$bus = bus;

// 兼容旧项目 this.$message / this.$confirm
app.config.globalProperties.$message = ElMessage;
app.config.globalProperties.$confirm = ElMessageBox.confirm;

// 兼容旧项目的本地存储工具
app.config.globalProperties.$getStorage = key => {
  if (!key) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return raw;
      }
    }
  } catch (e) {
    void e;
  }

  if (key === "userInfo") {
    return store.getters && store.getters.loginInfo;
  }
  return null;
};

app.config.globalProperties.$setStorage = (key, value) => {
  if (!key) return;
  try {
    const raw = typeof value === "string" ? value : JSON.stringify(value || {});
    window.localStorage.setItem(key, raw);
  } catch (e) {
    void e;
  }
};

// 兼容旧项目的导出工具
app.config.globalProperties.$handleExport = handleExportDownload;

app.config.globalProperties.$DictionaryParsing = (dictionary, key) => {
  let text = "";
  if (Array.isArray(dictionary)) {
    const a = dictionary.find(item => item && (item.dictCode == key || item.dictId == key));
    if (a) {
      text = a.dictName;
    }
  }
  return text;
};

app.config.globalProperties.$visibleChange = (visible, className) => {
  try {
    if (!visible || !fromApp()) {
      return;
    }

    const ev = (window.event && window.event.target) || null;
    if (!ev || !ev.getBoundingClientRect) {
      return;
    }
    const rect = ev.getBoundingClientRect();

    const bodyElement = document.getElementsByTagName("body")[0];
    if (!bodyElement) {
      return;
    }
    const transformStyle =
      bodyElement.style.transform ||
      window.getComputedStyle(bodyElement).getPropertyValue("transform");
    const styleArr = transformStyle && transformStyle.match(/scale\(([^)]+)\)/);
    if (!styleArr) {
      return;
    }
    const scaleValue = Number(styleArr[1]);
    if (!scaleValue) {
      return;
    }

    setTimeout(() => {
      const dom = document.getElementsByClassName(className);
      for (let i = 0; i < dom.length; i++) {
        if (className === "el-tooltip__popper") {
          dom[i].style.display = "none";
        }
        if (dom[i].style.display === "none") {
          continue;
        }
        const left = dom[i].style.left;
        const top = dom[i].style.top;
        if (parseInt(left) >= 0) {
          dom[i].style.left = parseInt(left) * (1 / scaleValue) + "px";
          dom[i].style.top = parseInt(top) * (1 / scaleValue) + "px";
        } else {
          dom[i].style.left = parseInt(rect.left) * (1 / scaleValue) + "px";
          dom[i].style.top = parseInt(top) * (1 / scaleValue) + "px";
          const options = dom[i].getElementsByClassName("el-select-dropdown__item");
          for (let j = 0; j < options.length; j++) {
            options[j].style.height = "auto";
            const span = options[j].getElementsByTagName("span")[0];
            if (span) {
              span.style.whiteSpace = "normal";
              span.style.wordWrap = "break-word";
            }
          }
        }
      }
    });
  } catch (e) {
    void e;
  }
};

app.directive("thousands", {
  mounted(el) {
    if (el.tagName.toLocaleUpperCase() !== "INPUT") {
      el = el.getElementsByTagName("input")[0];
    }

    if (!el) {
      return;
    }

    const numberValue = parseFloat(el.value.replace(/,/g, ""));
    if (!isNaN(numberValue)) {
      el.value = numberValue.toLocaleString("zh", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    el.onfocus = () => {
      if (el.value) {
        el.value = parseFloat(el.value.replace(/,/g, "")).toFixed(2);
      }
    };

    el.onblur = () => {
      const onBlurValue = parseFloat(el.value.replace(/,/g, ""));
      if (!isNaN(onBlurValue)) {
        el.value = onBlurValue.toLocaleString("zh", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
    };
  },
});

app.directive("draggable", draggable);

app.use(ElementPlus, {
  size: "medium",
  locale: zhCn,
});

app.use(store).use(router).mount("#app");
