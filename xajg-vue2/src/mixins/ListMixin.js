import {BaseMixin} from "@/mixins/BaseMixin";
import {mapGetters} from "vuex";
import {dateFormat} from "@/utils";
import {page, remove} from "@/api/common";

export const ListMixin = {
  mixins: [BaseMixin],
  components: {},
  data() {
    return {
      /**分页参数 */
      pageParams: {
        size: 20,
        pageSize: 20,
        current: 1,
        total: 0,
        entity: {},
      },
      /**列表数据 */
      tableData: [],
      /**当前操作行数据 */
      oprateRow: {
        /** 信息弹窗*/
        dialogShow: false,
        dialogShow1: false,
        dialogShow2: false,
        /**当前行数据 */
        data: {},
        /**是否是查看 */
        isView: false,
        isView1: false,
        isView2: false,
      },
    };
  },
  created() {
    this.getTableData && this.getTableData();
  },
  mounted() {
  },
  methods: {
    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current; //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize; //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
    },
    /**数据删除 */
    removeHandle(row) {
      // if (typeof remove === "function") {
      //   remove(row.id).then((res) => {
      //     if (res.success) {
      //       if (typeof row.$index === "number") {
      //         this.tableData.splice(row.$index, 1);
      //       } else {
      //         this.getTableData();
      //       }
      //       this.$message.info("删除成功");
      //     }
      //   });
      // }
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    handleSizeChange(val) {
      if (Number.isInteger(val)) {
        this.pageParams.pageSize = val;
        this.pageParams.size = val;
      } else {
        this.pageParams.pageSize = val.size;
        this.pageParams.size = val.size;
      }
      this.getTableData && this.getTableData();
    },
    handleCurrentChange(val) {
      if (Number.isInteger(val)) {
        this.pageParams.current = val;
      } else {
        this.pageParams.current = val.current;
      }
      this.getTableData && this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      if (!this.url.list) {
        console.error("请求路径为空！")
        return;
      }
      this.tableData = [];
      let query = {...this.pageParams};
      page(this.url.list, query).then(async (res) => {
        if (res.success) {
          if (typeof this.loadAfter === "function") {
            this.tableData = await this.loadAfter(
              this.pageParams,
              res.data.records
            );
          } else {
            this.tableData = res.data.records;
          }
          this.pageParams.total = res.data.total;
          this.$emit("loadAfter", this.pageParams);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    /**重置表格数据 */
    reset() {
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.pageParams.entity = {};
      this.getTableData();
    },
  },
  computed: {},
  destroyed() {
  },
  watch: {},
};
