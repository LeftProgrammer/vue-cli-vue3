<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout title="投资计划列表" :page="pageParams" @query="handleQuery" @reset="reset"
      @pageSizeChange="handleSizeChange" @pageCurrentChange="handleCurrentChange" :showPage="!showPlan"
      :showSearchBtns="!showPlan">
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item v-if="showPlan">
            <el-button icon="el-icon-back" @click="back"> 返回 </el-button>
          </el-form-item>
          <el-form-item label="计划名称:" size="mini" v-if="!showPlan">
            <el-input v-model="pageParams.entity.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="年度:" size="mini" v-if="!showPlan">
            <el-date-picker v-model="pageParams.entity.year" type="year" value-format="yyyy" />
          </el-form-item>
        </el-form>
      </template>
      <!-- 新增按钮 -->
      <template slot="opratebtns">
        <el-button type="primary" icon="el-icon-plus" v-if="!showPlan" @click="handelShowDialog(null, 'add')">
          新增
        </el-button>
      </template>
      <!-- 数据表格 -->
      <template slot="table">
        <el-table v-if="!showPlan" ref="multipleTable" :data="tableData" height="100%" border
          @header-dragend="handleHeaderDragEnd">
          <el-table-column label="序号" type="index" :index="getIndex" width="54" align="center" />
          <el-table-column label="计划名称" prop="name" :min-width="$calculateWidth(180)">
            <template #default="{ row }">
              <el-link type="primary" class="text-ellipsis" @click="handelShowDialog(row, 'view')">
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="年度" prop="year" align="center" :width="$calculateWidth(120)">
            <template #default="{ row }">
              {{ row.year }}
            </template>
          </el-table-column>
          <el-table-column label="计划投资金额(元)" prop="totalInvestmentAmount" align="right" :width="$calculateWidth(150)" />
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-link type="primary" @click="handelShowDialog(row, 'edit')">编辑</el-link>
              <el-divider direction="vertical" />
              <el-link type="danger" @click="deletedata(row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <data-form v-if="showPlan" ref="dataformRef" :readonly="readonly" @save-success="handleSaveSuccess" />
      </template>
    </table-layout>
  </div>
</template>

<script>
import { page, remove } from "./api";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import enums from "@/config/enums";
import { dateFormat } from "@/utils";
import moment from "moment";
import DataForm from "./dataform.vue";

export default {
  name: "investmentPlan",
  mixins: [FlowListMixin],
  components: { TableLayout, DataForm },
  data() {
    return {
      readonly: false,
      showPlan: false,
      unitOptions: [],
      pageParams: {
        orderProperties: [
          {
            property: "createDate",
            asc: false,
          },
        ],
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
        entity: {
          params: {},
        },
      },
      tableData: [],
      startTimeAndEndTime: [],
      /**流程状态 */
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    dateFormat,
    moment,
    handleSaveSuccess() {
      this.getTableData();
      this.back();
    },
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    back() {
      this.showPlan = false;
    },
    async handelShowDialog(row, type) {
      this.showPlan = true;
      this.readonly = type === "view";
      console.log("新增1", this.readonly);
      this.$nextTick(() => {
        if (this.$refs.dataformRef) {
          this.$refs.dataformRef.setFormData(row || {});
        }
      });
    },

    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current; //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize; //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
    },
    reset() {
      this.pageParams = {
        orderProperties: [
          {
            property: "createDate",
            asc: false,
          },
        ],
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
        entity: {
          params: {},
        },
      };
      this.startTimeAndEndTime = [];
      this.getTableData();
    },
    getTableData(pageInfo) {
      const pageParams = Object.assign(this.pageParams, pageInfo);
      page(pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        }
      });
    },
    /**获取流程状态字典 */
    getFlowStatus() {
      let data = [];
      let options = enums.FLOW_STATUS_ENUM;
      for (const key in options) {
        data.push({
          id: options[key].value,
          dictCode: options[key].value,
          dictName: options[key].name,
        });
      }
      this.flowStatusOptions = data;
    },
    deletedata(row) {
      if (!row.id) {
        return;
      }
      remove({
        id: row.id,
      }).then((res) => {
        if (res.success) {
          this.$message.success("删除计划成功");
          this.getTableData();
        } else {
          this.$message.error("数据删除异常，" + res.message);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.button-container {
  display: flex;
  justify-content: flex-end;
}
</style>
