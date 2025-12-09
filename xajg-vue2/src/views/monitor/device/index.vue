<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      :showSearchBtns="false"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="getTableData"
      @reset="reset"
      title="监测点列表"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="监测项目:">
            <dict
              code="zxjclx"
              v-model="query.pointType"
              @change="getTableData"
            ></dict>
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
      <template v-slot:table="{ getIndex }">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column
            label="序号"
            :index="getIndex"
            type="index"
            width="50"
            align="center"
          />
          <el-table-column label="监测点编码" prop="code" align="center" />
          <el-table-column label="监测点名称" prop="name" align="center" />
          <el-table-column label="监测项目" prop="pointType" align="center">
            <template slot-scope="{ row }">
              <dict
                code="zxjclx"
                v-model="row.pointType"
                :readonly="true"
              ></dict>
            </template>
          </el-table-column>
          <el-table-column
            label="设备安装单位"
            prop="installUnit"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="创建日期"
            prop="createDate"
            align="center"
            width="180"
          >
            <template slot-scope="{ row }">
              {{
                row.createDate
                  ? timeFormat(row.createDate, "YYYY-MM-DD HH:mm:ss")
                  : ""
              }}
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
      @closed="closedDialog"
      @ok="getTableData"
    >
    </dataform>
  </div>
</template>

<script>
import { remove, page } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import Dict from "@/components/Dict";
import dataform from "./dataform";
export default {
  name: "monitor-device-index",
  mixins: [ListMixin],
  components: {
    TableLayout,
    ListButton,
    Dict,
    dataform,
  },
  data() {
    return {
      type: "",
      title: "",
      DitSpeciality: [],
      pageParams: {
        size: 20,
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
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    dateChange(e) {
      console.log(e);
      if (e == null) {
        this.query = {};
      }
    },
    edit(row) {
      this.type = "edit";
      this.title = "编辑-监测点";
      console.log(row);
    },
    view(row) {
      this.type = "view";
      this.title = "查看-监测点";
      console.log(this.type);
    },
    reset() {
      this.query = {};
      this.date = [];
      this.pageParams.current = 1;
      // this.query.current = 1;
      // this.query.pageSize = 20;
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      if (this.date && this.date.length > 0) {
        this.query.startDate = this.date[0] + " 00:00:00";
        this.query.endDate = this.date[1] + " 23:59:59";
      }
      if (!this.query.pointType) {
        delete this.query.pointType;
      }
      this.pageParams.entity = this.query;
      this.pageParams.orderProperties = [
        {
          property: "createDate",
          asc: false,
        },
      ];
      const params = JSON.parse(JSON.stringify(this.pageParams));
      page(params).then((data) => {
        this.tableData = data.data.records;
        this.pageParams.total = data.data.total;
      });
    },
    /* 新增 */
    addHandle() {
      this.title = "新增-监测点";
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

    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams.current = val.current;
      this.getTableData();
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
