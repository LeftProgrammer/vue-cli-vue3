import { page } from "@/api/common";
import { BaseMixin } from "@/mixins/BaseMixin";
import { dateFormat } from "@/utils";

export const ListMixin = {
  mixins: [BaseMixin],
  data() {
    return {
      // 分页参数
      pageParams: {
        size: 20,
        pageSize: 20,
        current: 1,
        total: 0,
        entity: {},
      },
      // 列表数据
      tableData: [],
      // 列表操作行状态（查看/编辑弹窗等）
      oprateRow: {
        dialogShow: false,
        dialogShow1: false,
        dialogShow2: false,
        data: {},
        isView: false,
        isView1: false,
        isView2: false,
      },
    };
  },
  created() {
    if (typeof this.getTableData === "function") {
      this.getTableData();
    }
  },
  methods: {
    // 表格序号
    getIndex(index) {
      const cur = this.pageParams.current || 1;
      const size = this.pageParams.pageSize || 20;
      return index + 1 + (cur - 1) * size;
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    handleSizeChange(val) {
      if (typeof val === "number") {
        this.pageParams.pageSize = val;
        this.pageParams.size = val;
      } else if (val && typeof val === "object") {
        this.pageParams.pageSize = val.size;
        this.pageParams.size = val.size;
      }
      this.getTableData && this.getTableData();
    },

    handleCurrentChange(val) {
      if (typeof val === "number") {
        this.pageParams.current = val;
      } else if (val && typeof val === "object") {
        this.pageParams.current = val.current;
      }
      this.getTableData && this.getTableData();
    },

    async getTableData(options = {}) {
      if (!this.url || !this.url.list) {
        console.error("请求路径为空！");
        return;
      }

      const { clear = true, showLoading = false } = options || {};
      if (showLoading && Object.prototype.hasOwnProperty.call(this, "tableLoading")) {
        this.tableLoading = true;
      }
      if (clear) {
        this.tableData = [];
      }
      const query = { ...this.pageParams };
      try {
        const res = await page(this.url.list, query);
        if (res && res.success && res.data) {
          const records = res.data.records || [];
          if (typeof this.loadAfter === "function") {
            this.tableData = await this.loadAfter(this.pageParams, records);
          } else {
            this.tableData = records;
          }
          this.pageParams.total = res.data.total || 0;
          if (this.$emit) {
            this.$emit("loadAfter", this.pageParams);
          }
        } else if (res && !res.success && res.message) {
          console.error("加载表格数据失败：", res.message);
        }
      } catch (e) {
        console.error("加载表格数据异常：", e);
      } finally {
        if (showLoading && Object.prototype.hasOwnProperty.call(this, "tableLoading")) {
          this.tableLoading = false;
        }
      }
    },

    reset() {
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.pageParams.entity = {};
      this.getTableData && this.getTableData();
    },
  },
};
