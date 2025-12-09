<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="getTableData"
      @reset="reset"
      title="行为监控列表"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="所属设备:">
            <el-select
              v-model="query.equipmentId"
              placeholder="请选择设备"
              class="w-100pre"
              clearable
            >
              <el-option
                v-for="item in equipmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围:">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              style="width: 350px"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button type="primary" icon="el-icon-plus" @click="addHandle()">
          新增
        </el-button>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            width="50"
            align="center"
          />
          <el-table-column
            label="所属装备"
            prop="equipmentId"
            align="left"
            width="150px"
          >
            <template slot-scope="scoped">
              <el-link type="primary" @click="view(scoped.row)">{{
                equipmentList.find((item) => item.id == scoped.row.equipmentId)
                  ?.name
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="记录时间" align="center" prop="type" width="200">
            <template slot-scope="scoped">
              {{ timeFormat(scoped.row.actionTime,"YYYY-MM-DD HH:mm") }}
            </template>
          </el-table-column>
          <el-table-column label="详细内容" prop="detail" align="center">
            <template slot-scope="{ row }">
              <!-- <el-tooltip
                :content="row.detail"
                placement="top"
                effect="dark"
                popper-class="detail-tooltip"
              > -->
                <span class="text-ellipsis">
                  {{ row.detail }}
                </span>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-link type="danger" @click="handelDeleteRow(row)"
                >删除</el-link
              >
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
      @closed="closedDialog"
      @ok="getTableData"
    >
    </dataform>
  </div>
</template>

<script>
import { remove, page, equipmentList } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import { getDictItemList } from "@/api/dict";
import bimShow from "@/components/Bim/Show/index.vue";

export default {
  name: "actionMonitor",
  mixins: [ListMixin],
  components: {
    bimShow,
    TableLayout,
    ListButton,
    dataform,
  },
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
      oprateRow: {
        dialogShow: false,
        data: {},
        isView: false,
      },
      options: [],
      tableData: [],
      query: {
        equipmentId: null,
      },
      dateRange: [],
      dictList: [],
      readonly: false,
      deptShow: false,
      url: { list: "" },
      userId: "",
      equipmentList: [],
    };
  },
  computed: {},
  created() {
    this.getTableData();
    this.userId = this.$getStorage("userInfo").userId;
    this.getEquipmentList();
  },
  methods: {
    getEquipmentList() {
      equipmentList().then((res) => {
        this.equipmentList = res.data;
      });
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
      this.title = "编辑";
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      console.log(row);
    },
    view(row) {
      this.type = "view";
      this.title = "详情";
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
    },
    reset() {
      this.query.equipmentId = null;
      this.dateRange = [];
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
      // 处理日期范围
      if (this.dateRange && this.dateRange.length === 2) {
        // 将日期字符串转换为时间戳
        const startDate = new Date(this.dateRange[0] + " 00:00:00");
        const endDate = new Date(this.dateRange[1] + " 23:59:59");
        this.query.startDate = startDate.getTime();
        this.query.endDate = endDate.getTime();
      } else {
        this.query.startDate = null;
        this.query.endDate = null;
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
      this.type = "add";
      this.title = "新增";
      console.log("addHandle");
      this.oprateRow.data = {};
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
    },
    /** 删除*/
    deleteHandle(row) {
      remove(row).then((res) => {
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
        this.deleteHandle(row);
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

<style>
/* 全局样式 - 控制tooltip宽度 */
.detail-tooltip {
  max-width: 30% !important;
  word-break: break-all;
  white-space: normal;
  line-height: 1.5;
}
</style>
