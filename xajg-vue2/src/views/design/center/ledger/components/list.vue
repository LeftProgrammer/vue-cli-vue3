<template>
  <div style="height: 100%">
    <table-layout
      title="设计供应列表"
      :page="pageParams"
      :page-type="pageType"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      @query="handleQuery"
    >
      <template slot="form">
        <el-form :model="query" :inline="true" label-width="auto">
          <el-form-item :label="type === '1' ? '图纸编号:' : '文件编号:'">
            <el-input v-model="query.code" placeholder="请输入" />
          </el-form-item>
          <el-form-item :label="type === '1' ? '图纸名称:' : '文件名称:'">
            <el-input v-model="query.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item v-if="pageType !== 'DesignApplication'" label="专业:">
            <el-select
              ref="professionRef"
              v-model="query.profession"
              placeholder="请选择专业"
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
          <el-form-item
            v-if="pageType !== 'DesignApplication'"
            label="供图日期:"
          >
            <el-date-picker
              v-model="startTimeAndEndTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
            />
          </el-form-item>
        </el-form>
      </template>
      <template v-if="pageType !== 'DesignApplication'" slot="opratebtns">
        <el-button type="primary" icon="el-icon-upload2" @click="exportHandle">
          导出列表
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
            :label="type === '1' ? '图纸编号' : '文件编号'"
            prop="code"
            header-align="center"
            align="left"
          />
          <el-table-column
            :label="type === '1' ? '图纸名称' : '文件名称'"
            prop="name"
            header-align="center"
            align="left"
          />
          <el-table-column
            label="专业"
            prop="profession"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              <span>
                {{ getDictName(designProfessionOptions, row.profession) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="type === '1'"
            label="最新版本"
            prop="version"
            align="center"
            width="120"
          />
          <el-table-column
            label="工程部位"
            prop="pbsCode"
            align="center"
            width="280"
          >
            <template slot-scope="{ row }">
              <bim-show
                v-if="pageType !== 'DesignApplication'"
                :pbs-code="getPbsCode(row.pbsCode)"
              />
              <el-link
                v-if="pageType === 'DesignApplication'"
                style="color: #409eff"
                @click="relevancyBim(row.pbsCode)"
              >{{ row.pbsName }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="供应日期"
            prop="createDate"
            align="center"
            width="120"
            sortable
          >
            <template slot-scope="{ row }">
              {{
                row.actualDate ? timeFormat(row.actualDate, "YYYY-MM-DD") : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="type === '1' && pageType !== 'DesignApplication'"
            label="图纸分发状态"
            prop="drawingStatus"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              <span
                :class="
                  row.drawingStatus == 1
                    ? 'running'
                    : row.drawingStatus == 2
                      ? 'complete'
                      : 'notStarted'
                "
              >{{ getDataStatus(row.drawingStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="type === '1' && pageType !== 'DesignApplication'"
            label="交底状态"
            prop="explainStatus"
            align="center"
            width="100"
          >
            <template slot-scope="{ row }">
              <span
                :class="
                  row.explainStatus == 1
                    ? 'running'
                    : row.explainStatus == 2
                      ? 'complete'
                      : 'notStarted'
                "
              >{{ getDataStatus(row.explainStatus) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="变更状态"
            prop="changeStatus"
            align="center"
            width="80"
            v-if="type === '1' && pageType !== 'DesignApplication'"
          >
            <template slot-scope="{ row }">
              {{ getDataStatus(row.changeStatus) }}
            </template>
          </el-table-column> -->
          <el-table-column label="操作" prop="name" width="150" align="center">
            <template #default="scope">
              <list-button
                :data="scope.row"
                :index="scope.$index"
                :btns="['view']"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <design-drawing-form
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow && type === '1'"
      :data="oprateRow.data"
      :readonly="true"
      :design-profession-options="designProfessionOptions"
      @closed="oprateRow.dialogShow = false"
    />
    <design-report-form
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow && type === '2'"
      :data="oprateRow.data"
      :readonly="true"
      :design-profession-options="designProfessionOptions"
      @closed="oprateRow.dialogShow = false"
    />
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import DesignDrawingForm from "./designDrawingForm.vue";
import DesignReportForm from "./designReportForm.vue";
import { page } from "../api";
import { ListMixin } from "@/mixins/ListMixin";
import ListButton from "@/components/ListButton";
import BimShow from "@/components/Bim/Show/index";
export default {
  name: "DesignCenterLedgerList",
  components: {
    TableLayout,
    DesignDrawingForm,
    DesignReportForm,
    ListButton,
    BimShow,
  },
  mixins: [ListMixin],
  props: {
    /**供应类型1/2/3  设计图纸/设计报告/科研报告 */
    type: {
      type: String,
      default: "1",
    },
    /**页面类型 设计应用：DesignApplication */
    pageType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      /**查询条件 */
      query: {},
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      /**设计专业 */
      designProfessionOptions: [],
      /**列表数据 */
      tableData: [],
      /**设计图纸供应台账弹窗显示 */
      designDrawingVisible: false,
      //设计图纸数据
      formData: {},
      startTimeAndEndTime: [],
    };
  },
  created() {
    this.getDictItemList(this.designProfessionCode);
  },
  methods: {
    getPbsCode(val) {
      let text = "*";
      console.log("getPbsName", val);
      let a = val?.split("&&&")[0];
      if (a) {
        text = a;
      }
      return text;
    },
    /**导出功能 */
    exportHandle() {
      this.$message("功能开发中...");
    },
    /**获取数据状态 */
    getDataStatus(status) {
      if (status == 1) {
        return "进行中";
      }
      if (status == 2) {
        return "完成";
      }
      return "未开始";
    },
    /**获取专业 */
    getDictName(options, code) {
      if (options && options.length > 0) {
        let option = options.find((x) => x.dictCode === code);
        if (option) {
          return option.dictName;
        }
      }
      return "";
    },
    /**重置表格数据 */
    reset(page) {
      this.query = {};
      this.pageParams.current = page.current;
      this.pageParams.pageSize = page.pageSize;
      this.startTimeAndEndTime = [];
      this.getTableData();
    },
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    // 查询表格数据
    getTableData(pageParams, pbsCode) {
      this.query.pbsCode = pbsCode;
      this.tableData = [];
      this.query.type = this.type;
      this.pageParams.entity = this.query;
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.startDate = this.startTimeAndEndTime[0];
        this.pageParams.entity.endDate = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.startDate = "";
        this.pageParams.entity.endDate = "";
      }
      page(this.pageParams).then((res) => {
        if (res.success) {
          let tableData = res.data.records;

          // let pbsCode = "DLD-1-SY-1-(0-135)-KW-1";
          // tableData[0].pbsCode = pbsCode;
          // tableData[1].pbsCode = pbsCode;

          this.tableData = tableData;
          this.pageParams.total = res.data.total;
        }
      });
    },
    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.designClassifyCode) {
        if (
          !this.designClassifyOptions ||
          this.designClassifyOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.designClassifyOptions = items;
            callback && callback();
          });
        } else {
          callback && callback();
        }
      }

      if (code === this.designProfessionCode) {
        if (
          !this.designProfessionOptions ||
          this.designProfessionOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.designProfessionOptions = items;
          });
        }
      }
    },
    /**设计应用-关联bim模型*/
    relevancyBim(pbsCode) {
      this.$emit("relevancyBim", pbsCode);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .list-button-container .el-divider {
  display: none;
}
.running {
  color: #f53f3f;
}
.complete {
  color: #1298fa;
}
.notStarted {
  color: #ff7d00;
}
</style>
