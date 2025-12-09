<template>
  <div class="page-content">
    <common-card title="工程面貌">
      <template #default>
        <xa-swiper></xa-swiper>
      </template>
    </common-card>
    <common-card title="设计管理">
      <template #default>
        <xa-design-manerge></xa-design-manerge>
      </template>
    </common-card>
    <common-card title="进度展示">
      <template #default>
        <construction-progress :chartsDataProp="chartsData"></construction-progress>
      </template>
    </common-card>
    <common-card title="待办事项">
      <template #default>
        <xa-todo-list></xa-todo-list>
      </template>
    </common-card>
    <common-card title="质量管理">
      <template #default>
        <xa-quality-control style="height: calc(50vh - 164px)"></xa-quality-control>
      </template>
    </common-card>
    <common-card title="安全管理">
      <template #default>
        <xa-security-management
          style="height: calc(50vh - 164px)"
        ></xa-security-management>
      </template>
    </common-card>
  </div>
</template>

<script>
// import autofit from "autofit.js";
import xaSwiper from "./components/xaSwiper.vue";
import xaDesignManerge from "./components/xaDesignManerge.vue";
// import mdgProgressShow from "./components/mdgProgress.vue";
import xaTodoList from "./components/xaTodoList.vue";
import xaQualityControl from "./components/xaQualityControl.vue";
import xaSecurityManagement from "./components/xaSecurityManagement.vue";
// import mdgQuickEntry from "./components/mdgQuickEntry.vue";
// import mdgWarning from "./components/mdgWarning.vue";
// import mdgFlowReturnNotice from "./components/mdgFlowReturnNotice.vue";
import commonCard from "./components/commonCard.vue";

import * as echarts from "echarts";
import { permissions } from "./components/api.js";
import constructionProgress from "./components/constructionProgress.vue";
import {
  getPermissionsByUserId,
  setPermissions,
  warningStatByType,
  getStatisticsInfo
} from "./api.js";
import * as UrlUtil from "@/utils/url";
// import ChangePassword from "@/components/ChangePassword/index";
import { mapGetters } from "vuex";

export default {
  components: {
    xaSwiper,
    xaDesignManerge,
    // mdgProgressShow,
    xaTodoList,
    xaQualityControl,
    xaSecurityManagement,
    // mdgQuickEntry,
    // mdgWarning,
    // ChangePassword,
    // mdgFlowReturnNotice,
    constructionProgress,
    commonCard
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      dataSource: {},
      scaleFactor: 1, // 默认缩放比例为 1
      componentList: [],
      promiseTree: "",
      showDrawer: false,
      defaultProps: {},
      editShow: false,
      warningDuration: this.$store.state.systemConfig?.warningDuration || 4000,
      chartsData: []
    };
  },
  async created() {
    // 预警提醒
    localStorage.getItem("warning");
    if (
      localStorage.getItem("warning") === "0" &&
      this.permissions.includes("monitor-data")
    ) {
      const h = this.$createElement;
      let res = await warningStatByType({});
      if (res.success && res.data.length > 0) {
        let warningData = [...res.data].reverse();
        localStorage.setItem("warning", "1");
        this.$notify({
          title: "",
          dangerouslyUseHTMLString: true,
          position: "bottom-right",
          duration: this.warningDuration,
          showClose: false,
          customClass: "waring-box",
          message: h("mdgWarning", {
            ref: "mdgWarning",
            props: { appVueModel: this, warningData: warningData }
          })
        });
      }
    }
  },
  mounted() {
    // 监听屏幕变化
    window.addEventListener("resize", this.initScalc);
    this.$nextTick(() => {
      this.initScalc();
    });

    // 计算缩放比例
    // autofit.init({
    //   dh: 500, //设计稿的高度，默认是 929 ，如果项目以全屏展示，则可以设置为1080
    //   dw: 1000, //设计稿的宽度，默认是 1920
    //   el: "#mdg-homeIndex", //渲染的dom，默认是 "#app"，必须使用id选择器
    //   resize: true, //是否监听resize事件，默认是 true
    // });
    let userInfo = this.$getStorage("userInfo");
    if (userInfo && userInfo.needUpdatePassword === 2) {
      return;
    }
    this.getPermissions();
  },
  methods: {
    async init_BAK() {
      let res = await getStatisticsInfo({});
      this.dataSource = res.data.progress;
      console.log("this.dataSourcethis.dataSource");
      let chartDom = document.getElementById("chart_state");
      let myChart = echarts.init(chartDom);
      const options = {
        xAxis: {
          type: "category",
          data: this.dataSource.map((x) => x.name)
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: this.dataSource.map((item) => {
              const planNum = Number(item.totalPlanNum || 0);
              const actualNum = Number(item.totalActualNum || 0);
              let actualRate = 0;
              if (planNum > 0) {
                return (actualRate = Math.round((actualNum / planNum) * 100));
              }
            }),
            type: "bar",
            color: "#014ACB",
            label: {
              show: true,
              position: "top",
              fontSize: 16
            }
          }
        ]
      };
      myChart.setOption(options);
    },

    getUrl(initem) {
      let url = "/static/img/home/notImage.png";
      if (initem.permIcon) {
        url = initem.permIcon;
      }
      return url;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    async sure() {
      let nodes = this.$refs.promiseTree.getCheckedNodes();
      // 循环数据 取出是叶子节点的数据
      let arr = [];
      if (nodes) {
        arr = nodes.filter((x) => x.leaf);
      }
      this.componentList = arr.slice(0, 12);
      this.showDrawer = false;
      let newArr = this.componentList.map((x) => {
        return {
          dataViewConfId: x.dataViewConfId,
          permCode: x.permCode,
          permId: x.permId,
          permIcon: x.permIcon,
          name: x.name
        };
      });
      console.log("设置权限", newArr);
      await setPermissions(newArr);
    },
    setKey(arrKeys) {
      // 找出id 设置选中
      this.$refs.promiseTree.setCheckedKeys(arrKeys);
    },
    // 常用功能编辑
    editPromise() {
      this.showDrawer = true;
      // 获取所有的权限按钮
      // 设置选中
      let arr = this.componentList.map((x) => {
        return x.permId;
      });
      this.$nextTick(() => {
        this.setKey(arr);
      });
    },
    initScalc() {
      var designWidth = 1920;
      var designHeight = 1080;
      var scaleFactors = this.setScalc(designWidth, designHeight);
      this.scaleFactor = scaleFactors.scaleX;

      const baseChartHeight = 300; // Base height of each chart at design resolution
      const scaledChartHeight = baseChartHeight * scaleFactors.scaleX; // Or use scaleFactors.scaleY

      this.chartsData.forEach((chartConfig) => {
        if (chartConfig.dom && chartConfig.instance) {
          chartConfig.dom.style.height = scaledChartHeight + "px";
          chartConfig.instance.resize();
        }
      });

      // If using el-carousel, dynamically adjust its container height
      const carouselElement = this.$refs.chartCarousel?.$el; // Get carousel root element via ref
      if (carouselElement) {
        const extraHeightForTitle = 50; // Adjust based on title/padding inside carousel item
        carouselElement.style.height = scaledChartHeight + extraHeightForTitle + "px";
      }
    },
    setScalc(designWidth, designHeight) {
      // 获取当前屏幕宽度和高度
      var screenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      var screenHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;

      // 计算缩放比例
      var scaleX = screenWidth / designWidth;
      var scaleY = screenHeight / designHeight;

      // 返回一个包含缩放比例的对象
      return {
        scaleX: scaleX,
        scaleY: scaleY
      };
    },
    // 快捷跳转
    toPath(item) {
      console.log("item", item);
      if (
        item.dataViewConfId.includes("http://") ||
        item.dataViewConfId.includes("https://")
      ) {
        let url = UrlUtil.computeUrl(item.dataViewConfId);
        window.open(url);
      } else {
        // 路由跳转
        this.$router.push({
          path: item.dataViewConfId
        });
      }
    },
    // 获取 菜单
    async getPermissions() {
      try {
        const res = await permissions();
        const { data, success } = res;
        if (!success) {
          // 提示获取用户资源错误
          this.$message.error("获取用户资源失败！！！");
          return;
        }

        if (data && Array.isArray(data)) {
          // 获取WEB应用
          let webApp = data.find((item) => item.name === "WEB应用");
          // 获取当前 用户拥有 的菜单权限code
          const { permissions, userId } = this.$getStorage("userInfo");
          let arr = JSON.parse(JSON.stringify(webApp.children));
          // 查找出自己的权限按钮
          // 获取当前 用户拥有 的菜单权限code
          let list = this.recursionTree(arr, [], "", permissions);
          // console.log("所有的菜单", list);
          if (list.length > 12) {
            this.editShow = true;
          } else {
            this.editShow = false;
          }
          this.myPromiseTree(arr, "", permissions);
          console.log("ARR", arr);
          this.promiseTree = arr;
          // 请求 当前登录人 常用功能 数据 渲染 列表
          const resPrm = await getPermissionsByUserId({ userId: userId });
          console.log("常用功能", resPrm);
          if (!resPrm.success) {
            this.componentList = [];
            this.$message.error("获取常用功能失败！！！");
            return;
          }
          if (resPrm.data && Array.isArray(resPrm.data)) {
            this.componentList = resPrm.data.splice(0, 12);
          } else {
            // 如果返回的data 不是数组类型 说明是第一次修改   去前面 12个权限
            // 取12个出来
            this.componentList = list.slice(0, 12);
          }
        } else {
          this.componentList = [];
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        // 处理错误，例如显示错误信息
        this.$message.error("获取用户资源失败！！！");
      }
    },
    // 递归tree  找出所有的 leaf为true 的数据
    recursionTree(data, list = [], permIcon = "", permissions) {
      data.forEach((item) => {
        if (permIcon) {
          item.permIcon = permIcon;
        }
        if (item.leaf) {
          if (permissions.includes(item.permCode) && item.permCode !== "home") {
            list.push(item);
          }
        }
        if (item.children) {
          this.recursionTree(item.children, list, item.permIcon, permissions);
        }
      });
      return list;
    },

    // 递归tree  找出自己的权限树
    myPromiseTree(data, permIcon = "", permissions) {
      // 逆向循环，这样在删除项时不会影响后续的循环
      for (let index = data.length - 1; index >= 0; index--) {
        const item = data[index];
        if (permIcon || item.permIcon) {
          item.permIcon = permIcon || item.permIcon;
        }
        if (permissions.includes(item.permCode) && item.permCode !== "home") {
          if (item.children) {
            this.myPromiseTree(item.children, item.permIcon, permissions);
          }
        } else {
          data.splice(index, 1);
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page-content {
  background-color: #f0f4f8 !important;
  padding: 0 !important;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
  height: 100%;
}

.pointer:hover {
  transform: scale(1.1);
  z-index: 1;
  position: relative;
}

.todo-empty {
  /deep/ img {
    width: 100%;
    height: 100%;
  }

  /deep/ .el-empty__description {
    margin-top: 20px;
    color: #98a9ba;
    font-size: 12px;
  }
}

/deep/ .el-drawer__body {
  padding: 0 10px;
}

/deep/ .el-notification {
  padding: 0 !important;
}
.carousel {
  height: 100%;
}
.container {
  height: 320px;
  display: flex;
  flex-direction: column;
}
</style>
