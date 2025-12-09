<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      title="实际投资列表"
      :page="pageParams"
      @query="getTableData"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      :showPage="!showPlan"
      :showSearchBtns="!showPlan"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item v-if="showPlan">
            <el-button icon="el-icon-back" @click="back"> 返回 </el-button>
          </el-form-item>
          <el-form-item label="投资名称:" size="mini" v-if="!showPlan">
            <el-input v-model="pageParams.entity.name" />
          </el-form-item>
        </el-form>
      </template>
      <!-- 新增按钮 -->
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          v-if="!showPlan"
          @click="handleShowDialog({}, 'add')"
        >
          新增
        </el-button>
      </template>
      <!-- 数据表格 -->
      <template slot="table">
        <el-table
          v-if="!showPlan"
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          @header-dragend="handleHeaderDragEnd"
        >
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            width="54"
            align="center"
          />
          <el-table-column
            label="投资名称"
            prop="name"
            align="left"
            :min-width="$calculateWidth(200)"
          >
            <template #default="{ row }">
              <el-link type="primary" @click="handleShowDialog(row, 'view')">
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="年月"
            prop="month"
            align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              {{ row.month ? timeFormat(row.month, "yyyy-MM") : "" }}
            </template>
          </el-table-column>
          <el-table-column
            label="计划投资金额(元)"
            prop="planInvestmentAmount"
            align="right"
            :width="$calculateWidth(150)"
          />
          <el-table-column
            label="本月投资金额"
            prop="actualInvestmentAmount"
            align="right"
            :width="$calculateWidth(150)"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template #default="{ row }">
              <el-link type="primary" @click="handleShowDialog(row, 'edit')"
                >编辑</el-link
              >
              <el-divider direction="vertical" />
              <el-link type="danger" @click="deletedata(row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <data-form
          v-if="showPlan"
          ref="dataformRef"
          :readonly="readonly"
          @save-success="handleSaveSuccess"
        />
      </template>
    </table-layout>
  </div>
</template>

<script>
import { page, remove } from "./api";
import DataForm from "./dataform.vue";
import TableLayout from "@/components/ContentLayout/Table";
import { dateFormat } from "@/utils";
import moment from "moment";
export default {
  name: "InvestmentReal",
  components: { TableLayout, DataForm },
  data() {
    return {
      showPlan: false,
      currentRow: {},
      title: "新增",
      readonly: false,
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
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    dateFormat,
    moment,

    /**
     * @description 保存成功回调
     */
    handleSaveSuccess() {
      this.getTableData();
      this.back();
    },
    back() {
      this.showPlan = false;
    },
    /**
     * @description 分页大小变化
     */
    handleSizeChange(val) {
      this.pageParams.size = val;
      this.pageParams.pageSize = val;
      this.getTableData();
    },
    /**
     * @description 当前页变化
     */
    handleCurrentChange(val) {
      this.pageParams.current = val;
      this.getTableData();
    },

    handleShowDialog(row, mode) {
      this.showPlan = true;
      this.readonly = mode === "view";
      this.currentRow = row || {};
      this.$nextTick(() => {
        if (this.$refs.dataformRef) {
          this.$refs.dataformRef.setFormData(row, mode);
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
      // if (pageParams.entity.year?.length > 0) {
      //   pageParams.entity.startDate = pageParams.entity.year[0];
      //   pageParams.entity.endDate = pageParams.entity.year[1];
      // }
      page(pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        }
      });
    },
    deletedata(row) {
      if (!row.id) {
        return;
      }

      this.$confirm("确认删除该投资记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 用户确认删除
          remove({
            id: row.id,
          })
            .then((res) => {
              if (res.success) {
                this.getTableData();
                this.$message.success("删除数据成功");
              } else {
                this.$message.error("数据删除异常，" + res.message);
              }
            })
            .catch((err) => {
              console.error("删除请求失败:", err);
              this.$message.error("删除请求失败，请稍后重试");
            });
        })
        .catch(() => {
          // 用户取消删除
          this.$message.info("已取消删除操作");
        });
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style scoped lang="scss">
.el-dialog__body {
  max-height: 65vh;
  overflow-y: auto;
}
</style>
