import flow from "@/utils/flow";
import { ListMixin } from "@/mixins/ListMixin";
import { getDictItemList } from "@/api/dict";
import { mapGetters } from "vuex";
import FlowDialog from "@/components/FlowHandle/Dialog";
import FlowButton from "@/components/FlowHandle/Button";
import FlowStatus from "@/components/FlowHandle/Status";
import FlowHandler from "@/components/FlowHandle/Handler";
import FlowNode from "@/components/FlowHandle/Node";

export const FlowListMixin = {
  mixins: [ListMixin],
  components: {
    FlowDialog,
    FlowButton,
    FlowStatus,
    FlowHandler,
    FlowNode,
  },
  props: {
    // 用于列表被其他页面作为子组件时，无法根据路由地址获取流程id
    pathForFlowInfo: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      /**
       * 流程状态
       * mine我的模板(初始) todo待办 done已办 wait待发 sent已发 fine办结 term终止 cc抄送
       *  * 1 待办 2 已办 3 抄送 4 待发 5 已发 6 办结 7 终止
       */
      flowPageStatus: {
        0: "mine",
        1: "todo",
        2: "done",
        3: "cc", //"wait",
        4: "wait", //"sent",
        5: "sent", //"fine",
        6: "fine",
        7: "term",
      },
      /**流程状态 */
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
      /**流程对应关系 */
      flowPackageOptions: [], //FLOW_PACKAGE_DICT

      //标识符：flow数据是否处理完成
      flowInited: false,

      /**流程名称 */
      flowName: "",
      /**流程id */
      flowId: "",
      /**流程弹窗 */
      flowShow: false,
      // /**流程状态 */
      // flowPage: "mine",
      /**流程弹窗信息 */
      flowInfo: {
        /**供应计划流程：流程id */
        businessId: "",
        // flowCfgId: "P1131979769345212416",
        /**状态 */
        status: "mine", //待办是todo，已办done，已发sent，
      },
    };
  },
  created() {
    // this.getFlowPackageOptions();
    this.getFlowData();
    this.getFlowStatus();
    // flow.init(this.flowName);
    console.log("this.$route.query", this.$route);
  },
  mounted() { },
  methods: {
    /**获取流程信息 */
    async getFlowData(otherPath) {
      //分别对应：列表打开form，和待办入口打开form
      let flowinfo = await flow.getFlowData(otherPath || this.flowPath)
      // console.log("分别对应：列表打开form，和待办入口打开form", otherPath, flowinfo);
      if (flowinfo) {
        let { flowName, flowId } = flowinfo;
        this.flowName = flowName;
        this.flowId = flowId;
        // console.log("监听flowId", flowId);
      } else {
        console.error("字典流程包配置中缺失内容", val, this.permCode);
      }
    },
    /**获取字典数据 */
    getDictItems(code) {
      return this.$store.dispatch("dict/get", code);
    },
    //刷新列表数据
    childEvtHandle(data) {
      this.$bus.emit("updateTodoNum");
      console.log("childEvtHandle", data);
      if (typeof this.getTableData === "function") this.getTableData();
      this.flowShow = false;
      return;
      /**刷新流程数据缓存 */
      if (
        (data.page === "todo" && data.type === "close") ||
        (data.page === "mine" && data.btnKey === "save") ||
        (data.page === "wait" && data.btnKey === "send")
      ) {
        //待办时，刷新已办和待办
        flow.refresh(this.flowName);
      }
    },
    closeDialog() {
      return;
      flow.refresh(this.flowName);
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
    /**获取流程状态字典 */
    getFlowStatus() {
      this.$store.dispatch("dict/get", "PROC_TASK_TODO_STATUS").then((data) => {
        this.flowStatusOptions = data;
      });
    },
    /**获取流程状态字典 */
    getFlowPackageOptions() {
      this.$store.dispatch("dict/get", "FLOW_PACKAGE_DICT").then((data) => {
        console.log('获取流程状态字典获取流程状态字典', data)
        this.flowPackageOptions = data;
      });
    },
    handelShowDialog(row, page, task) {
      console.log("handelShowDialog，btn点击事件最后传递", row, page, task);
      // 存下当前页面的类型 以便于 关闭弹窗使用
      this.$setStorage("flow_page_type", page);
      if (task) {
        this.flowInfo.businessId = task.businessId; //"1154462751884574720"
        this.flowInfo.taskId = task.procTaskId || task.pacId; //"1138529946507935744"
        this.flowInfo.procTaskId = task.procTaskId || task.pacId; //"1138529946507935744"
        this.flowInfo.status = task.suspended; //
      } else {
        // console.log('handelShowDialoghandelShowDialogthis.flowId', this.flowId)
        this.flowInfo.businessId = this.flowId;
        // this.flowInfo.businessId = task.businessId;
      }
      this.flowInfo.page = page;
      if (row != null) {
        row.flowInfo = this.flowInfo;
        localStorage.setItem(this.storageKey, JSON.stringify(row));
      } else {
        localStorage.removeItem(this.storageKey);
      }
      this.flowShow = true;
    },
  },
  computed: {
    /**获取路径，用以流程信息 */
    flowPath() {
      console.log("flowPath", this.otherPath);
      let path = this.pathForFlowInfo || this.$route.path;
      return path;
    },
    /**计算存储key */
    storageKey() {
      return "flow_data_row_" + this.flowId;
    },
    ...mapGetters(["sidebar", "menuRoutes"]),
    /**新增按钮权限 */
    // isShowButton() {
    //   // const roles = this.$store.getters.loginInfo.roles;
    //   // return roles ? roles.includes("service-specialist") : false;
    //   return true;
    // },
    buttonResources() {
      const route = this.$route;
      const { query } = route;
      // if set path, the sidebar will highlight the path you set
      let permCode;
      if (query && query.permCode) {
        permCode = query.permCode;
      }

      let items = this.getMenuButtonItems(this.menuRoutes, permCode);
      return items.map((x) => x.value);
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
  destroyed() { },
  watch: {
    /**监听名称变化时，进行初始化流程数据 */
    flowName(val) {
      if (val) {
        return;
        flow.init(val, () => {
          this.flowInited = true;
        });
      }
    },
    /**流程包字典数据处理 */
    flowPackageOptions(val) {
      console.log('流程包字典数据处理', val)
      if (val && val.length > 0) {
        // 用于列表被其他页面作为子组件时，无法根据路由地址获取流程id
        let path = this.flowPath;
        console.log(path);
        let flowinfo = flow.getFlowInfo(val, { path: path });
        if (flowinfo) {
          let { flowName, flowId } = flowinfo;
          this.flowName = flowName;
          this.flowId = flowId;
        } else {
          console.error("字典流程包配置中缺失内容", val, path);
        }
      } else {
        console.error("字典流程包配置中缺失内容 flowPackageOptions", val);
      }
    },
    /**关闭弹窗时，删除缓存 */
    flowShow(val) {
      if (!val) {
        localStorage.removeItem(this.storageKey);
      }
    },
  },
};
