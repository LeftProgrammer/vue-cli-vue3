<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      title="设备进退场"
      :page="pageParams"
      @query="getTableData"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item label="设备名称:">
            <el-input
              v-model="pageParams.entity.equipNames"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="设备编号:">
            <el-input
              v-model="pageParams.entity.equipCodes"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="所属单位:">
            <el-select v-model="pageParams.entity.unit">
              <el-option
                v-for="item in unitOptions"
                :key="item.corpId"
                :label="item.corpName"
                :value="item.corpId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="进退场类型:">
            <el-select
              v-model="pageParams.entity.isOut"
              class="w-100pre"
              :disabled="readonly"
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option label="进场" :value="1" />
              <el-option label="退场" :value="2" />
            </el-select>
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
            width="54"
            align="center"
          />
          <el-table-column
            label="设备名称"
            prop="equipNames"
            align="left"
            :min-width="$calculateWidth(180)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.equipNames"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">{{ row.equipNames }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="设备编号"
            prop="equipCodes"
            align="left"
            :min-width="$calculateWidth(180)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.equipCodes"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">{{ row.equipCodes }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="所属单位"
            prop="unit"
            align="left"
            :width="$calculateWidth(180)"
          >
            <template slot-scope="{ row }">
              <div class="text-ellipsis">
                {{ getUnitNameById(row.unit) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="进退场类型"
            prop="isOut"
            :width="$calculateWidth(100)"
            align="center"
          >
            <template slot-scope="{ row }">
              <span :style="{ color: row.isOut == 1 ? '#00B42A' : '#F53F3F' }">
                {{ row.isOut == 1 ? "进场" : "退场" }}
              </span>
            </template>
          </el-table-column>
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
                :flowName="scope.row.flowName"
              ></flow-status>
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
                :flowName="row.flowName"
                @click="handelShowDialog"
                @delete="deletedata"
                :btns="[
                  { title: '查看', method: 'view' },
                  { title: '办理', method: 'deal' },
                  { title: '催办', method: 'press' },
                  { title: '删除', method: 'delete' },
                ]"
              ></flow-button>
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
import { page, remove, unitAllList } from "./api";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import enums from "@/config/enums";
import { dateFormat } from "@/utils";
import moment from "moment";

export default {
  name: "safeStaffEntryExit",
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
        entity: {},
      },
      tableData: [],
      /**流程状态 */
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
    };
  },
  computed: {
    getUnitNameById() {
      return (id) => {
        return this.unitOptions?.find((item) => item.corpId == id)?.corpName;
      };
    },
  },
  created() {
    this.getUnitList(); //获取所有的单位
    this.getFlowStatus();
  },
  methods: {
    dateFormat,
    moment,

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
    async getUnitList() {
      const { data, success } = await unitAllList();
      if (success) {
        this.unitOptions = data
          .filter((x) => x.corpPid)
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
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
        entity: {},
      };
      this.getTableData();
    },
    getTableData(pageInfo) {
      const pageParams = Object.assign(this.pageParams, pageInfo);
      page(pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
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
