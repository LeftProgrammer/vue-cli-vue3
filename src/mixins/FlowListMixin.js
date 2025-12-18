import flow from "@/utils/flow";
import { ListMixin } from "@/mixins/ListMixin";
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
    pathForFlowInfo: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      flowPageStatus: {
        0: "mine",
        1: "todo",
        2: "done",
        3: "cc",
        4: "wait",
        5: "sent",
        6: "fine",
        7: "term",
      },
      flowStatusOptions: [],
      flowPackageOptions: [],
      flowInited: false,
      flowName: "",
      flowId: "",
      flowShow: false,
      flowInfo: {
        businessId: "",
        status: "mine",
      },
    };
  },
  created() {
    this.getFlowData();
    this.getFlowStatus();
  },
  methods: {
    async getFlowData(otherPath) {
      try {
        const flowinfo = await flow.getFlowData(otherPath || this.flowPath);
        if (flowinfo) {
          const { flowName, flowId } = flowinfo;
          this.flowName = flowName;
          this.flowId = flowId;
        }
      } catch (e) {
        void e;
      }
    },
    getFlowStatus() {
      this.$store.dispatch("dict/get", "PROC_TASK_TODO_STATUS").then((data) => {
        this.flowStatusOptions = data || [];
      });
    },
    childEvtHandle() {
      this.$bus && this.$bus.emit && this.$bus.emit("updateTodoNum");
      if (typeof this.getTableData === "function") this.getTableData();
      this.flowShow = false;
    },
    handelShowDialog(row, page, task) {
      this.$setStorage && this.$setStorage("flow_page_type", page);

      if (task) {
        this.flowInfo.businessId = task.businessId;
        this.flowInfo.taskId = task.procTaskId || task.pacId;
        this.flowInfo.procTaskId = task.procTaskId || task.pacId;
        this.flowInfo.status = task.suspended;
      } else {
        this.flowInfo.businessId = this.flowId;
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
    flowPath() {
      return this.pathForFlowInfo || (this.$route && this.$route.path) || "";
    },
    storageKey() {
      return "flow_data_row_" + this.flowId;
    },
    ...mapGetters(["sidebar", "menuRoutes"]),
    buttonResources() {
      const route = this.$route || {};
      const { query } = route;
      let permCode = null;
      if (query && query.permCode) {
        permCode = query.permCode;
      }
      const items = this.getMenuButtonItems(this.menuRoutes, permCode) || [];
      return items.map((x) => x.value);
    },
    userInfo() {
      return this.$getStorage ? this.$getStorage("userInfo") : null;
    },
    isSystem() {
      const username = this.userInfo && this.userInfo.username;
      return username === "system" || username === "super";
    },
    isMdgAdmin() {
      const username = this.userInfo && this.userInfo.username;
      return username === "mdgglj";
    },
  },
  unmounted() {},
  watch: {
    flowShow(val) {
      if (!val) {
        localStorage.removeItem(this.storageKey);
      }
    },
  },
};
