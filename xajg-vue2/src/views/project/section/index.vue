<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      title="标段列表"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <template slot="opratebtns">
        <el-button type="primary" @click="addHandle" icon="el-icon-plus">
          新增
        </el-button>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          />
          <el-table-column label="标段编码" prop="code" width="200" />
          <el-table-column label="标段名称" prop="name">
            <template #default="{ row }">
              <el-link
                type="primary"
                @click="
                  view(
                    row,
                    'fine',
                    row.procMatterTaskDone ||
                      row.matterTaskTodo ||
                      row.procMatterRun,
                    'view'
                  )
                "
              >
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="建设单位"
            prop="ownerUnitName"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            label="施工单位"
            prop="secondUnitName"
            align="center"
            width="200"
          >
          </el-table-column>
          <!-- <el-table-column label="工作范围" prop="scope" width="300">
          </el-table-column> -->
          <el-table-column label="操作" prop="name" width="200" align="center">
            <template #default="{ row }">
              <list-button
                :data="row"
                :btns="[
                  {
                    title: '编辑',
                    disabled: false,
                    method: 'edit',
                  },
                  {
                    title: '删除',
                    disabled: false,
                    method: 'delete',
                  },
                ]"
                @click="view"
                @delete="deleteHandle"
                @edit="edit"
              ></list-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <dataform
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :title="oprateRow.title"
      :readonly="oprateRow.isView"
      @closed="closedDialog"
      @ok="getTableData"
    ></dataform>
  </div>
</template>

<script>
import { remove } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
export default {
  name: "project-section",
  mixins: [ListMixin],
  components: {
    TableLayout,
    ListButton,
    dataform,
  },
  data() {
    return {
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      options: [],
      tableData: [],
      query: {},

      dictList: [],
      readonly: false,

      /**组织机构选择 */
      deptShow: false,

      url: { list: "/api/project/section/page" },
    };
  },
  computed: {},
  created() {
    // if(this.query.salaryMonth){
    //   this.query.salaryMonth
    // }
    this.getTableData();

    // this.getFlowStatus();
    // window.addEventListener("message", this.getMessage, false);
  },
  methods: {
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },

    /**新增 */
    addHandle() {
      this.oprateRow.data = {};
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
      this.oprateRow.title = "新增";
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
    // /**获取流程状态字典 */
    // async getFlowStatus() {
    //   // const { data } = await getDictItemList("PROC_TASK_TODO_STATUS");
    //   let data = [];
    //   console.log("enums.FLOW_STATUS_ENUM", enums.FLOW_STATUS_ENUM);
    //   let options = enums.FLOW_STATUS_ENUM;
    //   for (const key in options) {
    //     data.push({
    //       id: options[key].value,
    //       dictCode: options[key].value,
    //       dictName: options[key].name,
    //     });
    //   }
    //   this.flowStatusOptions = data;
    //   // console.log("flowStatusOptions", data);
    // },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    view(row, type, matter, action) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.oprateRow.title = "详情";
    },
    edit(val) {
      this.oprateRow.dialogShow = true;
      this.oprateRow.data = val;
      this.oprateRow.isView = false;
      this.type = val.type;
      this.enterAble = true;
      this.oprateRow.title = "编辑";
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

// .el-col .el-input {
//   width: 60%;
// }

// .lengthening .el-select {
//   width: 93%;

//   .el-input {
//     width: 100%;
//   }
// }
</style>
