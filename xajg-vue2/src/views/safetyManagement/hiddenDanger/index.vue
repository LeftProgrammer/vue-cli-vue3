<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      title="隐患排查"
      :page="pageParams"
      @query="getTableData"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item label="隐患名称:">
            <el-input
              v-model="pageParams.entity.hiddenDangerName"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="工程部位:">
            <pbs-select
              v-model="pageParams.entity.pbsCode"
              style="height: 100%"
            />
          </el-form-item>
          <el-form-item label="所属标段:" size="mini" prop="sectionId">
            <el-select
              v-model="pageParams.entity.sectionId"
              class="w-100pre"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in sectionOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="隐患级别:">
            <el-select
              v-model="pageParams.entity.hiddenDangerLevel"
              :disabled="readonly"
              class="w-100pre"
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in yhjbList"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="上报日期:">
            <el-date-picker
              v-model="pageParams.entity.createData"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-form>
      </template>
      <!-- 新增按钮 -->
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelShowDialog(null, 'mine')"
        >
          新增
        </el-button>
      </template>
      <!-- 数据表格 -->
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          @header-dragend="handleHeaderDragEnd"
        >
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            fixed="left"
            width="54"
            align="center"
          />
          <el-table-column
            label="隐患名称"
            prop="hiddenDangerName"
            :min-width="$calculateWidth(180)"
            fixed="left"
          >
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                @click="
                  handelShowDialog(
                    row,
                    'fine',
                    row.procMatterTaskDone ||
                      row.matterTaskTodo ||
                      row.procMatterRun,
                    'view'
                  )
                "
              >
                {{ row.hiddenDangerName }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
            label="工程部位"
            prop="pbsName"
            :width="$calculateWidth(180)"
          >
            <template slot-scope="{ row }">
              <bimShow :pbs-code="row.pbsCode" />
            </template>
          </el-table-column>
          <el-table-column
            label="所属标段"
            prop="sectionId"
            excel.handler="excelHandleCovert"
            excel.args="section"
            align="center"
            width="180"
          >
            <template slot-scope="{ row }">
              <div class="text-ellipsis">
                {{ getText(sectionOptions, getCodeName(row, "sectionId")) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="隐患级别"
            prop="hiddenDangerLevel"
            align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              {{ $DictionaryParsing(yhjbList, row.hiddenDangerLevel) }}
            </template>
          </el-table-column>

          <el-table-column
            label="隐患分类"
            prop="hiddenDangerCategory"
            align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              {{ $DictionaryParsing(yhflList, row.hiddenDangerCategory) }}
            </template>
          </el-table-column>

          <el-table-column
            label="整改期限"
            prop="rectifyDate"
            align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              {{ dateFormat(row.rectifyDate, "YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column
            label="逾期情况"
            prop="overdueState"
            align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              <el-tag
                :type="
                  moment(row.rectifyDate).isSameOrAfter(
                    moment(new Date()),
                    'day'
                  )
                    ? ''
                    : 'danger'
                "
              >{{
                moment(row.rectifyDate).isSameOrAfter(
                  moment(new Date()),
                  "day"
                )
                  ? "未逾期"
                  : "已逾期"
              }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="隐患上报人"
            prop="hiddenDangerReportorFullname"
            align="center"
            :width="$calculateWidth(120)"
          />
          <el-table-column
            label="当前节点"
            prop="flowName"
            align="center"
            :width="$calculateWidth(180)"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.flowName" placement="top" effect="dark">
                <div class="text-ellipsis-clamp">{{ row.flowName }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="流程状态"
            prop="flowStatus"
            align="center"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="scope">
              <flow-status
                :row="scope.row"
                :flow-name="scope.row.flowName"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="上报日期"
            prop="signStatus"
            align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              {{ dateFormat(row.createDate, "YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template #default="{ row }">
              <flow-button
                :row="row"
                :flow-name="row.flowName"
                @click="handelShowDialog"
                @delete="deletedata"
              />
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
import { page, remove, unitList } from "./api";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import enums from "@/config/enums";
import { getDictItemList } from "@/api/dict";
import bimShow from "@/components/Bim/Show";
import { dateFormat } from "@/utils";
import moment from "moment";
import { getSectionByCorpId } from "@/api/measure";

export default {
  name: "HiddenDanger",
  components: { TableLayout, bimShow },
  mixins: [FlowListMixin],
  data() {
    return {
      sectionOptions: [],
      unitOptions: [],
      pageParams: {
        orderProperties: [
          {
            property: "createDate",
            asc: false,
          },
        ],
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
        entity: {
          params: {},
        },
      },
      tableData: [],
      startTimeAndEndTime: [],
      /**流程状态 */
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
      yhjbList: [], //隐患级别
      yhflList: [], //隐患分类
    };
  },
  computed: {
    exportParams() {
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.params.beginCreateDate =
          this.startTimeAndEndTime[0];
        this.pageParams.entity.params.endCreateDate =
          this.startTimeAndEndTime[1];
      }
      return this.pageParams;
    },
  },
  created() {
    this.getUnitList(); //获取所有的单位
    this.getFlowStatus();
    this.getDictItemList();
    this.getCurrent();
  },
  methods: {
    dateFormat,
    moment,
    getCodeName(row, type) {
      let name = row[type] || row.designSupply?.[type] || "";
      return name;
    },
    getText(options, value) {
      let a = [];
      if (value) {
        value = value.split(",");
        a = value.map((x) => {
          let item = options.find((y) => y.id == x);
          if (item) {
            return item.name;
          }
        });
      }
      return a.toString();
    },
    async getCurrent() {
      console.log("this.currentSection", this.$getStorage("userInfo"));
      this.current = this.$getStorage("userInfo");
      console.log("获取当前登陆人的单位", this.current);
      await this.getSectionList(this.current.corpId);
      if (this.sectionOptions.length === 0) {
        this.$message.error("查询标段失败");
      }
    },
    /**获取施工标段 */
    async getSectionList(corporateId) {
      try {
        const { data, success, message } = await getSectionByCorpId({
          corpId: corporateId,
        });

        if (!success) {
          this.$message.error("查询标段失败：" + message);
          return false;
        }
        this.sectionOptions = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询标段失败");
        return false;
      }
    },
    /**获取字典 */
    async getDictItemList() {
      const hiddenDangerCategory = await getDictItemList("yhfl");
      const hiddenDangerLevel = await getDictItemList("yhjb");
      this.yhflList = hiddenDangerCategory.data;
      this.yhjbList = hiddenDangerLevel.data;
    },
    handleExportDetail() {
      let columns = [];
      columns.push({
        label: "申请单位",
        prop: "unit",
        handler: "excelHandleCovert",
        args: "unit",
      });
      columns.push({ label: "合同名称", prop: "name" });
      columns.push({ label: "合同编号", prop: "code" });
      columns.push({ label: "工程建设资金调拨申请编码", prop: "applyCode" });
      columns.push({ label: "收款单位", prop: "collectingUnit" });
      columns.push({ label: "付款内容", prop: "paymentContent" });
      columns.push({ label: "金额（元）", prop: "amount" });
      columns.push({
        label: "发起日期",
        prop: "createDate",
        dateFormat: "yyyy-MM-dd HH:mm:ss",
      });
      columns.push({
        label: "完成时间",
        prop: "flowFinishTime",
        dateFormat: "yyyy-MM-dd HH:mm:ss",
      });
      let exportParams = {
        url: "",
        params: {},
        filename: "列表",
        columns: columns,
      };
      this.initExportParams(exportParams);
      exportParams.params.entity.exportType = "1";
      exportParams.filename = "资金调拨明细表";
      console.log("handleExport", exportParams);
      // return;

      this.$handleExport(
        exportParams.url,
        exportParams.params,
        exportParams.filename
      );
    },
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/schedule/fund/info/export";
      exportParams.filename = "资金调拨";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
      exportParams.params.entity.exportType = "0";
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current; //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize; //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
    },
    getUnitName(row) {
      // let name = row?.procMatterRun?.createUserCorpName || "";
      // return name;
      let unitInfo = this.unitOptions.find((x) => x.corpId === row.unit);
      if (unitInfo) {
        return unitInfo.corpName;
      } else {
        return "";
      }
    },
    async getUnitList() {
      const { data, success } = await unitList();
      if (success) {
        this.unitOptions = data
          .filter((item) => {
            return item.corpLeaf !== 0;
          })
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
        console.log("获取单位", this.unitOptions);
      }
    },
    reset() {
      this.pageParams = {
        orderProperties: [
          {
            property: "createDate",
            asc: false,
          },
        ],
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
        entity: {
          params: {},
        },
      };
      this.startTimeAndEndTime = [];
      this.getTableData();
    },
    getTableData(pageInfo) {
      const pageParams = Object.assign(this.pageParams, pageInfo);
      if (pageParams.entity.createData?.length > 0) {
        pageParams.entity.startCreateDate = pageParams.entity.createData[0];
        pageParams.entity.endCreateDate = pageParams.entity.createData[1];
        delete pageParams.createData;
      }
      page(pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          console.log("pageParams", this.pageParams, res);
          this.pageParams.total = res.data.total;
        }
      });
    },
    /**获取流程状态字典 */
    getFlowStatus() {
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
    },
    deletedata(row) {
      console.log(row);
      if (!row.id) {
        return;
      }
      remove({
        id: row.id,
      }).then((res) => {
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

<style scoped lang="scss"></style>
