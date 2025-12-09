<template>
  <div class="page-list" style="height: 100%">
    <table-layout
      :page="pageParams"
      :title="'合同登记列表'"
      :show-page="false"
      @query="getTableData"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="pageParams" :inline="true">
          <el-form-item label="年度对比:">
            <el-date-picker
              v-model="pageParams.year"
              :clearable="false"
              type="year"
            />
          </el-form-item>
          <el-form-item label="月度对比:">
            <el-date-picker
              v-model="pageParams.month"
              type="month"
              :picker-options="{
                disabledDate: disabledDate,
              }"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <!-- <span class="color1">已完成</span>
        <span class="color2">未完成</span>
        <span class="color3">超额完成</span> -->
      </template>
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            label="序号"
            type="index"
            width="54"
            align="center"
          />

          <el-table-column
            label="计划金额(元)"
            prop="planAmount"
            align="right"
          />
          <el-table-column
            label="完成金额(元)"
            prop="realAmount"
            align="right"
          />
          <el-table-column label="完成比例" align="center">
            <template #default="{ row }">
              {{ percent(row.realAmount, row.planAmount) }}%
            </template>
          </el-table-column>
          <el-table-column
            label="累计完成(元)"
            prop="totalAmount"
            align="right"
          />
          <el-table-column label="累计完成比例" align="center">
            <template #default="{ row }">
              {{ percent(row.totalAmount, row.contractAmount) }}%
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
  </div>
</template>

<script>
import { page } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import { page as contractPage } from "@/views/contract/contractSign/api";

export default {
  name: "InvestmentCompare",
  components: {
    TableLayout,
  },
  mixins: [ListMixin],
  data() {
    return {
      type: "",
      title: "",
      pageParams: {},
      tableData: [],
      contractList: [], //合同列表
    };
  },
  computed: {
    percent() {
      return (value, total) => {
        if (!total) return 0;
        return ((value / total) * 100).toFixed(2);
      };
    },
  },
  created() {
    this.$set(this.pageParams, "year", new Date());
    this.getTableData();
    this.getContractList();
  },
  methods: {
    /**
     * @description 获取合同list
     */
    async getContractList() {
      contractPage({
        entity: {},
      }).then((res) => {
        this.contractList = res.data.records || [];
      });
    },
    disabledDate(date) {
      return (
        dateFormat(date, "YYYY") != dateFormat(this.pageParams.year, "YYYY")
      );
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.contractAmount > row.totalAmount) {
        return "warning-row";
      } else if (row.contractAmount == row.totalAmount) {
        return "info-row";
      } else if (row.contractAmount < row.totalAmount) {
        return "success-row";
      }
      return "";
    },
    reset() {
      this.pageParams = {
        year: new Date(),
      };
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      let params = {
        year: dateFormat(this.pageParams.year, "YYYY"),
      };
      if (this.pageParams.month) {
        params.month = parseInt(dateFormat(this.pageParams.month, "MM"), 10);
      }
      if (this.pageParams.contractId) {
        params.contractId = this.pageParams.contractId;
      }
      page(params).then((res) => {
        this.tableData = res.data.map((x) => {
          return {
            ...x,
            contractAmount: Number(x.contractAmount || 0),
            planAmount: Number(x.planAmount || 0),
            realAmount: Number(x.realAmount || 0),
            totalAmount: Number(x.totalAmount || 0),
          };
        });
        this.tableData.push({
          name: "合计",
          contractAmount: this.tableData.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.contractAmount,
            0
          ),
          planAmount: this.tableData.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.planAmount,
            0
          ),
          realAmount: this.tableData.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.realAmount,
            0
          ),
          totalAmount: this.tableData.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.totalAmount,
            0
          ),
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.table-content.no-page .table .table-cnotent {
  height: calc(100% - 40px - 20px);
}
.table-header .search-btns {
  .color1,
  .color2,
  .color3 {
    &::before {
      width: 16px;
      height: 16px;
      content: "";
      display: inline-block;
      margin: 0 8px;
    }
  }
  .color1 {
    &::before {
      background-color: #d6ffd1;
    }
  }
  .color2 {
    &::before {
      background-color: #f08252;
    }
  }
  .color3 {
    &::before {
      background-color: #00b42a;
    }
  }
}
.el-table {
  /deep/.warning-row {
    td:nth-child(4),
    td:nth-child(5),
    td:nth-child(7) {
      color: #f08252;
    }
  }
  /deep/.info-row {
    td:nth-child(4),
    td:nth-child(5),
    td:nth-child(7) {
      color: #d6ffd1;
    }
  }
  /deep/.success-row {
    td:nth-child(4),
    td:nth-child(5),
    td:nth-child(7) {
      color: #00b42a;
    }
  }
}
</style>
