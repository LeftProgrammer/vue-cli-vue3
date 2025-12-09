<template>
  <div class="page-leave">
    <table-layout
      :page="pageParams"
      title="设计成果分发"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      @query="getTableData"
      :showExportBtn="true"
      @initExportParams="initExportParams"
    >
      <template slot="form">
        <el-form :model="query" ref="query" :inline="true">
          <el-form-item label="图纸编号:" size="mini" prop="code">
            <el-input v-model="query.code" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="图纸名称:" size="mini" prop="name">
            <el-input v-model="query.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="专业:" size="mini" prop="profession">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              v-model="query.profession"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in designProfessionOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="流程状态:" size="mini" prop="flowState">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              v-model="query.flowStatus"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in flowStatusOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发起日期:" size="mini" prop="startTime">
            <el-date-picker
              v-model="startTimeAndEndTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 230px"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelShowDialog(null, 'mine')"
        >
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
            :index="getIndex"
          />
          <el-table-column
            label="图纸编号"
            prop="code"
            align="left"
            header-align="center"
            excel.sort="1"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.code ? row.code : ''"
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis-clamp">
                  {{ row.code ? row.code : "" }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="图纸名称"
            prop="name"
            align="left"
            header-align="center"
            excel.sort="2"
          >
            <template slot-scope="scope">
              <span :title="scope.row.name" class="text-ellipsis-clamp">{{
                scope.row.name
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="专业"
            prop="profession"
            align="center"
            width="100"
            excel.sort="3"
            excel.dictType="DESIGN_PROFESSION"
          >
            <template slot-scope="scope">
              {{
                $DictionaryParsing(
                  designProfessionOptions,
                  scope.row.profession
                )
              }}</template
            >
          </el-table-column>

          <el-table-column
            label="发起日期"
            prop="createDate"
            align="center"
            width="160"
            excel.sort="4"
            excel.dateFormat="yyyy-MM-dd HH:mm:ss"
          >
            <template slot-scope="{ row }">
              {{ row.createDate ? timeFormat(row.createDate) : "" }}
            </template>
          </el-table-column>
          <el-table-column
            label="工程部位"
            prop="pbsCode"
            align="center"
            width="200"
            excel.sort="5"
            excel.handler="excelHandleCovert"
            excel.args="pbs"
          >
            <template slot-scope="scope">
              <bim-show :pbsCode="scope.row.pbsCode"></bim-show>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="流程状态"
            prop="flowStatus"
            align="center"
            excel.sort="6"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
          >
            <template slot-scope="scope">
              <flow-status :row="scope.row" :flowName="flowName"></flow-status>
            </template>
          </el-table-column>
          <el-table-column
            label="当前节点"
            prop="flowName"
            align="center"
            width="180"
            excel.sort="7"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.flowName ? row.flowName : ''"
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis-clamp">
                  {{ row.flowName ? row.flowName : "" }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column
              label="当前节点"
              prop="flowStatus"
              align="center"
              width="180"
            >
              <template slot-scope="scope">
                <flow-node :row="scope.row" :flowName="flowName"></flow-node>
              </template>
            </el-table-column> -->
          <el-table-column
            width="200"
            label="操作"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <div class="flex justify-center">
                <flow-button
                  :promiseCode="'design-center-drawingSend_delete'"
                  :row="row"
                  :flowName="flowName"
                  @click="handelShowDialog"
                  @delete="deletedata"
                ></flow-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    ></flow-dialog>
  </div>
</template>

<script>
import { add, remove, page } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import enums from "@/config/enums";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import bimShow from "@/components/Bim/Show";
export default {
  name: "design-center-drawingSupply",
  mixins: [FlowListMixin],
  components: { TableLayout, bimShow },
  computed: {
    exportParams() {
      this.pageParams.entity = this.query;
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.startTime = this.startTimeAndEndTime[0];
        this.pageParams.entity.endTime = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.startTime = "";
        this.pageParams.entity.endTime = "";
      }
      return this.pageParams;
    }
  },
  data() {
    return {
      startTimeAndEndTime: [],
      pageParams: {
        pageSize: 20,
        currentSize: 1,
        total: 0
      },
      options: [],
      tableData: [],
      query: {},
      formData: {
        id: null,
        applyDate: null,
        applyDept: "",
        applyDeptId: 0,
        applyDuty: "",
        applyDutyId: 0,
        applyNo: "",
        applyUser: "",
        applyUserId: 0,
        bizStatus: "",
        bpmStatus: 0,
        deleteStatus: 0,
        leaveCategory: "",
        leaveCategoryText: "",
        leaveEndtime: null,
        leaveHours: 0,
        leaveReason: "",
        leaveStarttime: null,
        uploadFile: "",
        uploadFileList: []
      },
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      /**设计专业 */
      designProfessionOptions: [],
      /**流程状态 */
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
      /**流程弹窗 */
      flowShow: false,
      // /**流程状态 */
      // flowPage: "mine", //待办是todo，已办done，已发sent，
      // flowId: "P1138462007083663363",
      /**流程弹窗信息 */
      flowInfo: {
        /**供应计划流程：流程id */
        businessId: "",
        // flowCfgId: "P1131979769345212416",
        /**状态 */
        status: false
      }
    };
  },
  created() {
    this.getTableData();
    this.getDictItemList(this.designProfessionCode);
    window.addEventListener("message", this.getMessage, false);
    this.getFlowStatus();
  },
  methods: {
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/drawing/issue/export";
      exportParams.filename = "图纸分发";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      let data = [];
      let options = enums.FLOW_STATUS_ENUM;
      for (const key in options) {
        data.push({
          id: options[key].value,
          dictCode: options[key].value,
          dictName: options[key].name
        });
      }
      this.flowStatusOptions = data;
    },
    /**重置表格数据 */
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = [];
      this.getTableData();
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    deletedata(row) {
      if (!row.id) {
        return;
      }
      remove({
        id: row.id
      }).then((res) => {
        if (res.success) {
          this.getTableData();
        } else {
          this.$message.error("数据删除异常，" + res.message);
        }
      });
    },
    // 查询表格数据
    getTableData(pageInfo) {
      this.tableData = [];
      this.pageParams.entity = this.query;
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.startTime = this.startTimeAndEndTime[0];
        this.pageParams.entity.endTime = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.startTime = "";
        this.pageParams.entity.endTime = "";
      }
      this.pageParams = Object.assign(this.pageParams, pageInfo);
      page(this.pageParams).then((data) => {
        this.tableData = data.data.records;
        this.pageParams.total = data.data.total;
      });
    },
    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.designProfessionCode) {
        if (
          !this.designProfessionOptions ||
          this.designProfessionOptions.length == 0
        ) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.designProfessionOptions = res.data;
            }
          });
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

  .table {
    height: 100%;

    /deep/ .el-table__row .cell button {
      padding: 0 !important;
    }
  }

  .pagination {
    padding: 0 20px;
  }
}

.el-col .el-input {
  width: 60%;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}
.pagination-container {
  display: flex;
  .pagination {
    margin-left: auto;
  }
}

/deep/ .el-range-editor--mini.el-input__inner {
  height: inherit !important;
}
/deep/ .el-date-editor .el-range-separator {
  line-height: 32px !important;
}
</style>
