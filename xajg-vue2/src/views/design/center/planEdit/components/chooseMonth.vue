<template>
  <div class="page-leave">
    <!-- 列表页 -->
    <div class="my-10">
      <i class="iconfont icon-menu font-14 mr-5"></i>
      <span>计划任务列表</span>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      highlight-current-row
      :border="true"
      @current-change="handleCurrentChange"
    >
      <el-table-column label="任务项名称" prop="size" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业" prop="type" align="center">
        <template slot-scope="{ row }">
          <span>{{ $DictionaryParsing(ditProfession, row.profession) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程部位" prop="type" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.projectPbsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划供应日期" prop="type" align="center">
        <template slot-scope="{ row }">
          <span> {{ row.planTime?timeFormat(row.planTime, "yyyy-MM-DD"):'' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否现场需解决事项" prop="type" align="center">
        <template slot-scope="{ row }">
          <span :class="row.isScene == 1 ? 'iconfont icon-checked' : ''"></span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" prop="type" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.chargeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="type" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { ledgertByMonth } from "../api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
export default {
  props: {
    // 表格标题
    title: {
      type: String,
      default: "标题",
    },
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      query: {
        month: "",
      },
      ditProfession: [],
      tableData: [],
      chooseId: "",
      currentRow: null,
    };
  },
  created() {
    this.getFlowPROFESSION();
  },
  //
  methods: {
    getPbsName(val) {
      return val?.split("&&&")[1] || "";
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM");
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    /**获取流程状态字典 */
    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      this.ditProfession = data;
    },
    async getList(query) {
      try {
        const result = await ledgertByMonth();
        const { success, data } = result;

        if (success) {
          const { year, month } = query;
          const targetYearData = data?.find((item) => item.name === year);
          if (targetYearData) {
            const targetMonthData = targetYearData?.children.filter(
              (item) => item.name === `${month}月`
            );
            if (targetMonthData.length > 0) {
              let arr = [];
              targetMonthData.forEach((element) => {
                element?.designPlanDetailList?.forEach((inItem) => {
                  if (inItem.type == "task") {
                    arr.push(inItem);
                  }
                });
              });
              console.log("arr", arr);
              this.tableData = arr;
              // 对targetMonthData进行进一步处理
            } else {
              this.tableData = [];
              this.$message.warning(`未找到${year}年的数据`);
            }
          } else {
            this.tableData = [];
            // 提示没有找到数据
            this.$message.warning(`未找到${year}年的数据`);
          }
        } else {
          this.tableData = [];
          console.error("请求失败");
        }
      } catch (error) {
        this.tableData = [];
        console.error("请求月度计划时出错", error);
        // 处理错误情况
      }
    },
  },
};
</script>
<style lang="scss" scoped>
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

/deep/ .el-table__header .el-checkbox {
  display: none;
}

/deep/ .el-radio__label {
  display: none;
}
</style>
