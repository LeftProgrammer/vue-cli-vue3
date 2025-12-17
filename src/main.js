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

const app = createApp(App);

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

app.use(ElementPlus, {
  size: "medium",
  locale: zhCn,
});

app.use(store).use(router).mount("#app");
