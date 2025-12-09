<template>
  <div class="page-leave">
    <treeTableLayout
      class=""
      :showSearchBtns="false"
      title="供应计划目录"
      :showPage="false"
      :showExportBtn="true"
      @initExportParams="initExportParams"
    >
      <template slot="tree">
        <el-tree
          ref="tree"
          class="tree-dom"
          node-key="id"
          :data="treeData"
          :props="defaultProps"
          :expand-on-click-node="true"
          @node-click="handleTreeNodeClick"
          :current-node-key="'1'"
          highlight-current
        >
        </el-tree>
      </template>
      <template slot="opratebtns"><span></span></template>
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          header
          height="100%"
          :cell-style="rowGray"
        >
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          />
          <el-table-column
            label="分类"
            align="center"
            prop="classify"
            excel.dictType="DESIGN_CLASSIFY"
          >
            <template slot-scope="{ row }">
              {{ $DictionaryParsing(designClassifyOptions, row.classify) }}
            </template>
          </el-table-column>
          <el-table-column label="任务项名称" align="center" prop="taskName">
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.taskName ? row.taskName : ''"
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis-clamp">
                  {{ row.taskName ? row.taskName : "" }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="专业"
            align="center"
            prop="profession"
            excel.dictType="DESIGN_PROFESSION"
          >
            <template slot-scope="{ row }">
              {{ $DictionaryParsing(designProfessionOptions, row.profession) }}
            </template>
          </el-table-column>

          <el-table-column
            label="计划供应日期"
            align="center"
            prop="planTime"
            excel.dateFormat="yyyy-MM-dd"
          >
            <template slot-scope="{ row }">
              {{ row.planTime ? timeFormat(row.planTime, "YYYY-MM-DD") : "" }}
            </template>
          </el-table-column>

          <el-table-column
            label="实际供应日期"
            align="center"
            prop="actualDate"
            excel.dateFormat="yyyy-MM-dd"
          >
            <template slot-scope="{ row }">
              {{
                row.actualDate ? timeFormat(row.actualDate, "YYYY-MM-DD") : ""
              }}
            </template>
          </el-table-column>
          <el-table-column label="负责人" prop="chargeName" align="center">
            <template slot-scope="scope">
              <span v-if="ishowselect(scope.row)">
                <span>
                  {{ scope.row.chargeName }}
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="工程部位"
            align="center"
            prop="projectPbs"
            excel.handler="excelHandleCovert"
            excel.args="pbs"
          >
            <template slot-scope="{ row }">
              <bim-show :pbsCode="row.projectPbs"></bim-show>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" align="center">
            <template slot-scope="{ row }">
              <span v-if="ishowselect(row)">
                <span>{{ row.remark }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="完成状态"
            align="center"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
          >
            <template slot-scope="{ row }">
              <span
                v-if="row.planTime >= row.actualDate && row.actualDate != null"
                style="color: rgb(123, 255, 0)"
                >{{ getstatusName(row) }}</span
              >
              <span
                v-if="row.planTime < row.actualDate && row.actualDate != null"
                style="color: rgb(255, 200, 0)"
                >{{ getstatusName(row) }}</span
              >
              <span
                v-if="row.planTime >= nowDate && row.actualDate == null"
                style="color: rgb(0, 166, 255)"
                >{{ getstatusName(row) }}</span
              >
              <span
                v-if="row.planTime < nowDate && row.actualDate == null"
                style="color: red"
                >{{ getstatusName(row) }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="修改状态"
            align="center"
            prop="changeType"
            excel.readConverterExp="1=已修改,2=已删除,3=新增项"
          >
            <template slot-scope="{ row }">
              <span>{{ getPlanTypeText(row.changeType) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </treeTableLayout>
  </div>
</template>

<script>
import { tree } from "./api";
import enums from "@/config/enums";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import treeTableLayout from "@/components/ContentLayout/TreeTable";

export default {
  name: "evaluation-ledger",
  components: {
    treeTableLayout,
  },

  data() {
    return {
      nowDate: Date.parse(new Date()), //当前时间
      treeNode: {}, //点击树节点传递给子组件使用
      type: "",
      title: "验评台账",
      query: {
        id: ""
      },
      dataRow: {},
      oprateRow: {},
      options: [],
      tableData: [],
      tableDataTemp: [],
      readonly: false,
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeData: [],
      typeOptions: [],
      designClassifyCode: "DESIGN_CLASSIFY",
      designClassifyOptions: [],

      designProfessionCode: "DESIGN_PROFESSION",
      designProfessionOptions: []
    };
  },
  created() {
    this.getDictCLASSIFY(this.designClassifyCode);
    this.getDictProfession(this.designProfessionCode);
  },
  mounted() {
    this.initTree();
  },
  methods: {
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      console.log("exp", exportParams);
      exportParams.url = "/api/design/ledgert/export";
      exportParams.filename = "供应台账";
      exportParams.params = {};
      exportParams.params.columns = exportParams.columns;
      console.log("exp", exportParams);
    },
    // 分类字典
    async getDictCLASSIFY(Code) {
      const { data } = await getDictItemList(Code);
      this.designClassifyOptions = data;
    },
    // 专业字典
    async getDictProfession(Code) {
      const { data } = await getDictItemList(Code);
      this.designProfessionOptions = data;
    },

    //不合格行置灰
    rowGray({ row, column, rowIndex, columnIndex }) {
      if (row.changeType == 2) {
        return { color: "#A9A9A9" };
      }
    },
    getPlanTypeText(value) {
      let name = "";
      if (value) {
        name = enums["PLAN_EDIT_TYPE2"][value - 1].name || "";
      }
      return name;
    },
    //根据完成时间和计算完成状态
    getstatusName(row) {
      if (row.actualDate != null) {
        if (row.planTime >= row.actualDate) {
          return "按时完成";
        } else {
          return "逾期完成";
        }
      } else {
        if (row.planTime > this.nowDate) {
          return "进行中";
        } else {
          return "已逾期";
        }
      }
    },
    // 是否展示 选项
    ishowselect(row) {
      let bool = true;
      // 判断row 是不是又type 属性，没有就返回false
      if (Object.prototype.hasOwnProperty.call(row, "type")) {
        if (row.type == "class") {
          bool = false;
        } else {
          bool = true;
        }
      } else {
        bool = false;
      }
      return bool;
    },

    /**初始化 */
    async initTree() {
      const { data, success } = await tree();
      if (success) {
        this.treeData = data;
        this.treeData.forEach((X) => (X.name = X.name + "年度"));
        this.query.id = data[0]?.id || null;
        this.handleTreeNodeClick(data[0]);
      }
    },
    handleTreeNodeClick(data, node, ve) {
      this.tableData = [];
      let arr = this.flattenDesignPlanDetails(data);
      console.log("数据", arr);
      // 排序
      arr.sort((a, b) => {
        if (a.classify < b.classify) {
          return -1;
        } else if (a.classify > b.classify) {
          return 1;
        } else {
          // 如果 classify 相同，则按照 planTime 进行排序
          if (a.planTime < b.planTime) {
            return -1;
          } else if (a.planTime > b.planTime) {
            return 1;
          } else {
            return 0;
          }
        }
      });
      this.tableData = arr;
    },
    flattenDesignPlanDetails(data, flattenedArray = []) {
      if (data.children) {
        this.flattenDesignPlanDetails(data.children, flattenedArray);
      } else {
        console.log("arr", Array.isArray(data));
        if (Array.isArray(data)) {
          data?.forEach((item) => {
            item?.designPlanDetailList?.forEach((x) => {
              flattenedArray.push(x);
            });
          });
        } else {
          data?.designPlanDetailList?.forEach((x) => {
            flattenedArray.push(x);
          });
        }
      }
      return flattenedArray;
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
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

.table-title {
  display: flex;
  //   justify-content: center;
  align-items: stretch;
}

.title {
  margin-left: 10px;
  font-size: 18px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #333333;
  line-height: 21px;
}

/deep/ .search-form {
  display: inherit !important;
}
/deep/ .table-cnotent {
  height: calc(100% - 60px) !important;
}
</style>
