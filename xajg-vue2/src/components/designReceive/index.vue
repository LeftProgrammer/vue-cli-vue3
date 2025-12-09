<template>
  <div class="page-leave">
    <el-form :model="query" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="文件编号:" size="mini">
            <el-input v-model.trim="query.code" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标题:" size="mini">
            <el-input v-model.trim="query.title" placeholder="请输入内容" trim></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="文种:" size="mini">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              v-model="query.type"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in wzCodeOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="flex justify-end">
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
        <el-table-column label="文件编号" prop="code" align="center">
          <template slot-scope="{ row }">
            <span>{{ getCode(row.code) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="name" align="center">
          <template slot-scope="scope">
              <span :title="scope.row.title" class="text-ellipsis">{{
                  scope.row.title
                }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文种" prop="profession" align="center">
          <template slot-scope="scope">
              <span>{{
                  $DictionaryParsing(wzCodeOptions, scope.row.type)
                }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="来文日期"
          prop="createDate"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.createDate ? timeFormat(row.createDate) : "" }}
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
  components: {bimShow},
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
      wzCodeOptions:[]
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
  created() {
    /**获取字典 */
    if (!this.wzCodeOptions || this.wzCodeOptions.length == 0) {
      getDictItemList("wz").then((res) => {
        if (res.success) {
          this.wzCodeOptions = res.data;
        }
      });
    }
  },
  methods: {
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
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          startDate: this.startTimeAndEndTime?.[0] || "",
          endDate: this.startTimeAndEndTime?.[1] || "",
          unitType:2,
          documentType:1,
        },
      };
      // 因为存在下的的code 是 | 所以需要转化成 -【】-
      if (params?.entity?.code) {
        params.entity.code = this.retCode(params.entity.code);
      }
      console.log("params", params);
      page(params).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        } else {
          this.tableData = [];
          this.pageParams.total = 0;
        }
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
    retCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\-【/, "|");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\】-/, "|");

      return outputString;
    },
    getCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\|/, "-【");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\|/, "】-");

      return outputString;
    },
  },
};
</script>

<style scoped lang="scss">
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
