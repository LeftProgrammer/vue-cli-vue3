<template>
  <div
    class="page-leave"
    :style="{ padding: pageType === 'DesignApplication' ? '0' : '15px' }"
  >
    <table-layout
      :page="pageParams"
      :pageType="pageType"
      title="工程变更列表"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      @query="handleQuery"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item
            v-if="pageType !== 'DesignApplication'"
            label="申请编号:"
            size="mini"
          >
            <el-input
              v-model="query.projectChangeCode"
              placeholder="请输入申请编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="图纸编号:" size="mini">
            <el-input
              v-model="query.code"
              placeholder="请输入图纸编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="图纸名称:" size="mini">
            <el-input
              v-model="query.drawingName"
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="pageType !== 'DesignApplication'"
            label="施工标段:"
            size="mini"
            prop="sectionId"
          >
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              ref="sectionIdRef"
              v-model="query.sectionId"
              placeholder="请选择"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in sectionOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="所属标段:" size="mini">
            <el-input
              v-model="query.sectionId"
              placeholder="请输入所属标段"
            ></el-input>
          </el-form-item> -->
          <el-form-item
            v-if="pageType !== 'DesignApplication'"
            label="专业:"
            size="mini"
          >
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
          <el-form-item
            v-if="pageType !== 'DesignApplication'"
            label="流程状态:"
            size="mini"
          >
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
          <el-form-item
            v-if="pageType !== 'DesignApplication'"
            label="发起日期:"
            size="mini"
          >
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
      <template slot="opratebtns" v-if="pageType !== 'DesignApplication'">
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
          />
          <el-table-column
            label="申请编号"
            prop="projectChangeCode"
            header-align="center"
            align="left"
          />
          <el-table-column
            label="图纸编号"
            prop="code"
            header-align="center"
            align="left"
          />
          <el-table-column
            label="图纸名称"
            prop="drawingName"
            align="left"
            header-align="center"
          >
            <template slot-scope="scope">
              <span :title="scope.row.drawingName" class="text-ellipsis">{{
                scope.row.drawingName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="专业"
            width="100"
            prop="profession"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ getTypeText(scope.row.profession) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="工程部位" prop="pbsCode" align="center">
            <template slot-scope="scope">
              <bim-show
                :pbsCode="getPbsName(scope.row.pbsCode)"
                v-if="pageType !== 'DesignApplication'"
              ></bim-show>
              <el-link
                style="color: #409eff"
                @click="relevancyBim(getPbsName(scope.row.pbsCode))"
                v-if="pageType === 'DesignApplication'"
                >{{ scope.row.pbsName }}</el-link
              >
            </template>
          </el-table-column>
          <el-table-column
            label="所属标段"
            width="200"
            prop="sectionId"
            align="center"
            :formatter="sectionIdFormatter"
          >
          </el-table-column>
          <el-table-column
            label="发起人"
            width="100"
            prop="createUser"
            align="center"
            v-if="pageType !== 'DesignApplication'"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.createUsername ? scope.row.createUsername : "*"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发起日期"
            prop="createDate"
            align="center"
            width="140"
            v-if="pageType !== 'DesignApplication'"
          >
            <template slot-scope="{ row }">
              {{ row.createDate ? timeFormat(row.createDate) : "" }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="流程状态"
            prop="flowStatus"
            align="left"
            v-if="pageType !== 'DesignApplication'"
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
            v-if="pageType !== 'DesignApplication'"
          />
          <!-- <el-table-column
            label="当前节点"
            prop="flowStatus"
            align="center"
            width="180"
          >
            <template #default="{ row }">
              <flow-node
                :row="row"
                :flowName="flowName"
                class="text-ellipsis"
              ></flow-node>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="200" prop="name" align="left">
            <template #default="{ row }">
              <div class="flex justify-center">
                <flow-button
                  :promiseCode="'design-center-drawingSupply_delete'"
                  :row="row"
                  :flowName="flowName"
                  :btns="
                    pageType === 'DesignApplication'
                      ? ['view']
                      : ['view', 'deal', 'delete']
                  "
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
import TableLayout from "@/components/ContentLayout/Table";
import { remove, page, sectionList } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import enums from "@/config/enums";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import bimShow from "@/components/Bim/Show";
import { getByCode } from "@/components/PbsSelect/api";

export default {
  name: "design-center-drawingSupply",
  mixins: [FlowListMixin],
  components: { TableLayout, bimShow },
  props: {
    /**页面类型 设计应用：DesignApplication */
    pageType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      /**施工标段 */
      sectionOptions: [],
      startTimeAndEndTime: [],
      dialog: true,
      pageParams: {
        size: 20,
        current: 1,
        total: 0
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
        uploadFileList: []
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
        status: false
      }
      //编辑通过当前人待办做判断。流程数据不运输删除
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"])
  },
  created() {
    // this.getTableData();
    this.getDictItemList(this.designProfessionCode);
    //获取标段
    this.getSectionList();
    // this.getFlowStatus();
  },
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    /** 工程部位可查看 */
    getPbsName(val) {
      let text = "*";
      let a = val?.split("&&&")[0];
      if (a) {
        text = a;
      }
      return text;
    },
    //翻译列表所属标段 id=>name
    sectionIdFormatter(row, column) {
      var value = "";
      for (var i = 0; i < this.sectionOptions.length; i++) {
        var item = this.sectionOptions[i];
        if (row.sectionId == item.id) {
          value = item.name;
          break;
        }
      }
      return value;
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        if (res.success) {
          console.log("sectionList", res.data);
          this.sectionOptions = res.data;
        }
      });
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
          dictName: options[key].name
        });
      }
      this.flowStatusOptions = data;
      // console.log("flowStatusOptions", data);
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    // 查询表格数据
    getTableData(pageParams, pbsCode) {
      this.query.pbsCode = pbsCode;
      this.tableData = [];
      this.query.type = 1;
      this.pageParams.entity.flowStatus = this.query.flowStatus;
      this.pageParams.entity = { ...this.query };
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.startDate = this.startTimeAndEndTime[0];
        this.pageParams.entity.endDate = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.startDate = "";
        this.pageParams.entity.endDate = "";
      }
      page(this.pageParams).then((res) => {
        let tableData = res.data.records;
        console.log("tableData", tableData);
        this.$set(this, "tableData", tableData);
        this.pageParams.total = res.data.total;
        // 设计应用页面设置pbs名称
        if (
          this.tableData &&
          this.tableData.length > 0 &&
          this.pageType === "DesignApplication"
        ) {
          for (let i = 0; i < this.tableData.length; i++) {
            getByCode(this.getPbsName(this.tableData[i].pbsCode)).then(
              (res) => {
                try {
                  this.$set(this.tableData[i], "pbsName", res.data.name || "");
                } catch (e) {
                  // console.error(e);
                }
              }
            );
          }
        }
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
        } else {
        }
      }
    },
    deletedata(row) {
      let params = {
        id: row.id
      };
      remove(params).then((res) => {
        this.getTableData();
      });
    },
    /**设计应用-关联bim模型*/
    relevancyBim(pbsCode) {
      this.$emit("relevancyBim", pbsCode);
    }
  }
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  // padding: 15px;

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
