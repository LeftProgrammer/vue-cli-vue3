<template>
  <div class="page-leave">
    <table-layout
      :page="pageParams"
      title="设计成果列表"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      @query="getTableData"
    >
      <template slot="form">
        <!--查询条件 -->
        <el-row>
          <el-form ref="form" :from="query" label-width="auto">
            <el-col :span="8">
              <el-form-item label="文件编号">
                <el-input v-model="query.code" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="文件名称" class="ml-8">
                <el-input v-model="query.name" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成果类型:" class="ml-8">
                <el-select
                  ref="flowStateRef"
                  v-model="query.resultsType"
                  style="width: 100%"
                  placeholder="请选择"
                  clearable
                  @visible-change="$visibleChange($event, 'el-popper')"
                >
                  <el-option
                    v-for="item in sjcgOptionsList"
                    :key="item.id"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </template>
      <template slot="opratebtns" />
      <template slot="table">
        <!-- highlight-current-row -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          :border="true"
          @current-change="handleCurrent"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="multiple" label="" type="selection" width="55" align="center" />
          <el-table-column
            label="成果类型"
            prop="resultsType"
            align="center"
            excel.dict-type="resultsType"
            excel.sort="3"
            :width="$calculateWidth(110)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="$DictionaryParsing(sjcgOptionsList, row.resultsType)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ $DictionaryParsing(sjcgOptionsList, row.resultsType) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="文件编号" prop="code" align="center" />
          <el-table-column label="文件名称" prop="name" align="center" />
          <el-table-column label="专业" prop="type" align="center">
            <template slot-scope="{ row }">
              <span>{{
                $DictionaryParsing(ditProfession, row.profession)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="工程部位" prop="pbsCode" align="center">
            <template slot-scope="{ row }">
              <bim-show :pbs-code="row.pbsCode" />
            </template>
          </el-table-column>
          <!-- <el-table-column label="版本" prop="version" align="center">
          </el-table-column> -->
          <el-table-column sortable label="供应日期" prop="type" align="center">
            <template slot-scope="{ row }">
              <span> {{ timeFormat(row.createDate, "yyyy-MM-DD") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交底状态" prop="code" align="center">
            <template slot-scope="{ row }"><span>{{
              !row.explainStatus || row.explainStatus == 0
                ? "未交底"
                : "已交底"
            }}</span></template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
  </div>
</template>
<script>
import { page, detailAll } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import TableLayout from "@/components/ContentLayout/Table";
import bimShow from "@/components/Bim/Show";
export default {
  components: { TableLayout, bimShow },
  props: {
    // 多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 表格标题
    title: {
      type: String,
      default: "标题"
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sjcgCodeList: "design_sjcglx",
      sjcgOptionsList: [],
      currentRow: null,
      daterangeDate: "",
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0
      },
      query: {
        name: "",
        code: ""
      },
      designClassify: [],
      ditProfession: [],
      tableData: [],
      ditWenZhong: [],
      chooseId: ""
    };
  },
  created() {
    this.getDESIGNCLASSIFY();
    this.getFlowPROFESSION();
    // this.getDitWWENZHONG(); //文种字典
    // this.toDay();

    // console.log("this.$route.meta,", this.$route);
    // if (this.$route.meta?.pageType == 2) {
    //   this.sjcgCode = "cglx-ydbd";
    //   this.sjcgCodeList = "cglx-ydbd";
    // }
    this.getDictItemList(this.sjcgCodeList);
  },
  mounted() {
    this.getTableData();
    this.init();
  },
  methods: {
    /**获取成果类型字典 */
    async getDictItemList(code, callback) {
      if (code === this.sjcgCodeList) {
        if (!this.sjcgOptionsList || this.sjcgOptionsList.length == 0) {
          let res = await Promise.all([
            getDictItemList("design_sjcglx"),
            getDictItemList("cglx-ydbd")
          ]);
          console.log("获取成果类型字典d", res);
          let allDit = [];
          res.forEach((x) => {
            allDit = allDit.concat(x.data);
          });
          this.sjcgOptionsList = allDit.filter(
            (item) => item.dictCode !== "sjcglx" && item.dictCode !== "sbcglx"
          );
        }
      }
    },
    // 选中事件触发
    handleSelectionChange(val) {
      console.log("选中事件触发", val);
      this.currentRow = val;
    },
    handleSizeChange(val) {
      this.pageParams = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams = val;
      this.getTableData();
    },
    init() {
      this.currentRow = null;
      // 清除所有得选中
      if (this.multiple) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    toDay() {
      let date = new Date().getTime();
      let toDay = dateFormat(date, "yyyy-MM");
      console.log("toDay", toDay);
      this.query.month = toDay;
    },
    handleCurrent(val) {
      console.log("handleCurrent", val);
      // this.$refs.multipleTable.setCurrentRow(val)
      if (!this.multiple) {
        this.currentRow = val;
      }
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM");
    },

    /**重置表格数据 */
    reset() {
      this.query = {};
      this.query.current = 1;
      this.query.pageSize = 20;
      this.daterangeDate = [];
      this.getTableData();
    },
    /**获取分类字典 */
    async getDESIGNCLASSIFY() {
      const { data } = await getDictItemList("DESIGN_CLASSIFY");
      this.designClassify = data;
      // console.log("获取分类字典", data);
    },
    /**获取流程状态字典 */
    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      this.ditProfession = data;
      // console.log("flowStatusOptions", data);
    },
    async getDitWWENZHONG() {
      const { data } = await getDictItemList("wz");
      this.ditWenZhong = data;
    },

    // 查询表格数据
    getTableData() {
      this.tableData = [];
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          beginTime: "",
          endTime: "",
          pageType: this.$route.meta?.pageType || 1
        }
      };
      if (this.$route.meta?.pageType == 1) {
        params.entity.designSupply = {
          ...this.query
        };
      }
      if (this.$route.query?.baseId) {
        params.entity.id = this.$route.query.baseId;
        params.entity.noAuth = "1";
      }
      if (params.entity?.code) {
        // 清理掉前面后面的空格
        params.entity.code = params.entity.code.trim();
        // params.entity.code = params.entity.code.replace(/\s+/g, "");
      }
      if (params.entity?.name) {
        // 清理掉前面后面的空格
        // params.entity.name = params.entity.name.replace(/\s+/g, "");
        params.entity.name = params.entity.name.trim();
      }
      if (this.startTimeAndEndTime?.length > 0) {
        params.entity.beginTime = this.startTimeAndEndTime[0];
        params.entity.endTime = this.startTimeAndEndTime[1];
      }
      params.entity.isOnlyParent = 1;
      console.log("params", params);
      page(params).then((res) => {
        const { data, success } = res;
        if (!success) {
          this.$message.error("列表获取失败");

          return;
        }
        console.log("page", data);
        this.tableData = data.records || [];
        // console.log("列表数据", this.tableData);
        this.pageParams.total = data.total;

        this.$nextTick(() => {
          // this.$refs.multipleTable.doLayout();
          this.$forceUpdate();
        });

        this.$nextTick(() => {
          if (this.$route.query?.baseId) {
            // 先获取文件数据
            let row = this.tableData[0];
            let task =
              row.procMatterTaskDone || row.matterTaskTodo || row.procMatterRun;
            setTimeout(() => this.edit(row, "fine", task), 1000);
          }
        });
      });
    },

    getDetailAll() {
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          flowStatus: 2
        }
      };
      console.log("查询参数", params);
      detailAll(params)
        .then((result) => {
          console.log("res", result);
          if (result.success && result.data.records.length >= 0) {
            const { records, total } = result.data;
            this.tableData = records;
            this.pageParams.total = total;
          } else {
            this.$message.error(result.message);
            this.tableData = [];
          }
        })
        .catch((err) => {
          console.error("detailAll error", err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .table-content {
  .search-form {
    .search-inputform {
      height: auto;
      overflow: visible;
    }

    .search-btns {
      width: auto;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  .table {
    height: calc(100% - 40px);
  }
}
</style>

<!-- <style lang="scss" scoped>
/deep/ .table-cnotent {
  height: 50vh !important;
}

/deep/ .current-row .el-link--inner {
  color: #fff;
}
</style> -->
