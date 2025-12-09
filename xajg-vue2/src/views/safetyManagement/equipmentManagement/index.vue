<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="getTableData"
      @reset="reset"
      title="设备管理列表"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="设备编号:">
            <el-input v-model="query.code" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="设备名称:">
            <el-input v-model="query.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="所属单位:">
            <el-select v-model="query.unit">
              <el-option
                v-for="item in unitOptions"
                :key="item.corpId"
                :label="item.corpName"
                :value="item.corpId"
              />
            </el-select>
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
            :index="getIndex"
            width="54"
            align="center"
          />

          <el-table-column
            label="设备名称"
            prop="name"
            align="left"
            header-align="center"
          >
            <template #default="{ row }">
              <el-link type="primary" @click="view(row)">{{
                row.name
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="设备编号"
            prop="code"
            align="center"
            header-align="center"
            width="120"
          />
          <el-table-column
            label="所属单位"
            prop="unit"
            align="left"
            :width="$calculateWidth(180)"
          >
            <template slot-scope="{ row }">
              <div class="text-ellipsis">
                {{ getUnitName(row) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="进退场状态"
            prop="outgoingStatus"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <el-tag
                :type="getStatusTagType(scope.row.outgoingStatus)"
                effect="dark"
                size="medium"
              >
                {{ getStatusText(scope.row.outgoingStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="设备类型"
            width="120"
            align="center"
            prop="type"
          >
            <template #default="{ row }">
              {{ row.type == "special" ? "特种设备" : "非特种设备" }}
            </template>
          </el-table-column>
          <el-table-column
            label="规格型号"
            prop="specification"
            align="left"
            header-align="center"
            width="180"
          />
          <el-table-column
            label="进场日期"
            width="120"
            prop="workStartDate"
            align="center"
          />
          <el-table-column
            label="退场日期"
            width="120"
            prop="workEndDate"
            align="center"
          />
          <el-table-column
            label="操作人员"
            width="120"
            prop="measures"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getStaffNameById(row.operateStaff)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ getStaffNameById(row.operateStaff) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="联系方式"
            width="120"
            prop="phone"
            align="center"
          />
          <el-table-column
            label="设备状态"
            width="120"
            prop="phone"
            align="center"
            v-slot="{ row }"
          >
            <template v-if="row.workEndDate">
              <el-tag type="info" class="fixed-width-tag">已退场</el-tag>
            </template>
            <template v-else-if="isMaintenanceDue(row.maintenanceDate)">
              <el-tag type="waring" class="fixed-width-tag">整改中</el-tag>
            </template>
            <template v-else>
              <el-tag type="success" class="fixed-width-tag">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="200" align="center">
            <template #default="{ row }">
              <list-button
                :data="row"
                @view="view"
                @delete="deleteHandle"
                @edit="edit"
              ></list-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <dataform
      :type="type"
      :title="title"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      :unitOptions="unitOptions"
      @closed="closedDialog"
      @ok="getTableData"
    >
    </dataform>
  </div>
</template>

<script>
import { remove, page, getStaffList, unitAllList } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import { getDictItemList } from "@/api/dict";
import bimShow from "@/components/Bim/Show/index.vue";

export default {
  name: "equipmentManagement",
  mixins: [ListMixin],
  components: {
    bimShow,
    TableLayout,
    ListButton,
    dataform,
  },
  data() {
    return {
      // 进退场状态枚举
      OUTGOING_STATUS: {
        DEFAULT: 0, // 未进场
        ENTRY: 1, // 已进场
        EXIT: 2, // 已退场
      },
      type: "",
      title: "",
      unitOptions: [],
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
      staffList: [],
      riskLevelList: [],
    };
  },
  computed: {},
  created() {
    this.getTableData();
    this.userId = this.$getStorage("userInfo").userId;
    this.getStaffList();
    this.getDictItemList();
    this.getUnitList(); //获取所有的单位
  },
  methods: {
    getUnitName(row) {
      let unitInfo = this.unitOptions.find((x) => x.corpId === row.unit);
      if (unitInfo) {
        return unitInfo.corpName;
      } else {
        return "";
      }
    },
    async getUnitList() {
      const { data, success } = await unitAllList();
      if (success) {
        this.unitOptions = data
          .filter((x) => x.corpPid)
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
      }
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    /**
     * 获取进退场状态标签类型
     */
    getStatusTagType(status) {
      switch (Number(status)) {
        case this.OUTGOING_STATUS.DEFAULT:
          return "info";
        case this.OUTGOING_STATUS.ENTRY:
          return "success";
        case this.OUTGOING_STATUS.EXIT:
          return "danger";
        default:
          return "info";
      }
    },
    /**
     * 获取进退场状态文本
     */
    getStatusText(status) {
      switch (Number(status)) {
        case this.OUTGOING_STATUS.DEFAULT:
          return "未进场";
        case this.OUTGOING_STATUS.ENTRY:
          return "已进场";
        case this.OUTGOING_STATUS.EXIT:
          return "已退场";
        default:
          return "未知";
      }
    },
    getNumber(e) {
      if (e) {
        return (e - 0).toFixed(2);
      }
    },
    edit(row) {
      this.oprateRow.data = row;
      this.type = "edit";
      this.oprateRow.dialogShow = true;
      this.title = "编辑-设备管理数据";
      console.log(row);
    },
    view(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.type = "view";
      this.title = "查看-设备管理数据";
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
      this.title = "新增-设备管理数据";
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
      if (!time) {
        return "";
      }
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

    // 获取当前人的所属机构
    async getStaffList() {
      let params = {};
      try {
        const res = await getStaffList(params);
        const { data, success } = res;
        if (!success) {
          this.$message.error("获取人员错误");
          // 源数据
          this.staffList = [];
          return;
        }
        if (Array.isArray(data) && data?.length > 0) {
          // 从源数据中过滤出重复的单位
          this.staffList = data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.id === item.id)
          );
        } else {
          this.staffList = [];
        }
      } catch (error) {
        console.error("Error while fetching BelongTo:", error);
      }
    },

    /**获取字典 */
    async getDictItemList() {
      const { data } = await getDictItemList("RISK_LEVEL");
      this.riskLevelList = data;
    },

    getStaffNameById(staffId) {
      let item = this.staffList?.find((item) => item.id == staffId) || "";
      return item ? item.name : "";
    },
    isMaintenanceDue(maintenanceDate) {
      const currentDate = new Date();
      const maintenanceDueDate = new Date(maintenanceDate);
      // 将日期转换为字符串格式，比较日期部分
      return currentDate.toDateString() === maintenanceDueDate.toDateString();
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
.fixed-width-tag {
  width: 70px;
  text-align: center;
  display: inline-block;
}
</style>
