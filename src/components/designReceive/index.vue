<template>
  <div class="page-leave">
    <el-form :model="query" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="文件编号:" size="mini">
            <el-input v-model.trim="query.code" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标题:" size="mini">
            <el-input v-model.trim="query.title" placeholder="请输入内容" trim />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="文种:" size="mini">
            <el-select
              ref="flowStateRef"
              v-model="query.type"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
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
            <el-button type="primary" @click="getTableData(true)">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        height="100%"
        border
        highlight-current-row
        @current-change="chooseCurrentRow"
      >
        <el-table-column label="文件编号" prop="code" align="center">
          <template #default="{ row }">
            <span>{{ getCode(row.code) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="name" align="center">
          <template #default="scope">
            <span :title="scope.row.title" class="text-ellipsis">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文种" prop="profession" align="center">
          <template #default="scope">
            <span>{{ $DictionaryParsing(wzCodeOptions, scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来文日期" prop="createDate" align="center">
          <template #default="{ row }">
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
import { page } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import { FlowListMixin } from "@/mixins/FlowListMixin";

export default {
  name: "OriginalDrawing",
  components: {},
  mixins: [FlowListMixin],
  props: {
    page: {
      type: String,
      default: "drawingSupply",
    },
  },
  data() {
    return {
      currentRow: null,
      DitSpeciality: [],
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      tableData: [],
      query: {},
      flowStatusOptions: [],
      wzCodeOptions: [],
    };
  },
  watch: {
    page: {
      handler() {
        void 0;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    if (!this.wzCodeOptions || this.wzCodeOptions.length === 0) {
      getDictItemList("wz").then((res) => {
        if (res && res.success) {
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
      const a = this.DitSpeciality.find((item) => item.dictCode == value);
      if (a) {
        text = a.dictName;
      }
      return text;
    },
    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      this.DitSpeciality = data;
    },
    async getFlowStatus() {
      const { data } = await getDictItemList("PROC_TASK_TODO_STATUS");
      this.flowStatusOptions = data;
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },
    getTableData(type) {
      if (type) {
        this.pageParams.current = 1;
        this.pageParams.pageSize = 20;
      }
      const params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          startDate: this.startTimeAndEndTime?.[0] || "",
          endDate: this.startTimeAndEndTime?.[1] || "",
          unitType: 2,
          documentType: 1,
        },
      };
      if (params?.entity?.code) {
        params.entity.code = this.retCode(params.entity.code);
      }
      page(params).then((res) => {
        if (res && res.success) {
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
      let outputString = code.replace(/-【/, "|");
      outputString = outputString.replace(/】-/, "|");
      return outputString;
    },
    getCode(code) {
      let outputString = code.replace(/\|/, "-【");
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

  .table {
    height: 80%;

    ::v-deep(.el-table__row .cell button) {
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
