import { fromApp } from "@/utils/index";
import store from "@/store";

export const BaseMixin = {
  data() {
    return {
      /**接口地址 */
      url: {
        list: "",
      },
      /**缩放比例 */
      displacement: {
        scale: 1,
        minScale: 1,
        maxScale: 2,
      },
    };
  },
  created() { },
  mounted() {
    this.initAppEle();
  },
  methods: {
    /**
     * 初始化缩放盒子
     * @returns
     */
    initMatrixBox() {
      let that = this;
      // 获取放大或缩小的区域DOM
      let matrix_box = document.querySelector("body");
      if (!matrix_box) {
        return;
      }
      matrix_box.addEventListener("touchstart", function (event) {
        var touches = event.touches;
        var events = touches[0];
        var events2 = touches[1];

        // event.preventDefault();

        // 第一个触摸点的坐标
        that.displacement.pageX = events.pageX;
        that.displacement.pageY = events.pageY;

        that.displacement.moveable = true;

        if (events2) {
          that.displacement.pageX2 = events2.pageX;
          that.displacement.pageY2 = events2.pageY;
        }

        that.displacement.originScale = that.displacement.scale || 1;
        // console.log(that.displacement);
      });
      document.addEventListener("touchmove", function (event) {
        if (!that.displacement.moveable) {
          return;
        }

        event.preventDefault();

        var touches = event.touches;
        var events = touches[0];
        var events2 = touches[1];
        // 双指移动
        if (events2) {
          // 第2个指头坐标在touchmove时候获取
          if (!that.displacement.pageX2) {
            that.displacement.pageX2 = events2.pageX;
          }
          if (!that.displacement.pageY2) {
            that.displacement.pageY2 = events2.pageY;
          }

          // 双指缩放比例计算
          var zoom =
            that.getDistance(
              {
                x: events.pageX,
                y: events.pageY,
              },
              {
                x: events2.pageX,
                y: events2.pageY,
              }
            ) /
            that.getDistance(
              {
                x: that.displacement.pageX,
                y: that.displacement.pageY,
              },
              {
                x: that.displacement.pageX2,
                y: that.displacement.pageY2,
              }
            );
          // 应用在元素上的缩放比例
          var newScale = that.displacement.originScale * zoom;
          // 最大缩放比例限制
          if (newScale > that.displacement.maxScale) {
            newScale = that.displacement.maxScale;
          }
          //设置缩放的最小值
          if (newScale < that.displacement.minScale) {
            newScale = that.displacement.minScale;
          }
          // 记住使用的缩放值
          that.displacement.scale = newScale;
          // 图像应用缩放效果
          // console.log(newScale);
          matrix_box.style.transform = "scale(" + newScale + ")";
          // 设置旋转元素的基点位置
          matrix_box.style.transformOrigin = "0px 0px 0px";
        }
      });
    },
    getDistance(start, stop) {
      // Math.hypot()计算参数的平方根
      return Math.hypot(stop.x - start.x, stop.y - start.y);
    },
    /**
     * 添加app
     */
    initAppEle() {
      if (this.fromapp) {
        console.log("fromapp initAppEle ...................................");
        let app = document.querySelector("body");
        if (app) {
          app.classList.add("fromapp");

          console.log(this.$route)
          //针对apph5页面单独处理
          if (this.$route.path.indexOf("/apph5/") == 0) {
            app.classList.add("apph5");
            return;
          }

          let html = document.querySelector("html");
          let htmlWidth = html.clientWidth;

          let appWidth = app.clientWidth;
          let scale = htmlWidth / appWidth;
          this.displacement.scale = scale;
          this.displacement.minScale = scale;
          app.style.transform = `scale(${scale})`;

          this.initMatrixBox();
        }
      }
    },
    //通过permCode获取按钮权限
    getMenuButtonItems(menus, permCode) {
      if (!permCode) {
        return null;
      }
      if (menus.length === 0) {
        return [];
      }
      let item = menus.find((x) => x.permCode === permCode);
      if (item && item.children && item.children.length) {
        return item.children.filter((x) => x.permType === 2);
      } else {
        let childs = [];
        for (let i = 0; i < menus.length; i++) {
          const menu = menus[i];
          if (menu.children && menu.children.length > 0) {
            childs.push(...menu.children);
          }
        }
        return this.getMenuButtonItems(childs, permCode);
      }
    },
    /**获取字典数据 */
    getDictItems(code) {
      return this.$store.dispatch("dict/get", code);
    },
    /**获取url的参数 */
    getQueryString(url, name) {
      const urlString = url.replaceAll("#/", ""); //'http://localhost:8087/design/center/plan?permCode=design-center-plan';
      const urlObj = new URL(urlString);
      return urlObj.searchParams.get(name);
    },
  },
  computed: {
    /**获取path */
    permCode() {
      let code = null;
      if (window.parent) {
        let url = window.parent.location.href;
        code = this.getQueryString(url, "permCode");
      }
      return code;
    },
    /**按钮权限 */
    buttonResources() {
      const route = this.$route;
      const { query } = route;
      // if set path, the sidebar will highlight the path you set
      let permCode;
      if (query && query.permCode) {
        permCode = query.permCode;
      }

      let items = this.getMenuButtonItems(store.getters.menuRoutes, permCode);
      let btns = items.map((x) => x.value);
      return btns;
    },
    /**是否来自app */
    fromapp() {
      let fromapp = fromApp();
      return fromapp;
    },
    userInfo() {
      return this.$getStorage("userInfo");
    },
    isSystem() {
      return (
        this.userInfo?.username === "system" ||
        this.userInfo?.username === "super"
      );
    },
    /**
     * 超级管理账号，只有查看权限；无其他权限
     */
    isMdgAdmin() {
      return this.userInfo?.username === "mdgglj";
    },
  },
  watch: {},
  destroyed() { },
};
