<template>
  <div class="page-archival-catalogue">
    <TreeTableLayout
      :page="searchData"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
      title="节点列表"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="节点名称">
            <el-input v-model="searchData.nodeName" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="更新人">
            <el-input
              v-model="searchData.updateUserName"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="更新日期">
            <el-date-picker
              v-model="date"
              clearable
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button type="primary" icon="el-icon-plus" @click="addDialog">新增</el-button>
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
                @node-click="handelNodeClick"
                node-key="id"
                :expand-on-click-node="false"
              >
                <span
                  slot-scope="{ data }"
                  class="custom-tree-node"
                  :title="data.nodeName"
                >
                  <i
                    style="color: #014acb"
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
              </el-tree>
            </div>
            <!-- <DragLine @moveEnd="handelMoveEnd" :minMoveX="0"></DragLine> -->
          </div>

          <div class="table-wrapper">
            <el-table :data="tableData" stripe height="100%" border>
              <el-table-column label="序号" align="center" width="54">
                <template #default="{ $index }">
                  {{ $index + 1 + (searchData.current - 1) * searchData.pageSize }}
                </template>
              </el-table-column>
              <el-table-column
                prop="nodeName"
                label="节点名称"
                show-overflow-tooltip
                align="left"
                header-align="center"
              >
                <template #default="{ row }">
                  <el-link :underline="false" type="primary" @click="showRow(row)">{{
                    row.nodeName
                  }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="code" label="节点编码" align="center" width="120" />
              <el-table-column
                prop="updateUserName"
                label="更新人"
                align="center"
                width="120"
              />
              <el-table-column
                prop="updateDate"
                label="更新日期"
                width="120"
                align="center"
              >
                <template #default="{ row }">
                  {{ dateFormat(row.updateDate) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="180"
                fixed="right"
              >
                <template #default="{ row, $index }">
                  <list-button
                    :data="row"
                    :btns="[
                      { title: '编辑', method: 'edit' },
                      { title: '删除', method: 'delete' },
                      {
                        title: '上移',
                        method: 'moveupPreArchivingTable',
                        disabled: !row.canMoveUp
                      },
                      {
                        title: '下移',
                        method: 'movedownPreArchivingTable',
                        disabled: !row.canMoveDown
                      }
                    ]"
                    @edit="changeRow"
                    @moveupPreArchivingTable="moveupPreArchivingTable"
                    @movedownPreArchivingTable="movedownPreArchivingTable"
                    @delete="deleteArchiveCatalogueTree"
                  />
                  <!-- <div class="table-btn">
                    <el-link type="primary" @click="changeRow(row)"
                      >编辑</el-link
                    >
                    <el-link
                      type="danger"
                      @click="deleteArchiveCatalogueTree(row)"
                      >删除</el-link
                    >
                    <el-dropdown
                      @command="handleCommand($event, row)"
                      trigger="click"
                    >
                      <el-link type="primary">更多</el-link>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          command="moveUp"
                          :disabled="!row.canMoveUp"
                          >上移</el-dropdown-item
                        >
                        <el-dropdown-item
                          command="moveDown"
                          :disabled="!row.canMoveDown"
                          >下移</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <el-dialog
      v-if="showDialog"
      :visible.sync="showDialog"
      width="500px"
      :title="title"
      v-draggable
      :close-on-click-modal="false"
    >
      <el-form ref="addForm" :rules="rules" :model="addData" label-width="100px">
        <template v-if="isAdd">
          <!-- <el-form-item label="添加方式">
            <el-radio v-model="addData.mode" :label="0">添加子节点</el-radio>
            <el-radio v-model="addData.mode" :label="1">添加根节点</el-radio>
          </el-form-item> -->
          <el-form-item label="选中的节点">
            <el-input v-model="selectionNode.nodeName" disabled />
          </el-form-item>
        </template>

        <el-form-item label="节点名称" prop="nodeName">
          <el-input
            v-model="addData.nodeName"
            :disabled="isSHow"
            placeholder="请输入节点名称"
          />
        </el-form-item>
        <el-form-item label="节点编码" prop="code">
          <el-input
            v-model="addData.code"
            :disabled="isSHow"
            placeholder="请输入节点名称"
          />
        </el-form-item>
        <el-form-item label="更新人" prop="updateUserName">
          <el-input v-model="addData.updateUserName" disabled placeholder="更新人" />
        </el-form-item>
        <el-form-item label="更新时间" prop="updateDate">
          <el-input v-model="addData.updateDate" disabled placeholder="更新时间" />
        </el-form-item>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="showDialog = false">{{ isSHow ? "关闭" : "取消" }}</el-button>
        <el-button v-if="!isSHow" type="primary" @click="handelDialogConfirm"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      class="dialog-body-np"
      title="责任单位"
      :visible.sync="modalShow"
      append-to-body
      width="800px"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <CorSelect v-if="modalShow" @childEvt="modalEvt" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getArchiveCatalogueManagerTree,
  archiveCatalogueTreeFindList,
  saveArchiveCatalogueTree,
  deleteArchiveCatalogueTree,
  updateArchiveCatalogueTree,
  movedownPreArchivingTable,
  moveupPreArchivingTable
} from "@/api/archives.js";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";

import CorSelect from "@/components/CorSelect/index";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import DragLine from "../shared_component/DragLine";
import ListButton from "@/components/ListButton";

export default {
  name: "archival-catalogue",
  components: {
    TreeTableLayout,
    CorSelect,
    DragLine,
    ListButton
  },
  computed: {
    ...mapGetters(["loginInfo"])
  },
  data() {
    return {
      queryTree: null,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "nodeName"
      },
      searchData: {
        id: "",
        total: 0,
        current: 1,
        pageSize: 20,
        size: 20, //组件有问题,仅当watch 仅当size不为undefined时才会触发
        startDate: null,
        endDate: null
      },
      tableData: [],
      showDialog: false,
      addData: { mode: 1, isFile: 0, unitType: "", unitName: "" },
      selectionNode: {},
      title: "",
      rules: {
        nodeName: {
          required: true,
          message: "请输入节点名称",
          trigger: "blur"
        },
        code: {
          required: true,
          message: "请输入节点编码",
          trigger: "blur"
        }
      },
      isAdd: false,
      isSHow: false,
      date: [],
      modalShow: false,
      treeWidth: 267,
      // 上传表单相关
      uploadFormVisible: false,
      currentUploadNode: {}
    };
  },
  watch: {
    queryTree(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    dateFormat,
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    async getTreeData() {
      const res = await this.getArchiveCatalogueManagerTree();
      if (res?.length > 0) {
        this.treeData = res;
        const defaultNode = res[0];
        this.selectionNode = defaultNode;
        this.$nextTick(() => {
          const node = this.$refs.tree.getNode(defaultNode.id);
          this.$refs.tree.setCurrentNode(node.data);
          this.archiveCatalogueTreeFindList();
        });
      } else {
        this.treeData = [];
      }
    },
    async reGetTreeData() {
      const res = await this.getArchiveCatalogueManagerTree();
      if (res?.length > 0) {
        this.$nextTick(() => {
          const node = this.$refs.tree.getNode(this.selectionNode.id);
          this.selectionNode = node.data;
          this.$refs.tree.setCurrentNode(node.data);
          this.archiveCatalogueTreeFindList();
        });
      } else {
        this.treeData = [];
        this.selectionNode = {};
      }
    },
    async getArchiveCatalogueManagerTree() {
      try {
        const { data, success, message } = await getArchiveCatalogueManagerTree();

        if (!success) {
          this.$message.error("获取文件目录树失败：" + message);
          return false;
        }
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
      this.archiveCatalogueTreeFindList();
    },

    handelResetButtonClick() {
      this.date = [];
      this.searchData = {
        current: 1,
        pageSize: 20,
        size: 20
      };
      this.archiveCatalogueTreeFindList();
    },
    handelNodeClick(data, node, own) {
      this.selectionNode = data;
      this.searchData.id = data.id;
      this.searchData.current = 1;
      this.archiveCatalogueTreeFindList();
    },
    async archiveCatalogueTreeFindList() {
      try {
        const searchData = { ...this.searchData, entity: {} };
        if (this.date?.length > 0) {
          searchData.entity.startDate = this.date[0];
          searchData.entity.endDate = this.date[1];
        } else {
          searchData.entity.startDate = null;
          searchData.entity.endDate = null;
        }
        searchData.entity.id = this.selectionNode.id;
        searchData.entity.updateUserName = this.searchData.updateUserName;
        searchData.entity.nodeName = this.searchData.nodeName;
        this.tableData = [];
        const res = await archiveCatalogueTreeFindList(searchData);

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
    // 点击添加按钮
    addDialog() {
      this.title = "新增";
      this.showDialog = true;
      this.isAdd = true;
      this.isSHow = false;
      // this.$refs["addForm"] ? this.$refs["addForm"].resetFields() : "";
      this.addData = {
        mode: 0,
        nodeName: "",
        code: "",
        isFile: 0,
        updateUserName: this.loginInfo.username,
        updateDate: this.dateFormat(new Date()),
        updateUser: this.loginInfo.userId,
        unitType: this.selectionNode.unitType || "",
        unitName: this.selectionNode.unitName || ""
      };
    },
    // 添加节点
    async saveArchiveCatalogueTree() {
      if (!this.selectionNode) {
        this.$message.error("请先选择左侧节点！");
        return;
      }
      try {
        if (this.addData.mode === 1) {
          // 添加根节点
          this.addData.pid = 0;
        } else {
          this.addData.pid = this.selectionNode.id;
        }
        console.log("新增节点", this.addData);
        const { data, success, message } = await saveArchiveCatalogueTree(this.addData);

        if (!success) {
          this.$message.error("添加失败：" + message);
          return false;
        }
        this.reGetTreeData();
        this.showDialog = false;
        return true;
      } catch (err) {
        console.error(err);
        this.$message.error("添加失败");
        return false;
      }
    },
    // 切换一页有多少条数据
    handelPageSizeChange(page) {
      this.searchData.current = 1;
      this.searchData.pageSize = page.pageSize;
      this.searchData.size = page.pageSize;
      this.archiveCatalogueTreeFindList();
    },
    // 切换页数
    handelCurrentChange(page) {
      this.searchData.current = page.current;
      this.archiveCatalogueTreeFindList();
    },
    async updateArchiveCatalogueTree() {
      try {
        const { data, success, message } = await updateArchiveCatalogueTree({
          nodeName: this.addData.nodeName,
          code: this.addData.code,
          isFile: this.addData.isFile,
          id: this.addData.id,
          pid: this.addData.pid,
          unitType: this.addData.unitType,
          unitName: this.addData.unitName
        });
        if (!success) {
          this.$message.error("修改失败：" + message);
          return false;
        }
        this.$message.success("修改成功");
        this.showDialog = false;
        this.reGetTreeData();

        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("修改失败");
        return false;
      }
    },
    // 点击查看节点
    showRow(row) {
      this.title = "详情";
      this.addData = row;
      this.addData.isFile = this.addData.isFile ? parseInt(this.addData.isFile) : 0;
      this.addData.updateDate = this.dateFormat(this.addData.updateDate);

      this.isAdd = false;
      this.isSHow = true;
      this.showDialog = true;
    },
    // 关闭dialog
    handelDialogConfirm() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            // 添加
            this.saveArchiveCatalogueTree();
          } else if (!this.isAdd && !this.isSHow) {
            // 编辑
            this.updateArchiveCatalogueTree();
          } else {
            // 查看
            this.showDialog = false;
          }
        }
      });
    },
    // 点击编辑按钮
    changeRow(row) {
      this.addData = JSON.parse(JSON.stringify(row));
      this.addData.isFile = this.addData.isFile ? parseInt(this.addData.isFile) : 0;
      this.addData.updateDate = this.dateFormat(this.addData.updateDate);

      this.showDialog = true;
      this.title = "编辑";
      this.isAdd = false;
      this.isSHow = false;
    },
    beforeDelete() {
      return this.$confirm("是否要删除这条数据 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
    },
    // 删除数据
    async deleteArchiveCatalogueTree(row) {
      try {
        // await this.beforeDelete();
        const { data, success, message } = await deleteArchiveCatalogueTree(row);
        if (!success) {
          this.$message.error("删除失败：" + message);
          return false;
        }
        this.$message.success("删除成功!");
        const newTotal = this.searchData.total - 1;
        // 计算删除后的最大页数
        const maxPage = Math.ceil(newTotal / this.searchData.pageSize) || 1;
        // 如果当前页大于最大页，回退到最大页
        if (this.searchData.current > maxPage) {
          this.searchData.current = maxPage;
        }
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
    async movedownPreArchivingTable(row) {
      try {
        const { data, success, message } = await movedownPreArchivingTable(row.id);
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
    async moveupPreArchivingTable(row) {
      try {
        const { data, success, message } = await moveupPreArchivingTable(row.id);
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
    handelCreateCorpClick() {
      if (!this.isSHow) {
        this.modalShow = true;
      }
    },
    modalEvt({ data }) {
      this.modalShow = false;
      this.addData.unitName = (data || []).map((item) => item.corpName).join(",");
      this.addData.unitType = (data || []).map((item) => item.corpId).join(",");
      this.$refs.addForm.validateField("unitName");
    },
    modalEvtCancel() {
      this.modalShow = false;
    },
    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX;
    },
    // 上传文件
    uploadFile(row) {
      this.currentUploadNode = row;
      this.uploadFormVisible = true;
    },
    // 上传成功回调
    handleUploadSuccess() {
      this.$message.success("文件上传成功");
      this.archiveCatalogueTreeFindList();
    },
    handleCommand(command, row) {
      switch (command) {
        case "moveUp":
          this.moveupPreArchivingTable(row);
          break;
        case "moveDown":
          this.movedownPreArchivingTable(row);
          break;
        case "delete":
          this.deleteArchiveCatalogueTree(row);
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page-archival-catalogue {
  height: 100%;
  overflow: hidden;
  color: #fff;
  .content {
    width: 100%;
    display: flex;
    gap: 16px;
    height: 100%;
    .left-content {
      height: 100%;
      position: relative;
      /deep/ .el-tree-node__content {
        .custom-tree-node {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
      //   resize: horizontal;
    }
    .table-wrapper {
      flex: 1;
      width: 0;
    }
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
    display: flex; /* 使用flex布局 */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中（如果需要） */
    gap: 10px; /* 按钮之间的间距，可以根据需要调整 */
  }
}
</style>
