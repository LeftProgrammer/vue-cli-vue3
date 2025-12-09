import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "normalize.css/normalize.css";
import "@/styles/index.scss";
import "./permission";

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
      cbs.forEach((cb) => cb(...arg));
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
      this.callbacks[eventname] = cbs.filter((cb) => cb !== callback);
    } else {
      delete this.callbacks[eventname];
    }
  },
};

app.config.globalProperties.$bus = bus;

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
});

app.use(store).use(router).mount("#app");
