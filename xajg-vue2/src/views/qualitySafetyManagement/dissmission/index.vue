<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      title="质量消缺"
      :page="pageParams"
      @query="handleQuery"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item label="缺陷名称:" size="mini">
            <el-input v-model="pageParams.entity.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="工程部位:" size="mini">
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
          <el-form-item label="上报日期:" size="mini">
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
            label="质量缺陷名称"
            prop="pbsName"
            header-align="center"
            align="left"
            :min-width="$calculateWidth(190)"
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
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="工程部位"
            prop="pbsName"
            align="left"
            :min-width="$calculateWidth(200)"
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
            label="整改期限"
            prop="resolveDate"
            align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              {{ dateFormat(row.resolveDate, "YYYY-MM-DD") }}
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
                  moment(row.resolveDate).isSameOrAfter(
                    moment(new Date()),
                    'day'
                  )
                    ? ''
                    : 'danger'
                "
              >{{
                moment(row.resolveDate).isSameOrAfter(
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
            label="消缺上报人"
            prop="defectReporterName"
            align="center"
            :width="$calculateWidth(120)"
          />
          <el-table-column
            label="流程状态"
            prop="flowStatus"
            header-align="center"
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
import { page, remove } from "./api";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import bimShow from "@/components/Bim/Show";
import { dateFormat } from "@/utils";
import enums from "@/config/enums";
import moment from "moment";
import { getSectionByCorpId } from "@/api/measure";

export default {
  name: "Dissmission",
  components: { TableLayout, bimShow },
  mixins: [FlowListMixin],
  data() {
    return {
      sectionOptions: [],
      startTimeAndEndTime: [],
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
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
      tableData: [],
    };
  },
  created() {
    this.getFlowStatus();
    this.getCurrent();
  },
  methods: {
    dateFormat,
    moment,
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
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
    edit(row, status, task, type) {
      this.handelShowDialog(row, status, task);
    },
    reset() {
      this.startTimeAndEndTime = [];
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
      this.getTableData();
    },
    getTableData(pageInfo) {
      const pageParams = Object.assign(this.pageParams, pageInfo);
      if (this.startTimeAndEndTime?.length == 2) {
        pageParams.entity.startCreateDate = this.startTimeAndEndTime[0];
        pageParams.entity.endCreateDate = this.startTimeAndEndTime[1];
        delete pageParams.createDate;
      }
      page(pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        }
      });
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
    } /**获取流程状态字典 */,
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
  },
};
</script>

<style scoped lang="scss"></style>
