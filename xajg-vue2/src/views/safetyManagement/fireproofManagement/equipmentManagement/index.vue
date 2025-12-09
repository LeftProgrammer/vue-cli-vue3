<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      title="设备管理列表"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="getTableData"
      @reset="reset"
    >
      <template slot="opratebtns">
        <el-button
          v-if="disablePermissionCheck"
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
            width="54"
            align="center"
            :index="getIndex"
          />
          <el-table-column label="设备编号" prop="code" align="left" />
          <el-table-column label="设备名称" prop="name" align="left">
            <template #default="{ row }">
              <el-link type="primary" class="text-ellipsis" @click="view(row)">
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="监控范围"
            prop="ranges"
            width="120"
            align="center"
          />
          <el-table-column label="关联位置" prop="point" align="left">
            <template #default="{ row }">
              <div class="text-ellipsis">
                {{ row.point }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="识别号" prop="discernNumber" align="left">
            <template slot-scope="{ row }">
              <div class="text-ellipsis">
                {{
                  row.videoType == "RTSP" || row.videoType == "YSXY"
                    ? row.channelId
                    : row.discernNumber
                      ? row.discernNumber
                      : "--"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="安装日期"
            prop="installDate"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              {{
                row.installDate ? timeFormat(row.installDate, "YYYY-MM-DD") : ""
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="180" align="center">
            <template #default="{ row }">
              <template v-if="!disablePermissionCheck">
                <el-button type="text" size="mini" @click="view(row)">查看</el-button>
                <!-- <list-button
                  :data="row"
                  @delete="deleteHandle"
                  @edit="edit"
                /> -->
              </template>
              <template v-else>
                <el-button type="text" size="mini" @click="edit(row)">
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  style="color: #f53f3f"
                  @click="deleteHandle(row)"
                >
                  删除
                </el-button>
              </template>
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
// import ListButton from "@/components/ListButton";
import dataform from "./dataform";
export default {
  name: "EquipmentManagement",
  components: {
    TableLayout,
    // ListButton,
    dataform,
  },
  mixins: [ListMixin],
  props: {
    disablePermissionCheck: {
      type: Boolean,
      default: false,
    },
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

      /**组织机构选择 */
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
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
      this.type = "edit";
      this.title = "编辑";
      console.log(row);
    },
    view(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.type = "view";
      this.title = "详情";
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
      this.pageParams.entity = this.query;
      const params = JSON.parse(JSON.stringify(this.pageParams));
      page(params).then((data) => {
        this.tableData = data.data.records;
        this.pageParams.total = data.data.total;
      });
    },
    /* 新增 */
    addHandle() {
      this.title = "新增";
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
<style scoped lang="scss">
/deep/.el-range-editor--medium .el-range-input {
  font-size: 12px;
}
</style>
