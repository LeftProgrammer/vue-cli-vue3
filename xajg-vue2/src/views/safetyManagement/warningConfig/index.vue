<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="getTableData"
      @reset="reset"
      title="预警指标"
    >
      <template slot="form">

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
            label="监测项目"
            prop="monitorProject"
            align="center"
          >
            <template slot-scope="{ row }">
              {{getTypeDictName(row.monitorProject)}}
            </template>
          </el-table-column>
          <el-table-column
            label="预警指标"
            prop="warningItem"
            align="center"
          >
            <template slot-scope="{ row }">
              {{getTypeDictName(row.warningItem)}}
            </template>
          </el-table-column>
          <el-table-column label="阈值" prop="thresholdUpperLimit" align="center">
            <template slot-scope="{ row }">
              {{
                (row.thresholdLowerLimit?('>'+row.thresholdLowerLimit):'')
                + ((row.thresholdLowerLimit && row.thresholdUpperLimit)?',':'')
                + (row.thresholdUpperLimit?('<'+row.thresholdUpperLimit):'')
              }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" align="center">
            <template slot-scope="{ row }">
              {{ row.status==='1'?'启用':'禁用' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="200" align="center">
            <template #default="{ row }">
              <list-button
                :data="row"
                @view="view"
                @delete="deleteHandle"
                @edit="edit"
                :btns="['edit', 'delete', 'view']"
                :disabledBtns="[
                  row.createUser !== userId ? 'edit' : '',
                  row.createUser !== userId ? 'delete' : ''
                ]"
              ></list-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <dataForm
      :type="type"
      :title="title"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="closedDialog"
      @ok="getTableData"
    >
    </dataForm>
  </div>
</template>

<script>
import { remove, page } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataForm from "@/views/safetyManagement/warningConfig/dataform.vue";
import { getDictItemList, buildTree } from "@/api/dict";

export default {
  name: "rainMonitoring",
  mixins: [ListMixin],
  components: {
    TableLayout,
    ListButton,
    dataForm
  },
  data() {
    return {
      type: "",
      title: "",
      DitSpeciality: [],
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0
      },
      oprateRow: {},
      options: [],
      tableData: [],
      date: [],
      query: {},
      typeDictMap: [],
      typeOptions: [],

      dictList: [],
      readonly: false,

      /**组织机构选择 */
      deptShow: false,

      url: { list: "" }
    };
  },
  created() {
    this.getDict();
    this.getTableData();
    this.userId = this.$getStorage("userInfo").userId;
  },
  methods: {
    getTypeDictName(id) {
      for (let item of this.typeDictMap) {
        if (item.dictCode === id) {
          return item.dictName;
        }
      }
    },
    async getDict(){
      let res = await getDictItemList("zxjclx");
      this.typeDictMap = res.data;
      this.typeOptions = buildTree(res.data, "-");
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    view(row) {
      this.type = "view";
      this.title = "查看-预警指标";
    },
    edit(row) {
      this.type = "edit";
      this.title = "编辑-预警指标";
      console.log(row);
    },
    reset() {
      this.query = {};
      this.date = [];
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
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
      this.title = "新增-预警指标";
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
        id: row.id
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
          type: "warning"
        });
        this.deletedata(row.id);
      } catch (e) {
        console.error(e);
      }
    }
  }
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
