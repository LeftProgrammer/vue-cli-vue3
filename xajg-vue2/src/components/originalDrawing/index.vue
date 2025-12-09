<template>
  <div class="page-leave">
    <el-form :model="query" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="图纸编号:" size="mini">
            <el-input v-model="query.code" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="图纸名称:" size="mini">
            <el-input v-model="query.name" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="flex justify-end">
          <el-form-item size="mini">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getTableData(true)"
              >查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" @click="reset"
              >重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="table">
      <el-table
        highlight-current-row
        @current-change="chooseCurrentRow"
        ref="multipleTable"
        :data="tableData"
        height="100%"
        border
      >
        <el-table-column label="图纸编号" prop="code" align="center" />
        <el-table-column label="图纸名称" prop="name" align="center" />

        <el-table-column label="专业" prop="profession" align="center">
          <template slot-scope="scope">
            <span>{{ getTypeText(scope.row.profession) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工程部位" prop="pbsCode" align="center">
          <template slot-scope="scope">
            <!-- <span>{{ getPbsName(scope.row.pbsCode) }}</span> -->
            <bim-show :pbsCode="scope.row.pbsCode"></bim-show>
          </template>
        </el-table-column>
        <el-table-column label="版本" prop="allData.version" align="center">
        </el-table-column>
        <el-table-column
          label="实际供应日期"
          prop="actualDate"
          sortable
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.allData.actualDate ? timeFormat(row.allData.actualDate,'yyyy-MM-DD') : "" }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        class="pagination"
        :current-page="pageParams.current"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageParams.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { page, pageNotSelect } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import bimShow from "@/components/Bim/Show";
const status = {
  1: "todo",
  2: "done",
  3: "wait",
  4: "sent",
  5: "fine",
};
export default {
  props: {
    // drawingSupply 图纸供应界面  drawingSend   图纸分发
    page: {
      type: String,
      default: "drawingSupply",
    },
  },
  name: "originalDrawing",
  mixins: [FlowListMixin],
  components: { bimShow },
  data() {
    return {
      currentRow: null,
      DitSpeciality: [], //专业字典
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      tableData: [],
      query: {},
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
    };
  },
  watch: {
    page: {
      handler() {
        console.log("page", this.page);
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  methods: {
    // getPbsName(val) {
    //   let text = "*";
    //   console.log("getPbsName", val);
    //   let a = val?.split("&&&")[1];
    //   if (a) {
    //     text = a;
    //   }
    //   return text;
    // },
    chooseCurrentRow(val) {
      this.currentRow = val;
    },

    default() {
      this.getTableData();
      this.getFlowStatus();
      this.getFlowPROFESSION();
    },
    getTypeText(value) {
      let text = "*";
      let a = this.DitSpeciality.find((item) => item.dictCode == value);
      if (a) {
        text = a.dictName;
      }
      return text;
    },
    /**获取流程状态字典 */
    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      this.DitSpeciality = data;
      // console.log("flowStatusOptions", data);
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      // const { data } = await getDictItemList("PROC_TASK_TODO_STATUS");
      const { data } = await getDictItemList("PROC_TASK_TODO_STATUS");
      this.flowStatusOptions = data;
      // console.log("flowStatusOptions", data);
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    /**重置表格数据 */
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },
    // 查询表格数据
    getTableData(type) {
      if (type) {
        this.pageParams.current = 1;
        this.pageParams.pageSize = 20;
      }
      let request = "";
      if (this.page == "drawingSupply") {
        request = page;
      } else {
        request = pageNotSelect;
      }

      let params = {
        ...this.pageParams,
        entity: {
          flowStatus: 2,
          status: 0,
          designSupply: {
            type: 1,
            ...this.query,
          },
        },
      };
      console.log("params", params);
      request(params).then((data) => {
        console.log("查询表格数据", data.data.records);
        let a = [];
        data.data.records.forEach((element) => {
          a.push({
            ...element.designSupply,
            allData: element,
          });
        });
        console.log("aaaaaaaaa", a);
        this.tableData = a;
        this.pageParams.total = data.data.total;
      });
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams.current = val;
      this.getTableData();
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-table {
  .el-table__header {
    background-color: #1298fa;
    border-radius: 4px;
    overflow: hidden;
    .el-table__cell {
      text-align: center;
      .cell {
        color: #fff;
        text-align: center;
      }
    }
  }
  .el-table__body tr.current-row > td {
    color: #606266;
    background-color: #b5eaff;
  }

  .el-table__body tr.current-row:hover > td {
    background-color: #b5eaff !important;
    color: #606266 !important;
  }
}
.page-leave {
  width: 100%;
  height: 50vh !important;
  // padding: 15px;
  .table {
    height: 80%;
    /deep/ .el-table__row .cell button {
      padding: 5px 10px !important;
      margin: 0 5px;
    }
  }

  .pagination {
    padding: 0 20px;
  }
}

.el-col .el-input {
  width: 60%;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}
.pagination-container {
  display: flex;
  .pagination {
    margin-left: auto;
  }
}
</style>
