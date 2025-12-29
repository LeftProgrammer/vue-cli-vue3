<template>
  <div class="page-leave achievement-components">
    <treeTableLayout
      :page="pageParams"
      :title="title"
      @query="handleQuery"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      :showExportBtn="false"
      @initExportParams="initExportParams"
    >
      <template slot="form">
        <el-form ref="form" :model="query" :inline="true" label-width="auto">
          <el-form-item label="文件名称" size="mini">
            <el-input
              v-model="query.name"
              placeholder="请输入名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          v-if="showTable"
          :row-key="(row) => row.id"
          @header-dragend="handleHeaderDragEnd"
          @selection-change="handleSlectCurrentChange"
        >
          <el-table-column
            label="序号"
            type="index"
            :width="$calculateWidth(60)"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            label="文件类型"
            header-align="center"
            prop="title"
            align="left"
            excel.sort="2"
            width="200"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.name" placement="top" effect="dark">
                <div class="text-ellipsis-clamp">
                  {{ $DictionaryParsing(sjcgOptionsList, row.resultsType) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="文件名称"
            header-align="center"
            prop="title"
            align="left"
            width="auto"
            excel.sort="2"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.name" placement="top" effect="dark">
                <div class="text-ellipsis-clamp">
                  {{ row.name || row.designSupply.name }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="专业"
            prop="profession"
            align="center"
            excel.dictType="DESIGN_PROFESSION"
            excel.targetAttr="designSupply.profession"
            excel.sort="4"
            width="150"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="
                  $DictionaryParsing(
                    designProfessionOptions,
                    row.profession || row.designSupply.profession
                  )
                "
                placement="top"
                effect="dark"
              >
                <span>{{
                  $DictionaryParsing(
                    designProfessionOptions,
                    row.profession || row.designSupply.profession
                  )
                }}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            label="工程部位"
            :width="$calculateWidth(250)"
            prop="pbsCode"
            align="center"
            excel.handler="excelHandleCovert"
            excel.args="pbs"
            excel.sort="6"
          >
            <template slot-scope="{ row }">
              <bim-show
                :pbsCode="row.pbsCode || row.designSupply.pbsCode"
              ></bim-show>
            </template>
          </el-table-column>
          <el-table-column
            label="供应日期"
            width="150"
            prop="actualDate"
            align="center"
            sortable
            excel.dateFormat="yyyy-MM-dd"
            excel.sort="5"
          >
            <template slot-scope="{ row }">
              {{
                row.actualDate ? timeFormat(row.actualDate, "yyyy-MM-DD") : ""
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template #default="{ row }">
              <div>
                <flow-button
                  :row="row"
                  :flowName="flowName"
                  :btns="['view']"
                  @click="handelShowDialog"
                ></flow-button>
                <!-- <el-link type="primary" plain @click="viewHandle(row)"> 查看 </el-link> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </treeTableLayout>
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    ></flow-dialog>
  </div>
</template>

<script>
import treeTableLayout from "@/components/ContentLayout/TreeTable";
import {
  page,
  del,
  sectionList
} from "@/views/design/availabilityofResults/api";
import { getDictItemList, getDictItemTree } from "@/api/dict";
import { dateFormat } from "@/utils";
import enums from "@/config/enums";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import bimShow from "@/components/Bim/Show";
export default {
  components: { treeTableLayout, bimShow },
  mixins: [FlowListMixin],
  props: {
    /**水电标段还是营地标段，默认水电标段 */
    pageType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      multiple: true, //默认为多选
      showTable: false,
      fromPage: "", //当作为组件的时候会用到
      sectionOptions: [],
      flowStatusOptions: [],
      formData: {
        createDate: ""
      },
      startTimeAndEndTime: [],
      designProfessionCode: "DESIGN_PROFESSION",
      designProfessionOptions: [],
      pageParams: {
        size: 20,
        current: 1,
        total: 0
      },
      tableData: [],
      query: {},
      flowShow: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "dictName"
      },
      wzCode: "wz",
      wzCodeOptions: [],

      sjcgCode: "design_sjcglx",
      sjcgOptions: [],

      sjcgCodeList: "design_sjcglx",
      sjcgOptionsList: [],

      title: "成果供应列表",
      signStatusOptions: [
        {
          label: "待签收",
          value: 0
        },
        {
          label: "部分签收",
          value: 1
        },
        {
          label: "已签收",
          value: 2
        },
        {
          label: "已拒签",
          value: 3
        },
        {
          label: "已退回",
          value: 4
        },
        {
          label: "已完成",
          value: 5
        }
      ],
      currentRow: [] //被选中行
    };
  },
  computed: {
    exportParams() {
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          startDate: this.startTimeAndEndTime?.[0] || "",
          endDate: this.startTimeAndEndTime?.[1] || ""
        }
      };
      return params;
    }
  },
  created() {
    this.getSectionList();
    this.getTableData();
    this.getDictItemList(this.designProfessionCode);
    this.getDictItemList(this.wzCode);
    if (this.pageType == 2) {
      this.sjcgCode = "cglx-ydbd";
      this.sjcgCodeList = "cglx-ydbd";
    }
    this.getDictItemList(this.sjcgCodeList);
    this.getDictItemList(this.sjcgCode);
  },
  mounted() {},
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    //查看数据
    viewHandle(row) {
      console.log("viewHandle", row);
    },
    // 单选
    handleCurrent(val) {
      if (this.multiple) {
        return;
      }
      console.log("单选", val);
      this.currentRow = val;
    },
    customRequest() {
      this.getTableData();
    },
    handleSlectCurrentChange(val, old) {
      console.log("handleCurrentChange", val);
      // 清理所有的校验
      this.currentRow = val;
    },
    add() {
      // 存下当前的类型
      if (this.query.resultsType) {
        this.$setStorage("resultsType", this.query.resultsType);
      } else {
        this.$clearStorage("resultsType");
      }
      this.handelShowDialog(null, "mine");
    },
    edit(row, status, task, type) {
      console.log("type", type);
      // if (row.resultsType && status == "fine") {
      //   this.$setStorage("resultsType", row.resultsType);
      // } else {
      //   this.$clearStorage("resultsType");
      //   this.$message.warning("历史数据待处理");
      //   return;
      // }
      this.$clearStorage("resultsType");
      this.handelShowDialog(row, status, task);
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        console.log("获取标段", res);
        if (res.success) {
          this.sectionOptions = res.data;
        }
      });
    },
    // 查询表格数据
    getTableData(pageInfo, pbsCode) {
      this.showTable = false;
      this.tableData = [];
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          flowStatus: 2,
          beginTime: "",
          endTime: "",
          pageType: this.pageType || 1,
          pbsCode: pbsCode
        }
      };
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
      params = Object.assign(params, pageInfo);
      console.log("params", params);
      page(params).then((res) => {
        const { data, success } = res;
        if (!success) {
          this.$message.error("列表获取失败");
          this.showTable = true;
          return;
        }
        // console.log("page", data);
        this.tableData = data.records || [];
        // console.log("列表数据", this.tableData);
        this.pageParams.total = data.total;

        this.$nextTick(() => {
          // this.$refs.multipleTable.doLayout();
          this.$forceUpdate();
        });
        this.showTable = true;
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

    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/synthesis/manage/export";
      exportParams.filename = this.title;
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
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

    handleSizeChange(val) {
      console.log("aaa", val);
      this.pageParams = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log("aaa", val);
      this.pageParams = val;
      this.getTableData();
    },

    arrayToTree(arr, idProp, parentIdProp) {
      const map = {};
      const result = [];

      arr.forEach((item) => {
        map[item[idProp]] = { ...item, children: [] };
      });

      arr.forEach((item) => {
        if (item[parentIdProp] && map[item[parentIdProp]]) {
          map[item[parentIdProp]].children.push(map[item[idProp]]);
        } else {
          result.push(map[item[idProp]]);
        }
      });

      return result;
    },

    handleNodeClick(data) {
      console.log("点击树节点", data);
      this.query.resultsType = data.dictCode;
      if (data.pid == "-") {
        this.query.resultsType = "";
      }
      console.log("*******", this.query.resultsType);
      this.getTableData();
    },
    getText(options, value) {
      let text = "";
      let a = options.find((item) => item.id == value);
      if (a) {
        text = a.name;
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
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = [];
      this.getTableData();
    },
    deletedata(row) {
      console.log("----------", row.id);
      if (
        (row.createUser == this.$getStorage("userInfo").userId) || this.isSystem
      ) {
        del({ id: row.id }).then((res) => {
          if (!res.success) {
            return this.$message.error("删除失败：" + res.message);
          }
          this.$message.success("删除成功");
          this.getTableData();
        });
        // remove(params).then((res) => {
        //   if (!res.success) {
        //     return this.$message.error("删除失败：" + res.message);
        //   }
        //   this.$message.success("删除成功");
        // });
      } else {
        this.$message.error("您没有删除权限");
      }
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
      if (code === this.wzCode) {
        if (!this.wzCodeOptions || this.wzCodeOptions.length == 0) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.wzCodeOptions = res.data;
            }
          });
        } else {
        }
      }
      if (code === this.sjcgCodeList) {
        if (!this.sjcgOptionsList || this.sjcgOptionsList.length == 0) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              console.log("sjcgOptionsList", res.data);
              this.sjcgOptionsList = res?.data.filter(
                (item) =>
                  item.dictCode !== "sjcglx" && item.dictCode !== "sbcglx"
              );
            }
          });
        } else {
        }
      }
      if (code === this.sjcgCode) {
        if (!this.sjcgOptions || this.sjcgOptions.length == 0) {
          getDictItemTree(code).then((res) => {
            if (res.success) {
              this.sjcgOptions = res.data;
            }
          });
        } else {
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
}

.achievement-components /deep/.table-content > .el-row .divider {
  display: none;
}

.achievement-components /deep/.table-content > .el-row .search-form {
  height: 50px;
}

.achievement-components /deep/.table-content .el-form .el-form-item {
  margin-bottom: 0px !important;
}

.achievement-components /deep/.el-table__header-wrapper .el-table td,
.el-table th {
  padding: 10px 0px;
}

/deep/ .el-range-editor--mini.el-input__inner {
  height: inherit !important;
}

/deep/ .el-date-editor .el-range-separator {
  line-height: 32px !important;
}

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}

/deep/ button.el-button.el-button--medium {
  // background-color: #0096ff;
  min-width: auto;
}

/deep/ .table-content .table .table-cnotent .el-table .el-table__body-wrapper {
  height: calc(100% - 54px) !important;
}

// 这里 是由于列表选中的时候 会触发校验 很奇怪！！
/deep/ .el-input__inner {
  border-color: #dcdfe6 !important;
}
</style>
