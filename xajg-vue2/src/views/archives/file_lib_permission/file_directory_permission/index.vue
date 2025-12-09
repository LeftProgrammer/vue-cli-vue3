<template>
  <div class="page-file-directory-permission">
    <TreeTableLayout
      :page="searchData"
      @pageSizeChange="handelPageSizeChange"
      @pagepageNumChange="handelCurrentChange"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
      title="节点列表"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="人员">
            <UserSelectInput v-model="searchData.userId" placeholder="请选择" />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="selectionNode.nodeId"
          @click="addDialog"
          >新增</el-button
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
                    :class="
                      data.children.length > 0
                        ? 'el-icon-folder-opened'
                        : 'el-icon-folder'
                    "
                  />
                  <span>{{ data.nodeName }}</span>
                </span>
              </el-tree>
            </div>
            <DragLine @moveEnd="handelMoveEnd" :minMoveX="0"></DragLine>
          </div>

          <div class="table-wrapper">
            <el-table :data="tableData" stripe height="100%" border>
              <el-table-column
                prop="userName"
                label="人员"
                show-overflow-tooltip
              />
              <el-table-column prop="docPermissionName" label="文件权限" />
              <el-table-column label="管理权限">
                <template #default="{ row }">
                  {{ row.treePermission ? "是" : "否" }}
                </template>
              </el-table-column>
              <el-table-column prop="treeExtendPermission" label="继承">
                <template #default="{ row }">
                  {{ row.treeExtendPermission ? "是" : "否" }}
                </template>
              </el-table-column>
              <el-table-column prop="updateDate" label="创建时间">
                <template #default="{ row }">
                  {{ dateFormat(row.createTime) }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="200"
                fixed="right"
              >
                <template #default="{ row }">
                  <div class="table-btn">
                    <el-button type="text" @click="editRow(row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="text"
                      @click="deleteFileStorePermission(row)"
                      >删除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <el-dialog :visible.sync="showDialog" width="500px" title="权限维护">
      <el-form
        ref="addForm"
        :rules="rules"
        :model="addDialogFormData"
        label-width="100px"
      >
        <el-form-item
          label="人员"
          prop="userIdList"
          v-if="!addDialogFormData.id"
        >
          <UserSelectInput
            v-model="addDialogFormData.userIdList"
            placeholder="请选择"
            multiple
          />
        </el-form-item>
        <el-form-item label="文件权限" prop="docPermission">
          <el-select
            v-model="addDialogFormData.docPermission"
            multiple
            placeholder="请选择"
            style="width: 100%"
            @remove-tag="handelRemoveTag"
          >
            <el-option
              v-for="item in docPermissionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理权限" prop="treePermission">
          <el-radio-group v-model="addDialogFormData.treePermission">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="继承" prop="isFileNode">
          <el-radio-group v-model="addDialogFormData.treeExtendPermission">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="handelDialogClose">关 闭</el-button>
        <el-button type="primary" @click="handelDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArchiveFileCatalogueManagerTree,
  getSelectFileStorePermission,
  addFileStorePermission,
  deleteFileStorePermission,
  updateFileStorePermission,
  getFilePermissionList,
} from "@/api/archives.js";
import UserSelectInput from "@/components/UserSelectInput/index.vue";
import { dateFormat } from "@/utils";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import DragLine from "../../shared_component/DragLine";

export default {
  name: "FileDirectoryPermission",
  components: {
    TreeTableLayout,
    UserSelectInput,
    DragLine,
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "nodeName",
      },
      docPermissionOptions: [],
      searchData: {
        nodeId: "",
        total: 0,
        pageNum: 1,
        pageSize: 20,
        userId: "",
      },
      tableData: [],
      showDialog: false,
      addDialogFormData: {
        docPermission: [3],
        nodeId: 0,
        treeExtendPermission: 0,
        treePermission: 0,
        userIdList: [],
      },
      selectionNode: {},
      rules: {
        userIdList: {
          required: true,
          message: "请选择节点名称",
          trigger: "change",
          type: "array",
        },
        docPermission: {
          required: true,
          message: "请选择文件权限",
          trigger: "change",
          type: "array",
        },
      },
      treeWidth: 267,
    };
  },
  mounted() {
    this.getTree();
    this.getFilePermissionList();
  },
  methods: {
    dateFormat,
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    async getTree() {
      const res = await this.getArchiveFileCatalogueManagerTree();
      if (res?.length > 0) {
        const defaultNode = res[0];
        this.searchData.nodeId = defaultNode.id;
        this.selectionNode = defaultNode;
        this.$nextTick(() => {
          const node = this.$refs.tree.getNode(defaultNode.id);
          this.$refs.tree.setCurrentNode(node.data);
          this.getSelectFileStorePermission();
        });
      } else {
        this.treeData = [];
      }
    },
    async getArchiveFileCatalogueManagerTree() {
      try {
        const { data, success, message } =
          await getArchiveFileCatalogueManagerTree();
        if (!success) {
          this.$message.error("获取文件鉴定日期目录树失败：" + message);
          return false;
        }
        this.treeData = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件鉴定日期目录树失败");
        return false;
      }
    },
    // 点击搜索按按钮
    handelSearchButtonClick() {
      this.searchData.pageNum = 1;
      this.getSelectFileStorePermission();
    },
    // 查表格数据
    async getSelectFileStorePermission() {
      this.tableData = [];
      try {
        const { data, success, message } = await getSelectFileStorePermission(
          this.searchData
        );

        if (!success) {
          this.$message.error("查询表格数据失败：" + message);
          return false;
        }
        this.tableData = data.records || [];
        this.searchData.total = data.total;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询表格数据失败");
        return false;
      }
    },
    async getFilePermissionList() {
      try {
        const { data, success, message } = await getFilePermissionList();
        if (!success) {
          this.$message.error("查询文件库权限下拉列表失败：" + message);
          return false;
        }
        this.docPermissionOptions = Object.keys(data).reduce((prev, key) => {
          prev.push({
            value: ~~key,
            label: data[key],
            disabled: key === "3",
          });
          return prev;
        }, []);
      } catch (err) {
        console.error(err);
        this.$message.error("查询文件库权限下拉列表失败");
        return false;
      }
    },
    handelRemoveTag(val) {
      if (val === 3) {
        // 不能删除查询权限
        this.addDialogFormData.docPermission.unshift(3);
      }
    },
    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.searchData = metaData.searchData;
      this.searchData.nodeId = this.selectionNode.id;
      this.getSelectFileStorePermission();
    },
    // 点击左侧树形节点，查询表格数据
    handelNodeClick(data) {
      this.selectionNode = data;
      this.searchData.nodeId = data.id;
      this.searchData.pageNum = 1;
      this.getSelectFileStorePermission();
    },
    // 点击添加按钮
    addDialog() {
      this.showDialog = true;
      const metaData = this.$options.data();
      this.addDialogFormData = metaData.addDialogFormData;
      this.addDialogFormData.nodeId = this.selectionNode.id;
    },
    beforeSubmit(name) {
      let res = true;
      this.$refs[name].validate((valid) => {
        if (!valid) {
          res = false;
        }
      });
      return res;
    },
    async addFileStorePermission() {
      if (!this.selectionNode) {
        this.$message.error("请先选择左侧节点！");
        return;
      }
      try {
        const { data, success, message } = await addFileStorePermission(
          this.addDialogFormData
        );

        if (!success) {
          this.$message.error("添加失败：" + message);
          return false;
        }
        return true;
      } catch (err) {
        console.error(err);
        this.$message.error("添加失败");
        return false;
      }
    },
    handelPageSizeChange(page) {
      this.searchData.pageNum = 1;
      this.searchData.pageSize = page.pageSize;
      this.getSelectFileStorePermission(this.selectionNode.id);
    },
    // 切换页数
    handelCurrentChange(page) {
      this.searchData.pageNum = page.current;
      this.getSelectFileStorePermission(this.selectionNode.id);
    },
    // 点击编辑按钮
    editRow(row) {
      const data = structuredClone(row);
      data.docPermission = data.docPermissionList;
      this.addDialogFormData = data;
      this.showDialog = true;
    },
    async updateFileStorePermission() {
      try {
        const { data, success, message } = await updateFileStorePermission(
          this.addDialogFormData
        );
        if (!success) {
          this.$message.error("修改失败：" + message);
          return false;
        }
        this.$message.success("修改成功");

        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("修改失败");
        return false;
      }
    },
    handelDialogClose() {
      this.showDialog = false;
      this.$refs.addForm.resetFields();
    },
    async handelDialogConfirm() {
      if (!this.beforeSubmit("addForm")) return;
      let res;
      if (this.addDialogFormData.id) {
        // 编辑
        res = await this.updateFileStorePermission();
      } else {
        // 添加
        res = await this.addFileStorePermission();
      }
      if (res) {
        this.showDialog = false;
        this.getSelectFileStorePermission();
        this.$refs.addForm.resetFields();
      }
    },

    beforeDelete() {
      return this.$confirm("是否要删除这条数据 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
    },
    // 删除数据
    async deleteFileStorePermission(row) {
      try {
        await this.beforeDelete();
        const { data, success, message } = await deleteFileStorePermission({
          id: row.id,
        });
        if (!success) {
          this.$message.error("删除失败：" + message);
          return false;
        }
        this.$message.success("删除成功!");
        this.getSelectFileStorePermission(this.selectionNode.id);
        return true;
      } catch (error) {
        console.error(error);
        if (error !== "cancel") {
          this.$message.error("删除失败");
        }
        return false;
      }
    },
    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX;
    },
  },
};
</script>

<style scoped lang="scss">
.page-file-directory-permission {
  height: 100%;
  overflow: hidden;
  color: #fff;
  .content {
    width: 100%;
    display: flex;
    height: 100%;
    .left-content {
      //   width: 267px;
      height: 100%;
      position: relative;
      &:hover {
        .drag-line {
          width: 5px;
          background-color: #e4e1e1;
        }
      }
    }
    .tree-wrapper {
      //   width: 267px;
      height: 100%;
      overflow-y: auto;
      //   resize: horizontal;
      //   min-width: 267px;
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
  .main {
    float: right;
    width: calc(100% - 289px);
    height: 100%;
    overflow: auto;
    padding: 20px 20px 20px 0;
    .table-btn {
      button[type="button"] {
        padding: 0px !important;
      }
    }
  }
}
</style>
