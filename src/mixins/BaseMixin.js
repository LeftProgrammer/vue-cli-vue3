import { fromApp } from "@/utils";
import store from "@/store";

export const BaseMixin = {
  data() {
    return {
      // 接口地址（列表等）
      url: {
        list: "",
      },
      // 移动端缩放相关参数
      displacement: {
        scale: 1,
        minScale: 1,
        maxScale: 2,
      },
    };
  },
  created() {},
  mounted() {
    this.initAppEle();
  },
  methods: {
    // 初始化缩放盒子（移动端双指缩放 body）
    initMatrixBox() {
      const that = this;
      const matrixBox = document.querySelector("body");
      if (!matrixBox) return;

      matrixBox.addEventListener("touchstart", (event) => {
        const touches = event.touches;
        const events = touches[0];
        const events2 = touches[1];

        that.displacement.pageX = events.pageX;
        that.displacement.pageY = events.pageY;
        that.displacement.moveable = true;

        if (events2) {
          that.displacement.pageX2 = events2.pageX;
          that.displacement.pageY2 = events2.pageY;
        }

        that.displacement.originScale = that.displacement.scale || 1;
      });

      document.addEventListener(
        "touchmove",
        (event) => {
          if (!that.displacement.moveable) return;
          event.preventDefault();

          const touches = event.touches;
          const events = touches[0];
          const events2 = touches[1];

          if (events2) {
            if (!that.displacement.pageX2) {
              that.displacement.pageX2 = events2.pageX;
            }
            if (!that.displacement.pageY2) {
              that.displacement.pageY2 = events2.pageY;
            }

            const zoom =
              that.getDistance(
                { x: events.pageX, y: events.pageY },
                { x: events2.pageX, y: events2.pageY }
              ) /
              that.getDistance(
                { x: that.displacement.pageX, y: that.displacement.pageY },
                { x: that.displacement.pageX2, y: that.displacement.pageY2 }
              );

            let newScale = (that.displacement.originScale || 1) * zoom;
            if (newScale > that.displacement.maxScale) {
              newScale = that.displacement.maxScale;
            }
            if (newScale < that.displacement.minScale) {
              newScale = that.displacement.minScale;
            }

            that.displacement.scale = newScale;
            matrixBox.style.transform = `scale(${newScale})`;
            matrixBox.style.transformOrigin = "0px 0px 0px";
          }
        },
        { passive: false }
      );
    },
    getDistance(start, stop) {
      return Math.hypot(stop.x - start.x, stop.y - start.y);
    },
    // fromApp 时初始化 body 缩放、class 等
    initAppEle() {
      if (!this.fromapp) return;
      const app = document.querySelector("body");
      if (!app) return;

      app.classList.add("fromapp");

      // apph5 单独处理
      if (this.$route && this.$route.path.indexOf("/apph5/") === 0) {
        app.classList.add("apph5");
        return;
      }

      const html = document.querySelector("html");
      if (!html) return;
      const htmlWidth = html.clientWidth;
      const appWidth = app.clientWidth || htmlWidth || 0;
      if (!appWidth) return;

      const scale = htmlWidth / appWidth;
      this.displacement.scale = scale;
      this.displacement.minScale = scale;
      app.style.transform = `scale(${scale})`;

      this.initMatrixBox();
    },
    // 递归获取当前菜单下按钮资源
    getMenuButtonItems(menus, permCode) {
      if (!permCode) return null;
      if (!menus || menus.length === 0) return [];
      const item = menus.find((x) => x.permCode === permCode);
      if (item && item.children && item.children.length) {
        return item.children.filter((x) => x.permType === 2);
      }
      const children = [];
      menus.forEach((menu) => {
        if (menu.children && menu.children.length > 0) {
          children.push(...menu.children);
        }
      });
      return this.getMenuButtonItems(children, permCode);
    },
    // 获取字典数据（委托给 dict 模块）
    getDictItems(code) {
      if (!code || !this.$store) return Promise.resolve([]);
      return this.$store.dispatch("dict/get", code);
    },
    // 从 URL 中获取指定查询参数
    getQueryString(url, name) {
      if (!url || !name) return null;
      try {
        const urlString = url.replaceAll("#/", "");
        const urlObj = new URL(urlString);
        return urlObj.searchParams.get(name);
      } catch (e) {
        return null;
      }
    },
  },
  computed: {
    // 获取 permCode（通过父窗口 URL）
    permCode() {
      let code = null;
      try {
        if (window.parent) {
          const url = window.parent.location.href;
          code = this.getQueryString(url, "permCode");
        }
      } catch (e) {
        void e;
      }
      return code;
    },
    // 当前路由下拥有的按钮权限值集合
    buttonResources() {
      const route = this.$route || {};
      const { query } = route;
      let permCode = null;
      if (query && query.permCode) {
        permCode = query.permCode;
      }
      const menus = (store.getters && store.getters.menuRoutes) || [];
      const items = this.getMenuButtonItems(menus, permCode) || [];
      return items.map((x) => x.value);
    },
    // 是否来自 app
    fromapp() {
      return fromApp();
    },
    // 当前用户信息（从本地存储或 Vuex）
    userInfo() {
      if (this.$getStorage) {
        const info = this.$getStorage("userInfo");
        if (info) return info;
      }
      return (this.$store && this.$store.getters && this.$store.getters.loginInfo) || {};
    },
    // 是否系统账号
    isSystem() {
      const username = this.userInfo && this.userInfo.username;
      return username === "system" || username === "super";
    },
    // 是否特殊 admin 账号
    isMdgAdmin() {
      const username = this.userInfo && this.userInfo.username;
      return username === "mdgglj";
    },
  },
};
