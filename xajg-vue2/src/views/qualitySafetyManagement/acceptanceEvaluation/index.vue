<template>
  <div class="page-list">
    <TreeTableLayout
      :page="pageParams"
      title="质量验收"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleQuery"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="query" :inline="true" label-width="580">
          <el-form-item label="所属标段:">
            <el-select
              v-model="query.sectionId"
              placeholder="请选择"
              @change="sectionChange"
            >
              <el-option
                v-for="item in sectionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单元工程名称:">
            <el-input v-model="query.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="单元工程编码:">
            <el-input v-model="query.code" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="申请验收日期:" size="mini">
            <el-date-picker
              v-model="query.searchDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 230px"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          :disabled="!treeLoaded || isRootNode"
          type="primary"
          icon="el-icon-plus"
          @click="addHandle()"
        >
          新增
        </el-button>
      </template>
      <template slot="table">
        <div class="content">
          <div class="left-content">
            <div class="tree-wrapper" :style="{ width: treeWidth + 'px' }">
              <el-tree
                ref="tree"
                v-loading="treeLoading"
                :default-expanded-keys="getExpanded()"
                empty-text=" "
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                class="tree-dom"
                node-key="id"
                :data="treeData"
                :props="defaultProps"
                :expand-on-click-node="true"
                highlight-current
                @node-click="handleTreeNodeClick"
              >
                <template #default="{ data }">
                  <span class="custom-tree-node" :title="data.nodeName">
                    <i
                      :class="
                        data.children.length > 0
                          ? 'el-icon-folder-opened'
                          : 'el-icon-folder'
                      "
                    />
                    <el-tooltip effect="dark" :content="data.nodeName" placement="top">
                      <span>{{ data.nodeName }}</span>
                    </el-tooltip>
                  </span>
                </template>
              </el-tree>
            </div>
            <!-- <DragLine @moveEnd="handelMoveEnd" :minMoveX="0"></DragLine> -->
          </div>
          <div class="table-wrapper">
            <el-table
              ref="multipleTable"
              v-loading="tableLoading"
              empty-text=" "
              :data="tableData"
              border
              header
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
            >
              <el-table-column
                label="序号"
                type="index"
                :index="getIndex"
                width="54"
                align="center"
              />
              <el-table-column
                label="单元工程名称"
                header-align="center"
                align="left"
                prop="name"
              >
                <template slot-scope="{ row }">
                  <el-tooltip :content="row.name" placement="top" effect="dark">
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
                      >{{ row.name }}
                    </el-link>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="单元工程编码"
                header-align="center"
                align="left"
                prop="code"
              >
                <template slot-scope="{ row }">
                  <el-tooltip :content="row.code" placement="top" effect="dark">
                    <span class="text-ellipsis">{{ row.code }} </span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="申请验收日期"
                align="center"
                prop="qualityStartDate"
              >
                <template slot-scope="{ row }">
                  {{
                    row.qualityStartDate
                      ? timeFormat(row.qualityStartDate, "YYYY-MM-DD")
                      : ""
                  }}
                </template>
              </el-table-column>
              <el-table-column label="验收状态" align="center" prop="qbsStatus">
                <template slot-scope="{ row }">
                  <el-tag :type="getQbsStatusColor(row.qbsStatus)">{{
                    row.qbsStatus ? getQbsStatusName(row.qbsStatus) : ""
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="验收结论" align="center" prop="qualityGrade">
                <template slot-scope="{ row }">
                  {{ row.qualityGrade ? getQualityGradeName(row.qualityGrade) : "" }}
                </template>
              </el-table-column>

              <el-table-column label="关联工程部位" align="center" prop="pbsName">
                <template slot-scope="{ row }">
                  <bim-show :pbs-code="row.pbsCode" />
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="name" width="200" align="center">
                <template #default="{ row }">
                  <flow-button
                    :row="row"
                    :flow-name="flowName"
                    @click="edit"
                    @delete="deletedata"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <flow-dialog
      :visible="flowShow"
      :flow-info="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    />
  </div>
</template>

<script>
import { page, remove, getArchiveFileCatalogueManagerTree } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import bimShow from "@/components/Bim/Show";
// import DragLine from "@/views/archives/shared_component/DragLine";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";

import { getSectionByCorpId } from "@/api/measure";
export default {
  name: "EvaluationLedger",
  components: {
    // DragLine,
    bimShow,
    TreeTableLayout
  },
  mixins: [FlowListMixin],
  data() {
    return {
      treeLoaded: false,
      isRootNode: false,
      treeNode: {}, //点击树节点传递给子组件使用
      sectionId: null,
      type: "",
      title: "验评台账",
      defaultProps: {
        children: "children",
        label: "label"
      },
      pageParams: {
        size: 20,
        current: 1,
        total: 0
      },
      tableLoading: true,
      treeLoading: true,
      query: {
        searchDate: [],
        sectionId: null,
        name: null,
        code: null
      },
      selectionNode: {},
      options: [],
      tableData: [],
      readonly: false,
      treeData: [],
      typeDictMap: [],
      typeOptions: [],
      treeWidth: 267,
      currentNodeKey: "",
      sectionList: [],
      unitProjectTypeList: []
    };
  },
  computed: {},
  created() {
    this.getCurrent();
    this.getTypeDictMap();
  },
  methods: {
    /* 获取当前登录人信息*/
    async getCurrent() {
      this.current = this.$getStorage("userInfo");
      await this.getSectionList(this.current.corpId);
      if (this.sectionList.length === 0) {
        this.$message.error("查询标段失败");
        return;
      }
      this.query.sectionId = this.sectionList[0].id;
      const sectionIds = this.sectionList[0].id;
      await this.getTree(sectionIds);
    },
    async getSectionList(corporateId) {
      try {
        const { data, success, message } = await getSectionByCorpId({
          corpId: corporateId
        });
        if (!success) {
          this.$message.error("查询标段失败：" + message);
          return false;
        }
        this.query.sectionId = data[0].id;
        this.sectionList = data;
        return data;
      } catch (err) {
        this.$message.error("查询标段失败");
        return false;
      }
    },
    sectionChange() {
      let sectionIds = this.query.sectionId;
      this.getTree(sectionIds);
    },
    addHandle() {
      // 新增先校验目录节点是否选中
      if (this.query.catalogue == null) {
        this.$message.warning("请选择左侧具体的目录节点");
        return;
      }
      if (this.query.sectionId == null) {
        this.$message.warning("请选择标段");
        return;
      }
      this.$setStorage("acceptance_evaluation", {
        sectionId: this.query.sectionId,
        treeNode: this.treeNode
      });
      this.handelShowDialog(null, "mine");
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    getExpanded() {
      // 返回3层id
      const idArr = [];
      this.treeData.forEach((element) => {
        idArr.push(element.id);
        if (
          element.children &&
          typeof element.children === "object" &&
          Array.isArray(element.children)
        ) {
          element.children.forEach((e) => {
            idArr.push(e.id);
          });
        }
      });
      return idArr;
    },
    getQbsStatusColor(val) {
      //1:未验评、2:验评中、3:已验评
      const qbsColor = new Map();
      qbsColor.set("1", "info");
      qbsColor.set("2", "warning");
      qbsColor.set("3", "primary");
      return qbsColor.get(val) ? qbsColor.get(val) : "info";
    },
    getQbsStatusName(val) {
      //1:未验评、2:验评中、3:已验评
      const qbsStatus = new Map();
      qbsStatus.set("1", "未验评");
      qbsStatus.set("2", "验评中");
      qbsStatus.set("3", "已验评");
      return qbsStatus.get(val) ? qbsStatus.get(val) : "---";
    },
    getQualityGradeName(val) {
      //0:不合格、1:合格、2:优良
      const qualityGrade = new Map();
      qualityGrade.set("0", "不合格");
      qualityGrade.set("1", "合格");
      qualityGrade.set("2", "优良");
      return qualityGrade.get(val) ? qualityGrade.get(val) : "---";
    },
    getPbsTypeName(val) {
      //1:单位、2:子单位工程、3:分部工程、4:子分部工程、5:分项工程、6:单元工程
      const pbsType = new Map();
      pbsType.set("1", "单位");
      pbsType.set("2", "子单位工程");
      pbsType.set("3", "分部工程");
      pbsType.set("4", "子分部工程");
      pbsType.set("5", "分项工程");
      pbsType.set("6", "单元工程");
      return pbsType.get(val) ? pbsType.get(val) : "---";
    },

    /**获取字典 */
    async getTypeDictMap() {
      const { data } = await getDictItemList("UNIT_PROJECT_TYPE");
      this.typeDictMap = data;
      //   this.typeOptions = buildTree(data, "-");
    },
    getTypeDictName(id) {
      //a101:水工、a201:公路、a301:房建
      const unitProjectYype = new Map();
      unitProjectYype.set("a101", "水工");
      unitProjectYype.set("a201", "公路");
      unitProjectYype.set("a301", "房建");
      return unitProjectYype.get(id);
    },
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    reset() {
      //不要清空 query.catalogue
      console.log("this.query", this.query);
      this.query.name = null;
      this.query.code = null;
      this.query.searchDate = [];
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      if (!this.treeLoaded || !this.query.catalogue) {
        return;
      }
      this.tableData = [];
      this.tableLoading = true;
      if (!this.query.sectionId && this.sectionList.length > 0) {
        // 默认选择标段
        this.$set(this.query, "sectionId", this.sectionList[0].id);
      }
      let params = {
        ...this.pageParams
      };
      params.entity = { ...this.query };
      if (params.entity.searchDate?.length === 2) {
        params.entity.startDate = params.entity.searchDate[0];
        params.entity.endDate = params.entity.searchDate[1];
        delete params.entity.searchDate;
      }

      params.orderProperties = [
        {
          property: "createDate"
        }
      ];
      page(params).then((data) => {
        this.$set(this, "tableData", data?.data?.records || []);
        this.pageParams.total = data?.data?.total || 0;
        this.tableLoading = false;
      });
    },
    /**初始化 */
    async getTree(sectionIds) {
      this.treeLoaded = false;
      let params = {};
      params.sectionIds = sectionIds;
      const { data, success, message } = await getArchiveFileCatalogueManagerTree(params);
      if (!success) {
        this.$message.error("获取目录树失败：" + message);
        return false;
      }
      this.treeData = data;
      if (data?.length > 0) {
        const defaultNode = data[0];
        this.selectionNode = defaultNode;
        this.isRootNode = true;
        this.treeLoaded = true;
        this.$nextTick(() => {
          const node = this.$refs.tree.getNode(defaultNode.id);
          this.$refs.tree.setCurrentNode(node.data);
          this.query.catalogue = defaultNode.code;
          this.treeNode = defaultNode;
          console.log("treeLoaded", this.query.catalogue);
          this.getTableData();
        });
      } else {
        this.query.parentId = null;
        this.selectionNode = null;
        this.treeData = [];
        this.tableData = [];
        this.tableLoading = true;
        this.treeLoading = false;
      }
      this.treeLoading = false;
      if (success) {
        this.treeData = data;
        this.selectionNode = data[0] || {};
        this.tableLoading = true;
        this.treeLoading = false;
        this.getTableData();
      }
    },

    handleTreeNodeClick(data, node, ve) {
      if (this.treeData && this.treeData.length > 0 && data.id === this.treeData[0].id) {
        this.isRootNode = true;
      } else {
        this.isRootNode = false;
      }
      console.log(data, node, ve);
      this.selectionNode = { ...data };
      this.query.catalogue = data.code;
      this.treeNode = data;
      this.pageParams.pageSize = 20;
      this.pageParams.current = 1;
      this.getTableData();
      this.scrollTop();
    },

    scrollTop() {
      this.$nextTick(() => {
        let test = document.getElementsByClassName("el-table__body-wrapper")[0];
        test.scroll(0, 0);
      });
    },
    edit(row, status, task) {
      this.$setStorage("acceptance_evaluation", {
        sectionId: this.query.sectionId,
        treeNode: this.treeNode
      });
      this.handelShowDialog(row, status, task);
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize;
      this.getTableData();
      this.scrollTop();
    },
    handleCurrentChange(val) {
      this.pageParams = val;
      this.getTableData();
      this.scrollTop();
    },
    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX;
    },
    deletedata(row) {
      console.log(row);
      if (!row.id) {
        return;
      }
      remove({
        id: row.id
      }).then((res) => {
        if (res.success) {
          this.getTableData();
        } else {
          this.$message.error("数据删除异常，" + res.message);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;

  .content {
    width: 100%;
    display: flex;
    height: 100%;
    gap: 16px;

    .left-content {
      height: 100%;
      position: relative;
      /deep/ .el-tree-node__content {
        .custom-tree-node {
          flex: 1;
          overflow: hidden;
          display: flex;
          span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      &:hover {
        .drag-line {
          width: 5px;
          background-color: #e4e1e1;
        }
      }
    }

    .tree-wrapper {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      border: #e5e5e5 1px solid;
    }

    .table-wrapper {
      flex: 1;
      width: 0;
    }
  }
}

.splitter-pane {
  .el-tree {
    height: 100%;
    overflow-y: auto;
  }
}

// .page-list {
//     width: 100%;
//     height: 100%;
//     padding: 15px;

//     .table {
//         height: 80%;

//         /deep/ .el-table__row .cell button {
//             padding: 0 !important;
//         }
//     }

//     .pagination {
//         padding: 0 20px;
//     }
// }

.tree-title {
  font-size: 20px;
  margin: 15px;
  cursor: pointer;
}

.margin-top {
  padding-left: 40px;
  font-size: 20px;
  margin-top: 15px;
  padding-bottom: 25px;
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

/deep/ .el-col-8 {
  margin-bottom: 20px;
}

/deep/ .iconfont {
  margin: 0% 7px;
}

/deep/.el-form-item__label {
  height: 100%;
  // width: 120px;
  white-space: nowrap;
  width: 110px !important;
}
</style>
