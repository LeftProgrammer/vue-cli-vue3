<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      title="资金调拨"
      :page="pageParams"
      :show-export-btn="true"
      @query="handleQuery"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @initExportParams="initExportParams"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item label="申请单位:" size="mini">
            <el-select
              v-model="pageParams.entity.unit"
              class="w-100pre"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in unitOptions"
                :key="item.corpId"
                :label="item.corpName"
                :value="item.corpId"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="流程状态:" size="mini">
            <el-select
              ref="flowStateRef"
              v-model="pageParams.entity.flowStatus"
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
      <!-- 新增按钮 -->
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelShowDialog(null, 'mine')"
        >
          新增
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-upload2"
          @click="handleExportDetail()"
        >
          导出明细表
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
            :width="$calculateWidth(80)"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            label="合同名称"
            prop="name"
            header-align="center"
            align="left"
            :min-width="$calculateWidth(230)"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.name" placement="top" effect="dark">
                <div class="text-ellipsis-clamp">{{ row.name }}</div>
              </el-tooltip>
            </template></el-table-column>
          <el-table-column
            label="合同编号"
            prop="code"
            header-align="center"
            align="left"
            :width="$calculateWidth(200)"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.code" placement="top" effect="dark">
                <div class="text-ellipsis-clamp">{{ row.code }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="金额（元）"
            prop="total"
            header-align="center"
            align="left"
            :width="$calculateWidth(215)"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.total" placement="top" effect="dark">
                <div class="text-ellipsis-clamp">{{ row.total }}</div>
              </el-tooltip></template></el-table-column>
          <el-table-column
            label="发起日期"
            prop="createDate"
            align="center"
            :width="$calculateWidth(180)"
            excel.dateFormat="yyyy-MM-dd HH:mm:ss"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.createDate ? timeFormat(row.createDate) : ''"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ row.createDate ? timeFormat(row.createDate) : "" }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            label="发起人"
            prop="createUsername"
            header-align="center"
            align="left"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.createUsername"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">{{ row.createUsername }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="申请单位"
            prop="unit"
            header-align="center"
            align="left"
            :width="$calculateWidth(200)"
            excel.handler="excelHandleCovert"
            excel.args="unit"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getUnitName(row)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">{{ getUnitName(row) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="当前节点"
            prop="flowName"
            header-align="center"
            align="left"
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
            header-align="center"
            align="left"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
            :width="$calculateWidth(80)"
          >
            <template slot-scope="scope">
              <flow-status
                :row="scope.row"
                :flow-name="scope.row.flowName"
              />
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

export default {
  name: "FundAllocation",
  components: { TableLayout },
  mixins: [FlowListMixin],
  data() {
    return {
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
  },
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    handleExportDetail() {
      let columns = [];
      columns.push({ label: '申请单位', prop: 'unit', handler: 'excelHandleCovert', args: 'unit' });
      columns.push({ label: '合同名称', prop: 'name' });
      columns.push({ label: '合同编号', prop: 'code' });
      columns.push({ label: '工程建设资金调拨申请编码', prop: 'applyCode' });
      columns.push({ label: '收款单位', prop: 'collectingUnit' });
      columns.push({ label: '付款内容', prop: 'paymentContent' });
      columns.push({ label: '金额（元）', prop: 'amount' });
      columns.push({ label: '发起日期', prop: 'createDate', dateFormat: 'yyyy-MM-dd HH:mm:ss' });
      columns.push({ label: '完成时间', prop: 'flowFinishTime', dateFormat: 'yyyy-MM-dd HH:mm:ss' });
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
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.params.beginCreateDate =
          this.startTimeAndEndTime[0];
        this.pageParams.entity.params.endCreateDate =
          this.startTimeAndEndTime[1];
      }
      this.pageParams = Object.assign(this.pageParams, pageInfo);
      page(this.pageParams).then((res) => {
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
      // console.log("flowStatusOptions", data);
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
