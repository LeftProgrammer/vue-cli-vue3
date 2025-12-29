<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleQuery"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="人员/设备编号:">
            <el-input v-model="query.deviceCode" placeholder="请输入" />
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
            label="类型"
            prop="deviceType"
            align="center"
            width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.deviceType == 1 ? "人员" : "设备" }}
              <!--              <el-tag v-if="scope.row.type == 1" type="success" effect="dark" size="medium">人员</el-tag>-->
              <!--              <el-tag v-if="scope.row.type == 2" type="danger" effect="dark" size="medium">设备</el-tag>-->
            </template>
          </el-table-column>
          <el-table-column
            label="人员/设备编号"
            show-overflow-tooltip
            prop="deviceCode"
            align="center"
            width="200"
          />
          <el-table-column label="经纬度" prop="longitude" align="center">
            <template slot-scope="scope">
              {{
                scope.row.longitude
                  ? Number(scope.row.longitude).toFixed(6)
                  : ""
              }},{{
                scope.row.latitude ? Number(scope.row.latitude).toFixed(6) : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="高程"
            prop="elevation"
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              {{
                scope.row.elevation
                  ? Number(scope.row.elevation).toFixed(2)
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="定位时间"
            prop="recordTime"
            align="center"
            width="180"
          >
            <template slot-scope="scope">{{
              timeFormat(scope.row.recordTime, "yyyy-MM-DD HH:mm")
            }}</template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="status"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.status == 1"
                type="success"
                effect="dark"
                size="medium"
              >正常</el-tag>
              <el-tag
                v-if="scope.row.status == 0"
                type="danger"
                effect="dark"
                size="medium"
              >异常</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            show-overflow-tooltip
            prop="remark"
            align="left"
          />
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-link type="danger" @click="deleteHandle(row)">删除</el-link>
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
import { page, remove } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";

export default {
  name: "StaffManagement",
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
      readonly: false,
      userId: "",
    };
  },
  computed: {},
  created() {
    this.getTableData();
    this.userId = this.$getStorage("userInfo").userId;
  },
  methods: {
    triggerFileInput() {
      this.$nextTick(() => {
        this.$refs.fileInput.click();
      });
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    edit(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.type = "edit";
      this.title = "编辑-人员管理数据";
      console.log(row);
    },
    view(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.type = "view";
      this.title = "详情";
    },
    reset() {
      this.selectedUnitName = "";
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
      this.pageParams.entity = this.query;
      const params = JSON.parse(JSON.stringify(this.pageParams));
      page(params).then((data) => {
        this.tableData = data.data.records;
        this.pageParams.total = data.data.total;
        console.log("page结果", data, this.tableData);
      });
    },
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    /* 新增 */
    addHandle() {
      this.type = "addHandle";
      this.title = "新增";
      console.log("addHandle");
      this.oprateRow.data = {};
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
    },
    /**
     * 获取进退场状态文本
     */
    getStatusText(status) {
      switch (Number(status)) {
        case 1:
          return "正常";
        case 2:
          return "异常";
        default:
          return "未知";
      }
    },
    /** 删除*/
    deleteHandle(row) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          remove(row.deviceType, row.deviceCode).then((res) => {
            if (!res.success) {
              return this.$message.error("删除失败：" + res.message);
            }
            this.$message.success("删除成功");
            this.getTableData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm");
    },

    /**
     * 处理下拉框显示变化
     * @param {Boolean} visible 是否显示
     * @param {String} popperClass 下拉框的类名
     */
    $visibleChange(visible, popperClass) {
      console.log("下拉框状态变化", visible, popperClass);
    },

    handleVisibleChange(visible) {
      if (visible) {
        this.$nextTick(() => {
          console.log("下拉框可见性变化", visible);
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.el-tree {
  /deep/ .el-tree-node__content {
    .custom-tree-node {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;

      span {
        flex: 1;
      }
    }
  }
}

.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;
}

.el-col .el-input {
  width: 60%;
}

/deep/ .el-range-editor--small .el-range-input {
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
/deep/ .el-range-editor--medium .el-range-input {
  font-size: 12px;
}

/deep/
  .table-content
  > .el-row
  .search-form
  .search-inputform
  .el-form-item
  .el-form-item__label {
  width: 100px;
}

/* 树形下拉选择器样式 */
.tree-select {
  .el-select-dropdown__wrap {
    max-height: 550px;
    overflow-x: hidden;
  }

  .tree-select-container {
    padding: 6px 0;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px !important;
    font-family: inherit !important;
  }

  .disabled-node {
    color: #c0c4cc;
    cursor: not-allowed;
  }

  .el-select-dropdown__item.selected {
    font-weight: normal;
  }

  .el-tree-node__content {
    height: 34px;
  }

  .el-tree-node.is-current > .el-tree-node__content {
    background-color: #f5f7fa;
  }

  .el-tree-node__content:hover {
    background-color: #f5f7fa;
  }

  .el-tree {
    font-size: 14px !important;
    font-family: inherit !important;
  }

  .el-scrollbar {
    height: auto !important;
    max-height: 550px;
  }

  .el-select-dropdown__item {
    height: auto;
    padding: 0;
    font-size: 14px !important;
    font-family: inherit !important;
  }
}
</style>
