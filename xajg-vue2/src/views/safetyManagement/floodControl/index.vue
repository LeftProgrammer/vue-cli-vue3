<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      title="防汛值班记录"
      :page="pageParams"
      @query="handleQuery"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item label="日期范围:">
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
        <el-button v-if="showExportBtn" @click="handleExport">
          <svg-icon icon-class="export" class="icon" />
          导出
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
            label="文件名称"
            prop="name"
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
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="发起人"
            prop="createUsername"
            align="center"
            :width="$calculateWidth(120)"
          />
          <el-table-column
            label="日期"
            prop="startTime"
            align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              {{ row.startTime.slice(0, 10) }}
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
              <flow-status :row="scope.row" :flow-name="scope.row.flowName" />
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
                @delete="deleteHandle"
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
import { page, remove, exportDoc } from "./api";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import enums from "@/config/enums";
import { dateFormat } from "@/utils";
import moment from "moment";
export default {
  name: "FloodControl",
  components: { TableLayout },
  mixins: [FlowListMixin],
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
      ids: [],
      fileName: "",
      showExportBtn: false,
    };
  },
  computed: {},
  created() {},
  methods: {
    dateFormat,
    moment,
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
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
          this.fileName = "防汛值班记录.zip";
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
        pageParams.entity.startTime = pageParams.entity.date[0] + " 00:00:00";
        pageParams.entity.endTime = pageParams.entity.date[1] + " 23:59:59";
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
