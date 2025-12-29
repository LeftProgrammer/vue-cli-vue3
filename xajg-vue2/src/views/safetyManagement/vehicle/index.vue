<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      title="车辆管理"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleQuery"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="车牌号:">
            <el-input v-model="query.code" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="车辆类型:">
            <el-select
              v-model="query.type"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="value in vehicleTypeEnum"
                :key="value"
                :label="vehicleTypeNameMap[value]"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工程部位:">
            <pbs-select v-model="query.pbsCode" style="height: 100%" />
          </el-form-item>
          <el-form-item label="所属单位:">
            <el-select v-model="pageParams.entity.unit">
              <el-option
                v-for="item in unitListAll"
                :key="item.corpId"
                :label="item.corpName"
                :value="item.corpId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button icon="el-icon-plus" type="primary" @click="addHandle()">
          新增
        </el-button>
      </template>

      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            width="54"
            align="center"
          />
          <el-table-column
            label="车牌号"
            prop="code"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              <el-link type="primary" @click="view(row)">{{
                row.code
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="车辆类型"
            align="center"
            prop="type"
            width="120"
          >
            <template slot-scope="{ row }">
              {{ vehicleTypeNameMap[row.type] || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="工程部位" prop="name" align="center">
            <template slot-scope="{ row }">
              <bimShow :pbs-code="row.pbsCode" />
            </template>
          </el-table-column>
          <el-table-column label="所属单位" prop="unit" align="left">
            <template slot-scope="{ row }">
              {{
                unitListAll.find((item) => item.corpId == row.unit)?.corpName ||
                  "-"
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="司机"
            prop="driverName"
            align="center"
            :width="120"
          />
          <el-table-column
            label="联系电话"
            prop="contactPhone"
            align="center"
            :width="120"
          />
          <el-table-column
            label="入场日期"
            prop="enterDate"
            align="center"
            :width="120"
          >
            <template slot-scope="{ row }">
              {{ timeFormat(row.enterDate, "YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column
            label="退场日期"
            prop="leaveDate"
            align="center"
            :width="120"
          >
            <template slot-scope="{ row }">
              {{ timeFormat(row.leaveDate, "YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-link type="danger" @click="handelDeleteRow(row)">删除</el-link>
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
import { remove, page, unitAllList } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import bimShow from "@/components/Bim/Show/index.vue";
import { VEHICLE_TYPE, VEHICLE_TYPE_NAME } from "./constants";

export default {
  name: "Vehicle",
  components: {
    bimShow,
    TableLayout,
    ListButton,
    dataform,
  },
  mixins: [ListMixin],
  data() {
    return {
      unitListAll: [],
      type: "",
      title: "",
      DitSpeciality: [],
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
      oprateRow: {
        dialogShow: false,
        data: {},
        isView: false,
      },
      options: [],
      tableData: [],
      query: {
        code: null,
        pbsCode: null,
        type: null,
      },
      date: [],
      dictList: [],
      readonly: false,
      deptShow: false,
      url: { list: "" },
      userId: "",
      staffList: [],
      vehicleTypeEnum: VEHICLE_TYPE,
      vehicleTypeNameMap: VEHICLE_TYPE_NAME,
    };
  },
  computed: {},
  created() {
    this.getTableData();
    this.userId = this.$getStorage("userInfo").userId;
    this.getUnitAll();
  },
  methods: {
    async getUnitAll() {
      try {
        const result = await unitAllList();
        const { data, success } = result;
        if (!success) {
          this.unitListAll = [];
          this.$message.error("获取单位列表失败");
          return;
        }
        let unitList = data.sort((a, b) => {
          return a.corpSort - b.corpSort;
        });
        this.unitListAll = unitList;
        return unitList;
      } catch (err) {
        console.log("err", err);
      }
    },

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
    view(row) {
      this.type = "view";
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.title = "详情";
      this.readonly = true;
      this.oprateRow.isView = true;
    },
    reset() {
      this.query.code = null;
      this.query.pbsCode = null;
      this.query.type = null;
      this.query.unit = null;
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
      // if (this.date && this.date.length > 0) {
      //   this.query.startDate = this.date[0] + " 00:00:00";
      //   this.query.endDate = this.date[1] + " 23:59:59";
      // }
      this.pageParams.entity = this.query;
      const params = JSON.parse(JSON.stringify(this.pageParams));
      page(params).then((data) => {
        this.tableData = data.data.records;
        this.pageParams.total = data.data.total;
      });
    },
    /* 新增 */
    addHandle() {
      this.type = "add";
      this.title = "新增";
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
      if (!time) {
        return "";
      }
      return dateFormat(time, type || "YYYY-MM-DD");
    },
    async handelDeleteRow(row) {
      try {
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        this.deleteHandle(row);
      } catch (e) {
        console.error(e);
      }
    },

    getStaffNameById(staffId) {
      let item = this.staffList?.find((item) => item.id == staffId) || "";
      return item ? item.name : "";
    },
    getGender(agentCard) {
      if (!agentCard) {
        return "";
      }
      const idCardRegex =
        /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (!idCardRegex.test(agentCard)) {
        return "";
      }
      try {
        const gender =
          parseInt(agentCard.slice(16, 17)) % 2 === 0 ? "女" : "男";
        return gender;
      } catch (error) {
        return "";
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
