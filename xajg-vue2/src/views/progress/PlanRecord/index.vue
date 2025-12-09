<template>
  <div class="page-leave">
    <treeTableLayout
      :page="pageParams"
      :title="title"
      :showSearchBtns="false"
      @query="getTableData"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      :showExportBtn="showExportBtn"
      @initExportParams="initExportParams"
    >
      <template slot="opratebtns">&nbsp;</template>
      <template slot="form">
        <el-button
          type="primary"
          :plain="planType !== 2"
          @click="
            planType = 2;
            reset();
            getTableData();
          "
          >月度计划
        </el-button>
        <el-button
          type="primary"
          :plain="planType !== 1"
          @click="
            planType = 1;
            reset();
            getTableData();
          "
          >年度计划
        </el-button>
        <el-button
          type="primary"
          :plain="planType !== 3"
          @click="
            planType = 3;
            reset();
            getTableData();
          "
          >总计划
        </el-button>
        <el-button
          type="primary"
          :plain="planType !== 0"
          @click="
            planType = 0;
            reset();
            getTableData();
          "
          >全部
        </el-button>
      </template>

      <template slot="tree">
        <el-tree
          ref="tree"
          node-key="id"
          default-expand-all
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          highlight-current
        ></el-tree>
      </template>
      <!-- v-if="flowInited || rows.length === 0" -->
      <template slot="table">
        <!-- v-if="flowInited" -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          :highlight-current-row="pageType == 'supervisionSendDoc'"
          @current-change="chooseCurrentRow"
        >
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            label="施工标段"
            header-align="center"
            prop="sectionId"
            align="left"
            width="auto"
            min-width="12%"
            excel.handler="excelHandleCovert"
            excel.args="section"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getSelectText(sectionOptions, row.sectionId)"
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis-clamp">
                  {{ getSelectText(sectionOptions, row.sectionId) }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="计划类型"
            header-align="center"
            prop="type"
            align="left"
            width="auto"
            min-width="12%"
            excel.readConverterExp="1=年度计划,2=月度计划,3=总计划"
          >
            <template slot-scope="scope">
              <span>{{ $DictionaryParsing(typeOptions, scope.row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="年度/月度"
            prop="year"
            align="center"
            width="auto"
            min-width="5%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.year ? scope.row.year : "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="版本"
            prop="version"
            align="center"
            width="auto"
            min-width="5%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.version ? scope.row.version : "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="计划名称"
            prop="name"
            align="center"
            width="auto"
            min-width="10%"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.name" placement="top" effect="dark">
                <span class="text-ellipsis-clamp">
                  {{ row.name }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            v-if="pageType == 'PlanRecord'"
            label="操作"
            prop=""
            align="left"
            width="200"
            min-width="10%"
          >
            <template #default="{ row }">
              <div class="">
                <el-button type="text" @click="details(row, 'view')"
                  >查看
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </treeTableLayout>
    <dataform ref="dataform" />
  </div>
</template>

<script>
import treeTableLayout from "@/components/ContentLayout/TreeTable";
import dataform from "./dataform.vue";
import { page, sectionList } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";

export default {
  components: { treeTableLayout, dataform },
  mixins: [ListMixin],
  props: {
    pageType: {
      type: String,
      default: "PlanRecord"
    },
    showExportBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      planType: 2, //1年度2月度3总计划0全部
      formData: {
        createDate: ""
      },
      dialogShow: false,
      startTimeAndEndTime: [],
      designProfessionOptions: [],
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0
      },
      tableData: [],
      query: {},
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      sectionOptions: [],
      unitOptions: [],
      wzCode: "wz",
      wzCodeOptions: [],
      typeOptions: [
        {
          dictName: "年度计划",
          dictId: 1
        },
        {
          dictName: "月度计划",
          dictId: 2
        },
        {
          dictName: "总计划",
          dictId: 3
        }
      ],

      currentRow: ""
    };
  },
  computed: {
    exportParams() {
      this.query.flowStatus = 2;
      this.query.type = this.planType === 0 ? "" : this.planType;
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query
        }
      };
      return params;
    },
    userInfo() {
      //console.log("userInfo", this.$getStorage("userInfo"));
      return this.$getStorage("userInfo");
    },
    isSystem() {
      return (
        this.userInfo?.username === "system" ||
        this.userInfo?.username === "super"
      );
    },
    title() {
      return "计划台账";
    }
  },
  created() {
    this.getSectionList();
  },
  methods: {
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/schedule/management/export";
      exportParams.filename = "计划台账";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    // 选中行
    chooseCurrentRow(row) {
      console.log("$emit------selectHandle");
      this.$emit("selectHandle", row);
    },
    //获取标段名称
    getSelectText(dict, value) {
      let text = "-";
      let a = dict.find((item) => item.id == value);
      if (a) {
        text = a.name;
      }
      return text;
    },
    close() {
      // this.getUnitList();
    },
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
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
    details(row, type) {
      console.log("details", row);
      this.$refs.dataform.dialogShow = true;
      this.$refs.dataform.planType = row.type;
      this.$refs.dataform.formData.type = row.type;
      if (row.type === 1) {
        this.$refs.dataform.title = "年度计划";
        this.$refs.dataform.label = "年份:";
        this.$refs.dataform.dateType = "year";
        this.$refs.dataform.valueFormat = "yyyy";
      } else if (row.type === 2) {
        this.$refs.dataform.title = "月度计划";
        this.$refs.dataform.label = "月份:";
        this.$refs.dataform.dateType = "month";
        this.$refs.dataform.valueFormat = "yyyy-MM";
      } else if (row.type === 3) {
        this.$refs.dataform.title = "总计划";
      }
      this.$nextTick(() => {
        this.$refs.dataform.formDisabled = true;
        this.$refs.dataform.formPageType = type;
        this.$refs.dataform.getFormData({ ...row });
      });
    },
    async getSectionList() {
      const { data, success } = await sectionList({});
      console.log("单位列表", success, data);
      if (success) {
        this.sectionOptions = data;
        let root = {
          id: "root",
          name: "施工标段列表",
          children: data
        };
        this.treeData.push(root);
        // this.treeData=[root]
        // console.log(this.treeData);
        this.getTableData();
      }
    },
    handleNodeClick(data) {
      console.log("点击树节点", data);
      if (data.id === "root") {
        this.query.sectionId = "";
      } else {
        this.query.sectionId = data.id;
      }
      this.getTableData();
      // this.getFlow("施工单位收文流程");
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    retCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\-【/, "|");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\】-/, "|");

      return outputString;
    },
    // 查询表格数据
    getTableData() {
      this.tableData = [];
      this.query.flowStatus = 2;
      this.query.type = this.planType === 0 ? "" : this.planType;
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query
        }
      };

      page(params).then((res) => {
        if (res.success && res.data) {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        } else {
          this.tableData = [];
          this.pageParams.total = 0;
        }
      });
    },

    addDoc(row) {
      console.log("上报OA", row);
    },
    edit(row, page, task) {
      this.$setStorage("design_row", row);
      this.handelShowDialog(row, page, task);
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
      if (code === this.wzCode) {
        if (!this.wzCodeOptions || this.wzCodeOptions.length == 0) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.wzCodeOptions = res.data;
            }
          });
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
  padding: 15px;
}

/deep/ .el-dialog__wrapper {
  // overflow: hidden;
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

/deep/ .divider {
  margin-top: 10px !important;
}
</style>
