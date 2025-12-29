<!-- 材料报检页面 -->
<template>
  <div class="page-leave">
    <table-layout
      :page="pageParams" title="报检列表" @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange" @reset="reset" @query="handleQuery"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="样品编号:" size="mini">
            <el-input v-model="query.code" placeholder="请输入样品编号" />
          </el-form-item>
          <el-form-item label="材料名称:" size="mini">
            <el-select ref="typeRef" v-model="query.name" placeholder="请选择材料名称" clearable filterable @visible-change="$visibleChange($event, 'el-popper')">
              <el-option v-for="item in nameList" :key="item.dictName" :label="item.dictName" :value="item.dictCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="材料分类:" size="mini">
            <el-select ref="typeRef" v-model="query.materialClass" placeholder="请选择材料分类" clearable @visible-change="$visibleChange($event, 'el-popper')">
              <el-option v-for="item in typeList" :key="item.dictName" :label="item.dictName" :value="item.dictCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="流程状态:" size="mini">
            <el-select ref="flowStateRef" v-model="query.flowStatus" placeholder="请选择流程状态" clearable @visible-change="$visibleChange($event, 'el-popper')">
              <el-option v-for="item in flowStatusOptions" :key="item.id" :label="item.dictName" :value="item.dictCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="发起日期:" size="mini">
            <el-date-picker v-model="startTimeAndEndTime" type="daterange" value-format="yyyy-MM-dd" style="width: 230px" />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button type="primary" icon="el-icon-plus" @click="handelShowDialog(null, 'mine')">
          新增
        </el-button>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column label="序号" type="index" width="80" align="center" :index="getIndex" />
          <el-table-column label="样品编号" prop="code" header-align="center" align="left" />
          <el-table-column label="材料名称" prop="name" align="left" header-align="center">
            <template slot-scope="scope">
              <span v-if="nameList">{{ $DictionaryParsing(nameList, scope.row.name) }}</span>
            </template>
            <!-- <template slot-scope="scope">
              <span :title="scope.row.name" class="text-ellipsis">{{
                scope.row.name
              }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="材料分类" width="100" prop="materialClass" align="center">
            <template slot-scope="scope">
              <span v-if="typeList">{{ $DictionaryParsing(typeList, scope.row.materialClass) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="进场日期" width="200" prop="commencementDate" align="center">
            <template slot-scope="{ row }">
              {{
                row.commencementDate
                  ? timeFormat(row.commencementDate, "YYYY-MM-DD")
                  : ""
              }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="工程部位"
            prop="pbsCode"
            align="center"
            width="180"
          >
            <template slot-scope="{ row }">
              <bim-show :pbsCode="getPbsCode(row.pbsCode)"></bim-show>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="使用部位" prop="pbsCode" align="center" /> -->
          <el-table-column label="施工单位" prop="contractor" align="center" />
          <el-table-column label="所属标段" prop="sectionId" align="center" width="120" :formatter="sectionIdFormatter" />
          <el-table-column label="发起人" width="100" prop="createUser" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.createUsername ? scope.row.createUsername : "*"
              }}</span>
            </template> </el-table-column>>

          <el-table-column width="140" label="发起日期" prop="createDate" align="center">
            <template slot-scope="{ row }">
              {{
                row.createDate ? timeFormat(row.createDate) : ""
              }}
            </template>
          </el-table-column>
          <el-table-column label="使用部位" width="180" prop="pbsCode" align="center">
            <template slot-scope="scope">
              <bim-show :pbs-code="scope.row.pbsCode" />
            </template>
          </el-table-column>
          <el-table-column label="流程状态" prop="flowStatus" align="center" width="180">
            <template slot-scope="scope">
              <flow-status :row="scope.row" :flow-name="flowName" />
            </template> </el-table-column>>
          <el-table-column label="当前节点" prop="flowName" align="center" />
          <el-table-column label="操作" width="200" prop="name" align="center">
            <template #default="{ row }">
              <div class="flex justify-center">
                <flow-button
                  :promise-code="'design-center-drawingSupply_delete'" :row="row" :flow-name="flowName"
                  @click="handelShowDialog" @delete="deletedata"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <flow-dialog
      :visible="flowShow" :flow-info="flowInfo" @childEvt="childEvtHandle"
      @closed="flowShow = false"
    />
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

export default {
  name: "MaterialInspection",
  components: { TableLayout, bimShow },
  mixins: [FlowListMixin],
  data() {
    return {
      sectionOptions: "",
      typeList: [],
      nameList: [],
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
  },
 async created() {
    // await this.getnameList();
    this.getDictItemList(this.designProfessionCode);
    this.getFlowStatus();
    this.getnameList();
  },
  mounted() {
    //获取标段
    this.getSectionList();
  },
  methods: {

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
    /**获取字典 */
    async getnameList() {
      // this.$store.dispatch("dict/get", "clmc").then((data) => {
      //   this.nameList = data;
      //   console.log("this.nameList",this.nameList);
      // });
      // this.$store.dispatch("dict/get", "clfl").then((data) => {
      //   this.typeList = data;
      //   console.log("this.typeList",this.typeList);
      // });
      let names = await this.$store.dispatch("dict/get", "clmc")
      this.nameList = names;
      let types = await this.$store.dispatch("dict/get", "clfl")
      this.typeList = types;
    },

    // 展示bim
    showMime() { },
    /**重置表格数据 */
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = [];
      this.getTableData();
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
    // 查询表格数据
    getTableData(pageInfo) {
      this.tableData = [];
      this.pageParams.entity.flowStatus = this.query.flowStatus;
      this.pageParams.entity = { ...this.query };
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.startDate = this.startTimeAndEndTime[0];
        this.pageParams.entity.endDate = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.startDate = "";
        this.pageParams.entity.endDate = "";
      }
      this.pageParams = Object.assign(this.pageParams, pageInfo);
      page(this.pageParams).then((res) => {
        let tableData = res.data.records;
        this.$set(this, "tableData", tableData);
        this.pageParams.total = res.data.total;
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
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    deletedata(row) {
      let params = {
        id: row.id,
      };
      remove(params).then((res) => {
        this.getTableData();
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
