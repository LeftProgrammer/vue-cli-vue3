<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      title="水情监测数据列表"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleQuery"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="更新时间:">
            <el-date-picker
              v-model="date"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="addHandle(), (type = 'add')"
        >
          新增
        </el-button>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            label="更新时间"
            prop="monitorDate"
            align="center"
            width="140"
          >
            <template slot-scope="{ row }">
              {{
                row.monitorDate
                  ? timeFormat(row.monitorDate, "YYYY-MM-DD HH:mm")
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="上游水位(m)"
            prop="upWaterLevel"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.upWaterLevel ? getNumber(row.upWaterLevel) : "0.00" }}
            </template>
          </el-table-column>
          <el-table-column
            label="下游水位(m)"
            prop="downWaterLevel"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.downWaterLevel ? getNumber(row.downWaterLevel) : "0.00" }}
            </template>
          </el-table-column>
          <el-table-column
            label="入库流量(m³/s)"
            prop="inboundFlow"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.inboundFlow ? getNumber(row.inboundFlow) : "0.00" }}
            </template>
          </el-table-column>
          <el-table-column
            label="出库流量(m³/s)"
            prop="outboundFlow"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.outboundFlow ? getNumber(row.outboundFlow) : "0.00" }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="泄洪流量(m³/s)"
            prop="floodDischarge"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.floodDischarge ? getNumber(row.floodDischarge) : "0.00" }}
            </template>
          </el-table-column> -->
          <el-table-column label="操作" prop="name" width="200" align="center">
            <template #default="{ row }">
              <list-button
                :data="row"
                :btns="['edit', 'delete']"
                :disabled-btns="[
                  row.createUser !== userId ? 'edit' : '',
                  row.createUser !== userId ? 'delete' : '',
                ]"
                @view="view"
                @delete="deleteHandle"
                @edit="edit"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <dataform
      v-if="oprateRow.dialogShow"
      :type="type"
      :title="title"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="closedDialog"
      @ok="getTableData"
    />
  </div>
</template>

<script>
import { remove, page } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";

export default {
  name: "WaterMonitoring",
  components: {
    TableLayout,
    ListButton,
    dataform,
  },
  mixins: [ListMixin],
  data() {
    return {
      type: "",
      title: "",
      DitSpeciality: [],
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
      oprateRow: {},
      options: [],
      tableData: [],
      query: {
        params: {},
      },
      date: [],
      dictList: [],
      readonly: false,
      deptShow: false,
      url: { list: "" },
      userId: "",
    };
  },
  computed: {},
  created() {
    this.getTableData();
    this.userId = this.$getStorage("userInfo").userId;
  },
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    getNumber(e) {
      if (e) {
        return (e - 0).toFixed(2);
      }
    },
    edit(row) {
      this.type = "edit";
      this.title = "编辑-水情监测数据";
      console.log(row);
    },
    view(row) {
      this.type = "view";
      this.title = "查看-水情监测数据";
    },
    reset() {
      this.query = {};
      this.date = [];
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams.current = val.current;
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      if (this.date && this.date.length > 0) {
        this.query.startDate = this.date[0] + " 00:00:00";
        this.query.endDate = this.date[1] + " 23:59:59";
      }
      this.pageParams.entity = this.query;
      const params = JSON.parse(JSON.stringify(this.pageParams));
      page(params).then((data) => {
        this.tableData = data.data.records;
        this.pageParams.total = data.data.total;
      });
    },
    /* 新增 */
    addHandle() {
      this.type = "addHandle";
      this.title = "新增-水情监测数据";
      // this.$nextTick(()=>{
      //   this.$refs['dataform'].dialogShow=true
      // })
      console.log("addHandle");
      this.oprateRow.data = {};
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
    },
    /** 删除*/
    deleteHandle(row) {
      remove({
        id: row.id,
      }).then((res) => {
        if (!res.success) {
          return this.$message.error("删除失败：" + res.message);
        }
        this.$message.success("删除成功");
        this.getTableData();
      });
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    async handelDeleteRow(row) {
      try {
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        this.deletedata(row.id);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;
}

.el-col .el-input {
  width: 60%;
}
/deep/.el-range-editor--small .el-range-input {
  font-size: 12px;
}
.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}
</style>
<style scoped lang="scss">
/deep/.el-range-editor--medium .el-range-input {
  font-size: 12px;
}
</style>
