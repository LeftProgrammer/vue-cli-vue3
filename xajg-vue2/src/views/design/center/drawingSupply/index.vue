<template>
  <div class="page-leave">
    <table-layout
      :page="pageParams"
      title="图纸报审列表"
      :show-export-btn="true"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      @query="handleQuery"
      @initExportParams="initExportParams"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="图纸编号:" size="mini">
            <el-input v-model="query.code" placeholder="请输入编号" />
          </el-form-item>
          <el-form-item label="图纸名称:" size="mini">
            <el-input v-model="query.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="专业:" size="mini">
            <el-select
              ref="flowStateRef"
              v-model="query.profession"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in designProfessionOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="流程状态:" size="mini">
            <el-select
              ref="flowStateRef"
              v-model="query.flowStatus"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in flowStatusOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发起日期:" size="mini">
            <el-date-picker
              v-model="startTimeAndEndTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 230px"
            />
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
            width="80"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            label="图纸编号"
            prop="code"
            header-align="center"
            align="left"
            excel.targetAttr="designSupply.code"
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
            excel.targetAttr="designSupply.name"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.name ? row.name : ''"
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis-clamp">
                  {{ row.name ? row.name : "" }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="专业"
            width="100"
            prop="profession"
            align="center"
            excel.dictType="DESIGN_PROFESSION"
            excel.targetAttr="designSupply.profession"
          >
            <template slot-scope="scope">
              <span>{{ getTypeText(scope.row.profession) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="版本"
            width="100"
            prop="allData.version"
            align="center"
            excel.prop="version"
          />

          <el-table-column
            label="发起人"
            width="100"
            prop="createUser"
            align="center"
            excel.handler="excelHandleCovert"
            excel.args="user"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.allData.createUsername
                  ? scope.row.allData.createUsername
                  : "*"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发起日期"
            prop="createDate"
            align="center"
            width="160"
            excel.dateFormat="yyyy-MM-dd HH:mm:ss"
          >
            <template slot-scope="{ row }">
              {{
                row.allData.createDate ? timeFormat(row.allData.createDate) : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="工程部位"
            width="200"
            prop="pbsCode"
            align="center"
            excel.targetAttr="designSupply.pbsCode"
            excel.handler="excelHandleCovert"
            excel.args="pbs"
          >
            <template slot-scope="{ row }">
              <bim-show :pbs-code="row.pbsCode" />
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="流程状态"
            prop="allData.flowStatus"
            align="center"
            excel.prop="flowStatus"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
          >
            <template slot-scope="scope">
              <flow-status :row="scope.row.allData" :flow-name="flowName" />
            </template>
          </el-table-column>
          <el-table-column
            label="当前节点"
            prop="allData.flowName"
            align="center"
            width="180"
            excel.prop="flowName"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.allData.flowName ? row.allData.flowName : ''"
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis-clamp">
                  {{ row.allData.flowName ? row.allData.flowName : "" }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <div class="flex justify-center">
                <flow-button
                  :promise-code="'design-center-drawingSupply_delete'"
                  :row="row.allData"
                  :flow-name="flowName"
                  @click="handelShowDialog"
                  @delete="deletedata"
                />

                <!-- <button @click="handelDel(row)">删除</button> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <flow-dialog
      :visible="flowShow"
      :flow-info="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    />
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import { remove, page } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import enums from "@/config/enums";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import bimShow from "@/components/Bim/Show";

export default {
  name: "DesignCenterDrawingSupply",
  components: { TableLayout, bimShow },
  mixins: [FlowListMixin],
  data() {
    return {
      startTimeAndEndTime: [],
      dialog: true,
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      options: [],
      tableData: [],
      query: {},
      showDialog: false,
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
        uploadFileList: [],
      },

      currentSection: [],
      dictList: [],
      readonly: false,

      /**人员选择 */
      persons: [],
      /**组织机构选择 */
      deptShow: false,
      /**岗位 */
      dutyOptions: [],
      /**请假类型 */
      leaveCategoryOptions: [],

      /**流程状态 */
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      /**设计专业 */
      designProfessionOptions: [],
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
        status: false,
      },
      //编辑通过当前人待办做判断。流程数据不运输删除
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    exportParams() {
      this.query.type = 1;
      this.pageParams.entity.flowStatus = this.query.flowStatus;
      this.pageParams.entity.designSupply = { ...this.query };
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.beginTime = this.startTimeAndEndTime[0];
        this.pageParams.entity.endTime = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.beginTime = "";
        this.pageParams.entity.endTime = "";
      }
      return this.pageParams;
    },
  },
  created() {
    this.getTableData();
    this.getDictItemList(this.designProfessionCode);
    this.getFlowStatus();
  },
  methods: {
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/design/supply/detail/export";
      exportParams.filename = "图纸供应";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    // 展示bim
    showMime() {},
    /**重置表格数据 */
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = [];
      this.getTableData();
    },

    getTypeText(value) {
      let text = "*";
      let a = this.designProfessionOptions.find(
        (item) => item.dictCode == value
      );
      if (a) {
        text = a.dictName;
      }
      return text;
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      let data = [];
      let options = enums.FLOW_STATUS_ENUM;
      for (const key in options) {
        data.push({
          id: options[key].value,
          dictCode: options[key].value,
          dictName: options[key].name,
        });
      }
      this.flowStatusOptions = data;
      // console.log("flowStatusOptions", data);
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    // 查询表格数据
    getTableData(pageInfo) {
      this.tableData = [];
      this.query.type = 1;
      this.pageParams.entity.flowStatus = this.query.flowStatus;
      this.pageParams.entity.designSupply = { ...this.query };
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.beginTime = this.startTimeAndEndTime[0];
        this.pageParams.entity.endTime = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.beginTime = "";
        this.pageParams.entity.endTime = "";
      }
      // this.pageParams.entity = this.query.entity;
      this.pageParams = Object.assign(this.pageParams, pageInfo);
      page(this.pageParams).then((data) => {
        let a = [];
        data.data.records.forEach((element) => {
          a.push({
            ...element.designSupply,
            allData: element,
          });
        });
        this.tableData = a;
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
    },
    deletedata(row) {
      if (!row.id) {
        return;
      }
      let params = {
        id: row.id,
        designSupply: {
          id: row.designSupply.id,
        },
      };
      remove(params).then((res) => {
        if (res.success) {
          this.getTableData();
        } else {
          this.$message.error("数据删除异常，" + res.message);
        }
      });
    },
  },
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
