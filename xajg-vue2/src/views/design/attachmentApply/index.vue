<template>
  <div class="page-leave">
    <treeTableLayout
      :page="pageParams"
      title="相关批件办理"
      @query="getTableData"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
    >
      <template slot="form">
        <el-form ref="form" :model="query" :inline="true">
          <el-form-item label="流程名称:" size="mini">
            <el-input v-model="query.name" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="流程编号:" size="mini">
            <el-input v-model="query.code" placeholder="请输入" clearable />
          </el-form-item>

          <el-form-item label="发起日期" size="mini">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              placeholder="选择时间范围"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          :row-key="(row) => row.id"
          :highlight-current-row="!multiple"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            :index="getIndex"
            width="54"
          />
          <el-table-column
            label="流程名称"
            header-align="center"
            prop="name"
            align="left"
          >
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                class="text-ellipsis"
                @click="
                  edit(
                    row,
                    'fine',
                    row.procMatterTaskDone ||
                      row.matterTaskTodo ||
                      row.procMatterRun,
                    'view'
                  )
                "
              >
                {{ row.name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="流程编号"
            header-align="center"
            prop="code"
            align="left"
            width="180"
          />

          <el-table-column
            label="发起人"
            prop="type"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.procMatterRun.createUserName
                  ? scope.row.procMatterRun.createUserName
                  : "*"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发起日期"
            prop="createDate"
            width="180"
            align="center"
            sortable
          >
            <template slot-scope="{ row }">
              {{
                row.createDate
                  ? timeFormat(row.createDate, "YYYY-MM-DD")
                  : ""
              }}
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="当前节点"
            align="center"
            width="200"
          >
            <template #default="{ row }">
              <span class="text-ellipsis">
                {{ row.flowName ? row.flowName : "" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="流程状态"
            prop="flowStatus"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <flow-status :row="scope.row" :flow-name="flowName" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </treeTableLayout>
    <flow-dialog
      :visible="flowShow"
      :flow-info="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    />
  </div>
</template>

<script>
import treeTableLayout from "@/components/ContentLayout/TreeTable";
import { dateFormat } from "@/utils";
import enums from "@/config/enums";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import { getDictItemTree } from "@/api/dict";
import { page, remove } from "./api";

export default {
  name: "AttachmentApply",
  components: { treeTableLayout },
  mixins: [FlowListMixin],
  data() {
    return {
      multiple: true, //默认为多选
      showTable: false,
      uploadOaLoading: false,
      fromPage: "", //当作为组件的时候会用到
      sectionOptions: [],
      flowStatusOptions: [],
      formData: {
        createDate: "",
      },
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      tableData: [],
      query: {},
      dateRange: [],
      flowShow: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "dictName",
      },
      attachmentList: [],
    };
  },
  created() {
    // this.getAttachmnetTypes();
  },
  methods: {
    add() {
      this.handelShowDialog(null, "mine");
    },
    edit(row, status, task, type) {
      this.handelShowDialog(row, status, task);
    },
    // 查询表格数据
    getTableData(pageInfo) {
      this.query.startDate =
        this.dateRange && this.dateRange.length > 0 ? this.dateRange[0] : null;
      this.query.endDate =
        this.dateRange && this.dateRange.length > 1 ? this.dateRange[1] : null;
      this.pageParams.entity = this.query;
      this.pageParams = Object.assign(this.pageParams, pageInfo);
      page(this.pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          console.log("pageParams", this.pageParams, res);
          this.pageParams.total = res.data.total;
        }
      });
    },
    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current; //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize; //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
    },

    handleNodeClick(data) {
      console.log("点击树节点", data);

      // 定义一个数组来存储 types
      let types = [];
      // 递归函数来获取子节点的 dictCode
      const collectTypes = (node) => {
        // 将当前节点的 dictCode 添加到 types 数组中
        types.push(node.dictCode);

        // 如果有子节点，递归遍历
        if (node.children && node.children.length > 0) {
          for (let child of node.children) {
            collectTypes(child);
          }
        }
      };
      // 开始收集类型
      collectTypes(data);
      this.query.types = types;
      console.log("*******", this.query.types);
      this.getTableData();
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
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

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    reset() {
      this.query = {};
      this.dateRange = [];
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },

    getAttachmnetTypes() {
      getDictItemTree("ATTACHMENT_TYPE").then((res) => {
        if (res.success) {
          this.attachmentList = res.data;
        }
      });
    },
    getAttachmnetType(code) {
      const findNode = (nodes, code) => {
        for (const node of nodes) {
          if (node.dictCode === code) {
            return node.dictName;
          }
          if (node.children && node.children.length > 0) {
            const foundNode = findNode(node.children, code);
            if (foundNode) {
              return foundNode;
            }
          }
        }
        return "";
      };

      return findNode(this.attachmentList, code);
    },
    deletedata(row) {
      let params = {
        id: row.id,
      };
      remove(params).then((res) => {
        this.getTableData();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;
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
