<template>
  <div class="page-archival-catalogue">
    <TreeTableLayout
      class="full-height-layout"
      :page="searchData"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
      title="概算分类"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="概算名称">
            <el-input
              v-model="searchData.nodeName"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="概算编码">
            <el-input
              v-model="searchData.code"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <!--   有节点,但是没选中 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addTreeDialog"
          :disabled="treeData.length > 0 && !selectionNode.nodeType"
          >新增类型</el-button
        >
        <!-- 没有节点或者没选中节点 -->
        <el-button
          icon="el-icon-plus"
          @click="addItemDialog"
          :disabled="
            treeData.length == 0 ||
            !selectionNode.nodeType ||
            selectionNode.nodeType != 'tree'
          "
          >新增项</el-button
        >
      </template>
      <template slot="searchBtnsAppend">
        <el-button size="small" @click="onShowUnitClick"
          >切换单位（元/万元）</el-button
        >
      </template>
      <template slot="table">
        <div class="content">
          <div class="left-content">
            <div class="tree-wrapper" :style="{ width: treeWidth + 'px' }">
              <el-tree
                ref="tree"
                :highlight-current="true"
                class="tree"
                :data="treeData"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                node-key="id"
                :expand-on-click-node="false"
                :key="treeRefreshKey"
              >
                <span
                  slot-scope="{ data, node }"
                  class="custom-tree-node"
                  :title="data.nodeName"
                >
                  <i style="color: #014acb" :class="getNodeIcon(data)" />
                  <el-tooltip
                    effect="dark"
                    :content="data.nodeName"
                    placement="top"
                  >
                    <span>{{ data.nodeName }}</span>
                  </el-tooltip>
                  <span class="command-content" v-if="data.nodeType == 'tree'">
                    <el-dropdown
                      trigger="click"
                      @command="
                        (command) => {
                          handleCommand(command, data, node);
                        }
                      "
                    >
                      <span>
                        <i class="el-icon-more"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="edit">编辑</el-dropdown-item>
                        <el-dropdown-item command="delete"
                          >删除</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                </span>
              </el-tree>
            </div>
            <DragLine @moveEnd="handelMoveEnd" :minMoveX="0"></DragLine>
          </div>

          <div class="table-wrapper">
            <el-table :data="tableData" stripe height="100%" border>
              <el-table-column label="序号" align="center" width="54">
                <template #default="{ $index }">
                  {{
                    $index + 1 + (searchData.current - 1) * searchData.pageSize
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="概算名称"
                show-overflow-tooltip
                align="left"
                header-align="center"
              >
                <template #default="{ row }">
                  <el-link
                    :underline="false"
                    type="primary"
                    @click="showRow(row)"
                    >{{ row.name }}</el-link
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="code"
                label="概算编码"
                align="left"
                width="120"
              />
              <el-table-column
                prop="type"
                label="概算类型"
                align="center"
                width="180"
              >
                <template #default="{ row }">
                  <el-tag v-if="row.type == 0" type="warning"
                    >非合同概算</el-tag
                  >
                  <el-tag v-if="row.type == 1" type="success">合同概算</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="quantity"
                label="数量"
                align="right"
                width="120"
              />
              <el-table-column
                prop="unit"
                label="单位"
                align="center"
                width="120"
              />
              <el-table-column
                prop="estimateUnitPrice"
                label="概算单价"
                align="right"
                width="120"
              />
              <el-table-column
                prop="estimateTotalPrice"
                :label="`概算总价(${priceUnit})`"
                align="right"
                width="140"
              >
                <template #default="{ row }">
                  {{ formatEstimateTotalPrice(row.estimateTotalPrice) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="budgetUnitPrice"
                label="预算单价"
                align="right"
                width="120"
              />
              <el-table-column
                prop="budgetTotalPrice"
                label="预算总价"
                align="right"
                width="120"
              />

              <el-table-column
                label="操作"
                align="center"
                width="180"
                fixed="right"
              >
                <template #default="{ row }">
                  <el-link type="primary" @click="changeRow(row)">编辑</el-link>
                  <el-divider direction="vertical" />
                  <el-link type="danger" @click="deleteEstimateItem(row.id)"
                    >删除</el-link
                  >
                  <!-- // {
                    //   title: '上移',
                    //   method: 'moveupEstimateCatalogueTable',
                    //   disabled: !row.canMoveUp,
                    // },
                    // {
                    //   title: '下移',
                    //   method: 'movedownEstimateCatalogueTable',
                    //   disabled: !row.canMoveDown,
                    // }, -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>

    <ItemForm
      :dialogKey="dialogKey"
      :visible="showItemDialog"
      :mode="itemDialogMode"
      :node-data="formData"
      :title="title"
      :tree-data="treeData"
      :parentNode="parentNode"
      @close="closeItemDialog"
      @refresh="estimateCatalogueTreeFindList"
    />
    <TreeForm
      :dialogKey="dialogKey"
      :visible="showTreeDialog"
      :mode="treeDialogMode"
      :node-data="formData"
      :title="title"
      :tree-data="treeData"
      :parentNode="parentNode"
      @close="closeTreeDialog"
      @refresh="reGetTreeData"
    />
  </div>
</template>

<script>
import {
  getEstimateCatalogueManagerTree,
  estimateCatalogueTreeFindList,
  deleteEstimateCatalogueTree,
  deleteEstimateItem,
  movedownEstimateCatalogueTable,
  moveupEstimateCatalogueTable,
} from "@/api/estimate.js";
import ItemForm from "./itemform.vue";
import TreeForm from "./treeform.vue";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import DragLine from "@/views/archives/shared_component/DragLine";

import CorSelect from "@/components/CorSelect/index";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import Decimal from "decimal.js";

export default {
  name: "investment-estimate",
  components: {
    TreeTableLayout,
    CorSelect,
    DragLine,
    TreeForm,
    ItemForm,
  },
  computed: {
    ...mapGetters(["loginInfo"]),
  },
  data() {
    return {
      priceUnit: "元",
      dialogKey: 0,
      title: "",
      queryTree: null,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "nodeName",
      },
      searchData: {
        id: "",
        total: 0,
        current: 1,
        pageSize: 20,
        size: 20, //组件有问题,仅当watch 仅当size不为undefined时才会触发
        startDate: null,
        endDate: null,
      },
      tableData: [],
      showDialog: false,
      addData: { mode: 1, isFile: 0, unitType: "", unitName: "" },
      selectionNode: {},
      rules: {
        nodeName: {
          required: true,
          message: "请输入节点名称",
          trigger: "blur",
        },
        code: {
          required: true,
          message: "请输入节点编码",
          trigger: "blur",
        },
      },
      date: [],
      treeWidth: 267,
      showItemDialog: false,
      showTreeDialog: false,
      itemDialogMode: "", // 'add', 'edit', 'view'
      treeDialogMode: "", // 'add', 'edit', 'view'
      parentNode: {},
      formData: {},
      treeRefreshKey: 0,
    };
  },
  watch: {
    queryTree(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    console.log("加载页面!!!!!!!!!!!!===============================");
    this.getTreeData();
  },
  methods: {
    dateFormat,
    onShowUnitClick() {
      this.priceUnit = this.priceUnit === "元" ? "万元" : "元";
    },
    // 概算总价：原始单位为“万元”，使用 Decimal 计算并保留两位小数
    formatEstimateTotalPrice(value) {
      const num = new Decimal(value || 0);
      if (this.priceUnit === "万元") {
        return num.toFixed(2);
      }
      // 显示为“元”：万元 -> 元（保留两位小数）
      return num.times(10000).toFixed(2);
    },
    closeTreeDialog() {
      console.log("关闭树对话框");
      this.showTreeDialog = false;
      this.formData = {};
    },
    closeItemDialog() {
      console.log("关闭项目对话框");
      this.showItemDialog = false;
      this.formData = {};
    },
    handleCommand(command, data, node) {
      if (command === "edit") {
        console.log("编辑", data);
        this.editTreeDialog(data);
      } else if (command === "delete") {
        this.deleteTreeDialog(data);
      }
    },
    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    async getTreeData() {
      const res = await this.getEstimateCatalogueManagerTree();
      if (res?.length > 0) {
        this.treeData = res;
        this.treeRefreshKey++; // 增加key值，强制树组件重新渲染
        const defaultNode = res[0];
        this.selectionNode = defaultNode;

        this.$nextTick(() => {
          setTimeout(() => {
            const node = this.$refs.tree.getNode(defaultNode.id);
            this.$refs.tree.setCurrentNode(node.data);
            this.estimateCatalogueTreeFindList();
          }, 50);
        });
      } else {
        this.treeData = [];
        this.treeRefreshKey++;
      }
    },
    async reGetTreeData() {
      const res = await this.getEstimateCatalogueManagerTree();
      if (res?.length > 0) {
        this.treeData = res; // 先更新树数据
        this.treeRefreshKey++; // 增加key值，强制树组件重新渲染

        this.$nextTick(() => {
          // 等待DOM更新后再查找节点
          setTimeout(() => {
            const node = this.$refs.tree.getNode(this.selectionNode.id);
            if (!node) {
              console.log("没有找到节点", this.selectionNode);
              const defaultNode = res[0];
              this.selectionNode = defaultNode;
              const newNode = this.$refs.tree.getNode(defaultNode.id);
              this.$refs.tree.setCurrentNode(newNode.data);
            } else {
              console.log("找到节点", node.data);
              this.selectionNode = node.data;
              this.$refs.tree.setCurrentNode(node.data);
            }
            this.estimateCatalogueTreeFindList();
          }, 100); // 增加一个小延时，确保树组件内部状态完全更新
        });
      } else {
        this.treeData = [];
        this.selectionNode = {};
        this.treeRefreshKey++;
      }
    },
    async getEstimateCatalogueManagerTree() {
      try {
        const { data, success, message } =
          await getEstimateCatalogueManagerTree();

        if (!success) {
          this.$message.error("获取文件目录树失败：" + message);
          return false;
        }

        // 递归处理树数据，为item类型节点添加nodeName属性
        const processTreeData = (nodes) => {
          if (!nodes || !nodes.length) return;
          nodes.forEach((node) => {
            if (node.nodeType === "item") {
              node.nodeName = node.name;
              node.children = [];
            }
            // 递归处理子节点
            if (node.children && node.children.length > 0) {
              processTreeData(node.children);
            }
          });
        };

        processTreeData(data);
        this.treeData = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件目录树失败");
        return false;
      }
    },
    // 点击搜索按按钮
    handelSearchButtonClick() {
      this.searchData.current = 1;
      this.estimateCatalogueTreeFindList();
    },

    handelResetButtonClick() {
      this.date = [];
      this.searchData = {
        current: 1,
        pageSize: 20,
        size: 20,
      };
      this.estimateCatalogueTreeFindList();
    },
    handleNodeClick(data, node, own) {
      this.selectionNode = data;
      if (data.nodeType === "item") {
        this.tableData = [data];
        return;
      }
      // 只有树节点才设置为当前选中节点并查询相关数据
      this.searchData.id = data.id;
      this.searchData.current = 1;
      this.estimateCatalogueTreeFindList();
    },
    async estimateCatalogueTreeFindList() {
      try {
        const searchData = { ...this.searchData, entity: {} };
        // if (this.date?.length > 0) {
        //   searchData.entity.startDate = this.date[0];
        //   searchData.entity.endDate = this.date[1];
        // } else {
        //   searchData.entity.startDate = null;
        //   searchData.entity.endDate = null;
        // }
        searchData.entity.id = this.selectionNode.id;
        // searchData.entity.updateUserName = this.searchData.updateUserName;
        searchData.entity.name = this.searchData.nodeName;
        searchData.entity.code = this.searchData.code;
        this.tableData = [];
        const res = await estimateCatalogueTreeFindList(searchData);

        if (!res.success) {
          this.$message.error("查询失败：" + res.message);
          return false;
        }
        this.tableData = res.data.records;
        this.searchData.total = res.data.total;
      } catch (err) {
        console.error(err);
        this.$message.error("查询失败");
        return false;
      }
    },

    // 添加节点

    // 切换一页有多少条数据
    handelPageSizeChange(page) {
      this.searchData.current = 1;
      this.searchData.pageSize = page.pageSize;
      this.searchData.size = page.pageSize;
      this.estimateCatalogueTreeFindList();
    },
    // 切换页数
    handelCurrentChange(page) {
      this.searchData.current = page.current;
      this.estimateCatalogueTreeFindList();
    },

    // 点击添加按钮
    addTreeDialog() {
      this.formData = {};
      this.title = "新增";
      this.treeDialogMode = "add";
      this.formData = {
        pid: this.selectionNode.id,
        parentNodeName: this.selectionNode.nodeName,
      };
      this.showTreeDialog = true;
    },
    editTreeDialog(node) {
      this.showItemDialog = false;
      this.formData = {};
      this.dialogKey++;
      this.title = "编辑";
      this.treeDialogMode = "edit";
      this.formData = { ...node };
      const parentNode = this.getParentNode(node);
      if (parentNode) {
        this.formData.parentNodeName = parentNode.nodeName;
      }
      this.showTreeDialog = true;
    },
    deleteTreeDialog(node) {
      this.deleteEstimateCatalogueTree(node);
    },
    addItemDialog() {
      this.showItemDialog = false;
      this.formData = {}; // 先清空formData
      this.dialogKey++;
      this.$nextTick(() => {
        this.itemDialogMode = "add";
        this.showItemDialog = true;
        this.title = "新增";
        this.parentNode = this.selectionNode; // 获取父节点
        this.formData = {
          baseId: this.selectionNode.id,
        };
      });
    },
    // 点击查看节点
    showRow(row) {
      this.parentNode = this.selectionNode; // 获取父节点
      this.formData = row;
      this.itemDialogMode = "view";
      this.showItemDialog = true;
      this.title = "详情";
    },
    // 点击编辑按钮
    changeRow(row) {
      // 使用ItemForm组件编辑
      this.formData = {};
      this.dialogKey++;
      this.parentNode = this.selectionNode; // 获取父节点
      this.formData = row;
      this.itemDialogMode = "edit";
      this.showItemDialog = true;
      this.title = "编辑";
    },
    //根据节点在treeData中的位置，获取父节点
    getParentNode(node) {
      const findNode = (nodes, pid) => {
        const found = nodes.find((item) => item.id === pid);
        if (found) {
          return found;
        }
        for (const item of nodes) {
          if (item.children && item.children.length > 0) {
            const result = findNode(item.children, pid);
            if (result) {
              return result;
            }
          }
        }
        return null;
      };

      if (!node || !node.pid) {
        return null;
      }

      return findNode(this.treeData, node.pid);
    },
    // 关闭dialog
    handelDialogConfirm() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            // 添加
            this.saveEstimateCatalogueTree();
          } else if (!this.isAdd && !this.isSHow) {
            // 编辑
            this.updateEstimateCatalogueTree();
          } else {
            // 查看
            this.showDialog = false;
          }
        }
      });
    },

    beforeDelete() {
      return this.$confirm("是否要删除这条数据 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
    },
    // 删除数据
    async deleteEstimateCatalogueTree(row) {
      try {
        await this.beforeDelete();
        const { data, success, message } = await deleteEstimateCatalogueTree(
          row
        );
        if (!success) {
          this.$message.error("删除失败：" + message);
          return false;
        }
        this.$message.success("删除成功!");
        this.reGetTreeData();
        return true;
      } catch (error) {
        console.error(error);
        if (error !== "cancel") {
          this.$message.error("删除失败");
        }
        return false;
      }
    },
    // 向下移动一行
    async movedownEstimateCatalogueTable(row) {
      try {
        const { data, success, message } = await movedownEstimateCatalogueTable(
          row.id
        );
        if (!success) {
          this.$message.error("移动失败：" + message);
          return false;
        }
        this.$message.success("移动成功");
        this.reGetTreeData();
        return true;
      } catch (error) {
        console.error(error);
        this.$message.error("移动失败");
        return false;
      }
    },
    // 向上移动一行
    async moveupEstimateCatalogueTable(row) {
      try {
        const { data, success, message } = await moveupEstimateCatalogueTable(
          row.id
        );
        if (!success) {
          this.$message.error("移动失败：" + message);
          return false;
        }
        this.$message.success("移动成功");

        this.reGetTreeData();
        return true;
      } catch (error) {
        console.error(error);
        this.$message.error("移动失败");
        return false;
      }
    },

    async deleteEstimateItem(id) {
      try {
        // 先询问用户是否确认删除
        await this.$confirm("确定要删除该概算项吗？删除后无法恢复", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        // 调用删除API
        const { success, message } = await deleteEstimateItem(id);

        if (!success) {
          this.$message.error("删除失败：" + message);
          return false;
        }

        this.$message.success("删除概算项成功");
        // 刷新数据
        this.estimateCatalogueTreeFindList();
        return true;
      } catch (error) {
        if (error !== "取消删除") {
          // 非用户取消删除的错误
          console.error(error);
          this.$message.error("删除失败");
        }
        return false;
      }
    },
    getNodeIcon(data) {
      if (data.nodeType === "item") {
        // 为项目类型节点显示文档图标
        return "el-icon-document";
      } else if (data.children && data.children.length > 0) {
        // 有子节点的树显示打开的文件夹
        return "el-icon-folder-opened";
      } else {
        // 无子节点的树显示关闭的文件夹
        return "el-icon-folder";
      }
    },
    // 判断节点是否禁用
    isNodeDisabled(data, node) {
      return data.nodeType === "item";
    },
  },
};
</script>

<style scoped lang="scss">
.page-archival-catalogue {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .full-height-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  // 确保内容区域占满所有可用空间
  /deep/ .tree-table-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  // 确保表单区域不会超出显示范围
  /deep/ .search-area {
    flex-shrink: 0; // 不缩小
  }

  // 让内容区域自动填充剩余空间
  /deep/ .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0; // 解决flex布局中的滚动问题
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    gap: 16px;

    .left-content {
      height: 100%;
      position: relative;
      flex-shrink: 0; // 不压缩左侧宽度
      /deep/ .el-tree-node__content {
        .custom-tree-node {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          span {
            flex: 1;
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
      padding-right: 10px;
      overflow-y: auto;
      border: #e5e5e5 1px solid;
    }

    .table-wrapper {
      flex: 1;
      min-width: 0; // 让flex子项能够正确处理overflow
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      // 使表格填充容器并显示滚动条
      /deep/ .el-table {
        height: 100% !important;

        .el-table__body-wrapper {
          height: calc(100% - 48px) !important; // 减去表头高度
          overflow-y: auto !important; // 强制显示滚动条
        }
      }
    }
  }

  // 其他样式保持不变
  .command-content {
    position: absolute;
    right: 0px;
    z-index: 1;
  }

  .tree-wrapper {
    width: 267px;
    float: left;
    height: 100%;
    border: #e5e5e5 1px solid;
    overflow: auto;

    .tree-inner-wrapper {
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      height: 100%;
      overflow-y: hidden;

      .tree {
        overflow: auto;
        height: calc(100% - 80px);
        background-color: unset;
        color: #515b81;
        margin-top: 10px;

        .tree-icon {
          margin-right: 5px;

          &.el-icon-folder {
            color: #35a5ff;
          }

          &.el-icon-tickets {
            color: #ff6601;
          }
        }
      }
    }
  }

  .table-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
}
</style>
