<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      title="班前教育会"
      :page="pageParams"
      @query="handleQuery"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
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
          <el-form-item label="班组名称:">
            <el-input
              v-model="pageParams.entity.teamName"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="日期:">
            <el-date-picker
              v-model="pageParams.entity.date"
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
        <!-- <el-button v-if="showExportBtn" @click="handleExport">
          <svg-icon icon-class="export" class="icon" />
          导出
        </el-button> -->
      </template>
      <!-- 数据表格 -->
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          @header-dragend="handleHeaderDragEnd"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="54"
            :selectable="isRowSelectable"
            align="center"
          />
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            fixed="left"
            width="54"
            align="center"
          />
          <el-table-column
            label="班组名称"
            prop="teamName"
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
                {{ row.teamName }}
              </el-link>
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
                {{ getUnitName(row) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="站班会日期"
            prop="educationDate"
            align="center"
            :width="$calculateWidth(120)"
          />
          <el-table-column
            label="班组长"
            prop="teamLeader"
            align="center"
            :width="$calculateWidth(120)"
          />
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
                @delete="deleteHandle"
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
  name: "education",
  mixins: [FlowListMixin],
  components: { TableLayout },
  data() {
    return {
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
      unitOptions: [],
      ids: [],
      fileName: "",
      showExportBtn: false,
    };
  },
  computed: {},
  created() {
    this.getUnitList();
  },
  methods: {
    dateFormat,
    moment,
    isRowSelectable(row) {
      if (row.flowStatus == 2) {
        return Boolean(true);
      } else {
        return Boolean(false);
      }
    },
    handleExport() {
      let data = {
        ids: this.ids,
      };
      exportDoc(data).then((res) => {
        console.log("res", res);
        // 创建一个对象 URL
        const url = window.URL.createObjectURL(res);

        // 创建一个 <a> 标签
        const a = document.createElement("a");
        a.href = url;
        a.download = this.fileName; // 设置下载文件名
        document.body.appendChild(a);

        // 触发点击事件
        a.click();

        // 移除 <a> 标签
        document.body.removeChild(a);

        // 释放对象 URL
        URL.revokeObjectURL(url);
      });
    },
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
      if (this.ids.length > 0) {
        if (this.ids.length == 1) {
          this.fileName = val[0].name.replace(" ", "") + ".docx";
        } else {
          this.fileName = "班前教育会.zip";
        }
        this.showExportBtn = true;
      } else {
        this.showExportBtn = false;
      }
      //在这里调用后端导入接口
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
      let unitInfo = this.unitOptions.find((x) => x.corpId === row.unit);
      if (unitInfo) {
        return unitInfo.corpName;
      } else {
        return "";
      }
    },
    async getUnitList() {
      const { data, success } = await unitAllList();
      if (success) {
        this.unitOptions = data.sort((a, b) => {
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
      if (pageParams.entity.date?.length > 0) {
        pageParams.entity.startDate = pageParams.entity.date[0];
        pageParams.entity.endDate = pageParams.entity.date[1];
        // delete pageParams.entity.date;
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
    deleteHandle(row) {
      remove({ id: row.id }).then((res) => {
        if (res.success) {
          this.$message.success("删除成功");
          this.getTableData();
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>