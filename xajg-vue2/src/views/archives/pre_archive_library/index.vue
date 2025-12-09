<template>
  <div class="page-catalogue">
    <TreeTableLayout
      :page="searchData"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
      title="档案目录"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="文件编号">
            <el-input v-model="searchData.code" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="文件题名">
            <el-input v-model="searchData.fileName" clearable placeholder="请输入" />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!selectionNode.id"
          @click="handleAdd"
          :loading="addButtonLoading"
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
                <template #default="{ data }">
                  <span class="custom-tree-node" :title="data.nodeName">
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
                </template>
              </el-tree>
            </div>
            <!-- <DragLine @moveEnd="handelMoveEnd" :minMoveX="0"></DragLine> -->
          </div>

          <div class="table-wrapper">
            <el-table
              :data="tableData"
              height="100%"
              stripe
              border
              @selection-change="handleTableSelectionChange"
            >
              <!-- <el-table-column type="selection" width="55" /> -->
              <el-table-column label="序号" align="center" width="54">
                <template #default="{ $index }">
                  {{ $index + 1 + (searchData.current - 1) * searchData.pageSize }}
                </template>
              </el-table-column>

              <el-table-column
                prop="fileName"
                show-overflow-tooltip
                label="文件题名"
                min-width="400"
                header-align="center"
                align="left"
              >
                <template #default="{ row }">
                  <el-link type="primary" :underline="false" @click="showRow(row)">{{
                    row.fileName
                  }}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="code"
                show-overflow-tooltip
                label="文件编号"
                width="120"
                align="center"
              />

              <el-table-column
                prop="createDate"
                label="形成日期"
                align="center"
                width="120"
              >
                <template #default="{ row }">
                  {{ dateFormat(row.createDate) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="uploadDate"
                label="上传日期"
                align="center"
                width="120"
              >
                <template #default="{ row }">
                  {{ dateFormat(row.uploadDate) }}
                </template>
              </el-table-column>

              <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="180"
                fixed="right"
              >
                <template #default="{ row }">
                  <!-- <div class="table-btn">
                    <el-link type="primary" @click="changeRow(row)"
                      >编辑</el-link
                    >
                    <el-link type="primary" @click="downloadFile(row)"
                      >下载</el-link
                    >
                    <el-link type="danger" @click="deleteArchiveFile(row)"
                      >删除</el-link
                    >
                  </div> -->
                  <list-button
                    :data="row"
                    :btns="[
                      { title: '编辑', method: 'edit' },
                      {
                        title: '下载',
                        method: 'downloadFile'
                      },
                      { title: '删除', method: 'delete' }
                    ]"
                    @edit="changeRow"
                    @downloadFile="downloadFile"
                    @delete="deleteArchiveFile"
                  />
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
      :title="title"
      width="30%"
      :close-on-click-modal="false"
      append-to-body
      v-draggable
    >
      <el-form ref="addForm" :rules="rulesAdd" :model="addData" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="文件编号" prop="code">
              <el-input v-model="addData.code" :disabled="isSHow" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件题名" prop="fileName">
              <el-input
                v-model="addData.fileName"
                :disabled="isSHow"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属节点" prop="nodeId">
              <el-select
                :disabled="isSHow"
                v-model="addData.nodeName"
                placeholder="请选择节点"
                class="w-100pre"
                popper-class="tree-select"
                ref="treeSelectDropdown"
              >
                <el-option value="" style="height: auto; padding: 0">
                  <el-tree
                    :disabled="isSHow"
                    ref="treeSelect"
                    :data="treeData"
                    :props="defaultProps"
                    default-expand-all
                    node-key="id"
                    @node-click.stop.native="handleTreeNodeSelect"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                  >
                    <span
                      class="custom-tree-node"
                      slot-scope="{ node, data }"
                      @click.stop="handleOptionClick(data)"
                    >
                      <span>{{ data.nodeName }}</span>
                    </span>
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input
                v-model="addData.remarks"
                type="textarea"
                rows="3"
                placeholder="请输入"
                :disabled="isSHow"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="附件">
            <uploadFile
              v-model="addData.fileId"
              :readonly="isSHow"
              :limit="1"
              :maxSize="50"
              @change="handleFileChange"
            ></uploadFile>
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="showDialog = false">{{ isSHow ? "关闭" : "取消" }}</el-button>
        <el-button type="primary" @click="closeDialog" v-if="!isSHow">确定</el-button>
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
      v-draggable
    >
      <CorSelect v-if="modalShow" single @childEvt="modalEvt" />
    </el-dialog>
    <el-dialog
      title="流程处理表单"
      custom-class="wbench-el-dialog flow-dialog"
      :visible.sync="flowShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      center
      fullscreen
      @closed="handleClosed"
      :before-close="beforeClosedDialog"
      v-draggable
    >
      <SzgcProcessGetor
        ref="SzgcProcessGetor"
        v-if="flowShow"
        :top-show="false"
        :page="detailStatus"
        :dataAll="dataAll"
        @childEvt="childEvtHandle"
      ></SzgcProcessGetor>
    </el-dialog>
    <el-dialog
      title="变更节点"
      :visible.sync="treeDialog"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-draggable
    >
      <div class="tree-dialog-wrapper">
        <el-tree
          ref="dialogTree"
          :highlight-current="true"
          class="tree"
          :data="treeData"
          :props="defaultProps"
          default-expand-all
          @node-click="handelTreeDialogNodeClick"
          node-key="id"
          :expand-on-click-node="false"
          v-if="treeDialog"
        >
          <template #default="{ data }">
            <span class="custom-tree-node">
              <i
                style="color: #014acb"
                :class="
                  data.children.length > 0 ? 'el-icon-folder-opened' : 'el-icon-folder'
                "
              />
              <span>{{ data.nodeName }}</span>
            </span>
          </template>
        </el-tree>
      </div>

      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="treeDialog = false">关 闭</el-button>
        <el-button type="primary" @click="handleClosedTreeDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArchiveCatalogueManagerTree,
  getSelectArchiveFileList,
  getArchiveFileAttDetail,
  deleteArchiveFile,
  getArchiveFileDetail,
  addFileAttachment,
  deleteFileAttachment,
  updateArchiveFile,
  saveArchiveFile,
  moveUpFileAttachment,
  moveDownFileAttachment,
  fileAuthenticate,
  getFlowConfigs,
  fileSubmit,
  getFileStorePermissionByLoginUser,
  batchUpdateNode
} from "@/api/archives.js";
import { SzgcProcessGetor } from "@szgc/wbench";

import CorSelect from "@/components/CorSelect/index";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import DragLine from "../shared_component/DragLine";
import { defineComponent } from "vue";
import { getFile, getFileById, getFilePath, getYljoaFileStream } from "@/api/user.js";
import ListButton from "@/components/ListButton";

const Catalogue = defineComponent({
  name: "preArchiveLibrary",
  components: {
    CorSelect,
    TreeTableLayout,
    SzgcProcessGetor,
    DragLine,
    ListButton
  },
  computed: {
    ...mapGetters(["loginInfo"]),
    dialogReadonly() {
      return this.isAdd === false && this.isSHow === true;
    },
    computedDeleteDisabled() {
      return (
        this.tableMultipleSelection.length === 0 ||
        this.tableMultipleSelection.some(
          (item) => item.status === 6 || item.status === 7 || !item.permssionMap[1]
        )
      );
    },
    computedIdentifyDisabled() {
      return (
        this.tableMultipleSelection.length === 0 ||
        this.tableMultipleSelection.some(
          (item) => item.status !== 1 && item.status !== 4 && item.status !== 5
        )
      );
    }
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
        total: 0,
        current: 1,
        pageSize: 20,
        fileName: "",
        code: ""
      },
      tableData: [],
      showDialog: false,
      addData: { mode: 1 },
      selectionNode: {},
      title: "",
      rulesAdd: {
        code: {
          required: true,
          message: "请输入文号",
          trigger: "change"
        },

        fileName: {
          required: true,
          message: "请输入文件名",
          trigger: "change"
        },
        nodeId: {
          required: true,
          message: "请选择节点",
          trigger: "change"
        }
      },
      isAdd: false,
      isSHow: false,
      fileInfo: {
        name: "",
        url: "",
        fileId: ""
      },
      fileList: [],
      statusList: [
        { dictId: 1, dictName: "待鉴定" },
        { dictId: 2, dictName: "鉴定中" },
        { dictId: 3, dictName: "整改中" },
        { dictId: 4, dictName: "待组卷" },
        { dictId: 5, dictName: "无需归档" },
        { dictId: 6, dictName: "已组卷" },
        { dictId: 7, dictName: "已归档" }
      ],
      statusListMap: {
        1: "待鉴定",
        2: "鉴定中",
        3: "整改中",
        4: "待组卷",
        5: "无需归档",
        6: "已组卷",
        7: "已归档"
      },
      modalShow: false,
      editRow: null,
      flowShow: false,
      flowInfo: {
        businessId: "",
        status: false
      },
      detailStatus: "mine",
      dataAll: {
        businessId: "",
        taskId: ""
      },
      packageId: "1224376020367310848",
      flowPageType: "mine",
      addButtonLoading: false,
      flowConfigList: [],
      treeDialog: false,
      treeDialogSelectNode: {},
      tableMultipleSelection: [],
      treeWidth: 267,
      showNodeEditDialog: false,
      editNodeData: {
        nodeId: "",
        nodeName: ""
      },
      editNodeDataRules: {
        nodeName: {
          required: true,
          message: "请选择所属节点",
          trigger: "change"
        }
      }
    };
  },
  watch: {
    queryTree(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getTreeData();
  },
  mounted() {},
  methods: {
    dateFormat,
    handleFileChange(value) {
      if (value) {
        this.$refs.addForm?.clearValidate("file");
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.nodeName.indexOf(value) !== -1;
    },
    // 查询左边目录树
    async getTreeData() {
      const res = await this.getArchiveFileCatalogueTree();
      if (res?.length > 0) {
        // 默认查询所有 修复禅道bug: #7981
        const defaultNode = res[0];
        this.searchData.nodeId = defaultNode.id;
        this.selectionNode = defaultNode;
        this.$nextTick(() => {
          const node = this.$refs.tree.getNode(defaultNode.id);
          this.$refs.tree.setCurrentNode(node.data);
          this.getSelectArchiveFileList();
        });
      }
    },
    getFirstLeafNode(list) {
      if (Array.isArray(list)) {
        if (Array.isArray(list[0].children) && list[0].children.length > 0) {
          return this.getFirstLeafNode(list[0].children);
        } else {
          return list[0];
        }
      } else {
        return list;
      }
    },
    async getArchiveFileCatalogueTree() {
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
    handelSearchButtonClick() {
      this.searchData.current = 1;
      this.searchData.nodeId = "";
      this.getSelectArchiveFileList();
    },
    handelResetButtonClick() {
      this.searchData = {
        current: 1,
        pageSize: 20,
        fileName: "",
        total: 0,
        code: "",
        nodeId: this.selectionNode.id,
        entity: {
          fileName: "",
          code: "",
          nodeId: this.selectionNode.id
        }
      };
      this.$nextTick(() => {
        this.getSelectArchiveFileList();
      });
    },
    // 查表格数据
    async getSelectArchiveFileList() {
      try {
        const searchData = {
          entity: {
            nodeId: this.selectionNode.id,
            fileName: this.searchData.fileName,
            code: this.searchData.code
          },
          current: this.searchData.current,
          pageSize: this.searchData.pageSize
        };
        const { data, success, message } = await getSelectArchiveFileList(searchData);
        if (!success) {
          this.$message.error("查询档案表格数据失败：" + message);
          return false;
        }
        this.tableData = [];
        data.records.forEach((item) => {
          this.tableData.push(item);
        });
        this.searchData.total = data.total;
        this.tableMultipleSelection = [];
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询表格数据失败");
        return false;
      }
    },
    // 点击左侧树形节点，查询表格数据
    async handelNodeClick(data, node, own) {
      this.selectionNode = data;
      this.searchData.nodeId = this.selectionNode.id;
      this.searchData.current = 1;
      this.getSelectArchiveFileList();
    },
    // 查表格数据
    async getFileStorePermissionByLoginUser(nodeId) {
      try {
        const { data, success, message } = await getFileStorePermissionByLoginUser({
          nodeId
        });

        if (!success) {
          this.$message.error("获取文件库权限失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件库权限失败");
        return false;
      }
    },
    handelPageSizeChange(page) {
      this.searchData.current = 1;
      this.searchData.pageSize = page.pageSize;
      this.getSelectArchiveFileList();
    },
    handelCurrentChange(page) {
      this.searchData.current = page.current;
      this.getSelectArchiveFileList();
    },
    // 修改
    async updateArchiveFile() {
      try {
        const { data, success, message } = await updateArchiveFile(this.addData);
        if (!success) {
          this.$message.error("修改文件基本信息失败：" + message);
          return false;
        }
        this.$message.success("修改成功");
        this.showDialog = false;
        this.getSelectArchiveFileList();
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("修改文件基本信息失败");
        return false;
      }
    },
    // 点击查看
    async showRow(row) {
      const res = await this.getArchiveFileDetail(row.id);
      if (res) {
        this.addData = res;
        this.addData.uploadDate = this.dateFormat(res.uploadDate);
        this.addData.createDate = this.dateFormat(res.createDate);
        this.title = "详情";
        this.isAdd = false;
        this.isSHow = true;
        this.showDialog = true;
      }
    },
    async fileAuthenticate(fileId, identifyResult, identifyMessage = "") {
      try {
        const { data, success, message } = await fileAuthenticate({
          fileId: fileId,
          identifyMessage,
          identifyResult: identifyResult
        });
        if (!success) {
          this.$message.error("文件鉴定失败：" + message);
          return false;
        }
        this.$message.success("文件鉴定成功");
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("文件鉴定失败");
        return false;
      }
    },
    async handleCommand(command) {
      let identifyMessage = "";
      try {
        if (command === 2) {
          // 退回必填意见
          const inputRes = await this.$prompt("请输入意见", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValidator: function (val) {
              if (val && val.trim()) {
                return true;
              } else {
                return "请输入意见";
              }
            },
            inputErrorMessage: "请输入意见"
          });
          identifyMessage = inputRes.value.trim();
        }
        const res = await this.fileAuthenticate(
          this.tableMultipleSelection.map((item) => item.id).join(),
          command,
          identifyMessage
        );
        if (res) {
          this.getSelectArchiveFileList();
        }
      } catch (error) {
        console.error(error);
      }
    },
    handelCreateCorpClick() {
      if (!this.dialogReadonly) {
        this.varName = "";
        this.modalShow = true;
      }
    },
    // 关闭dialog
    closeDialog() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (!this.isAdd && !this.isSHow) {
            // 编辑文档
            this.updateArchiveFile();
          } else {
            this.saveArchiveFile();
          }
        }
      });
    },
    async saveArchiveFile() {
      try {
        const { data, success, message } = await saveArchiveFile(this.addData);
        if (!success) {
          this.$message.error("新增文件失败：" + message);
          return false;
        }
        this.$message.success("新增文件成功!");
        this.showDialog = false;
        this.getSelectArchiveFileList();
        return true;
      } catch (error) {
        console.error(error);
        if (error !== "cancel") {
          this.$message.error("新增文件失败");
        }
        return false;
      }
    },
    // 查询文件详情
    async getArchiveFileDetail(id) {
      try {
        const { data, success, message } = await getArchiveFileDetail({
          id: id
        });

        if (!success) {
          this.$message.error("查询文件详情失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询文件详情失败");
        return false;
      }
    },
    // 查询附件列表
    async getArchiveFileAttDetail(id) {
      try {
        const { data, success, message } = await getArchiveFileAttDetail({
          id
        });

        if (!success) {
          this.$message.error("查询附件列表失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询附件列表失败");
        return false;
      }
    },
    // 点击编辑按钮
    async changeRow(row) {
      console.log(row);
      const res = await this.getArchiveFileDetail(row.id);
      if (res) {
        this.addData = res;
        this.addData.uploadDate = this.dateFormat(res.uploadDate);
        this.addData.createDate = this.dateFormat(res.createDate);
        this.showDialog = true;
        this.title = "编辑";
        this.isAdd = false;
        this.isSHow = false;
        this.treeVar = "addData";
      }
    },
    beforeDelete() {
      return this.$confirm("是否要删除选中数据 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
    },
    // 删除数据
    async deleteArchiveFile(row) {
      try {
        // await this.beforeDelete();
        const { data, success, message } = await deleteArchiveFile(row.id);
        if (!success) {
          this.$message.error("删除失败：" + message);
          return false;
        }
        this.$message.success("删除成功!");
        this.getSelectArchiveFileList();
        return true;
      } catch (error) {
        console.error(error);
        if (error !== "cancel") {
          this.$message.error("删除失败");
        }
        return false;
      }
    },

    // 删除一个文件
    async deleteFile(row) {
      const loading = this.$loading();
      try {
        const res = await this.deleteFileAttachment(row.id);
        if (res) {
          const res2 = await this.getArchiveFileAttDetail(this.addData.id);
          this.fileList = res2 || [];
        }
      } catch (error) {
        console.error(error);
      } finally {
        loading.close();
      }
    },
    async downloadFile(row) {
      if (!row.fileId) {
        this.$message.error("下载失败");
        return;
      }
      try {
        console.log(row);
        const fileId = JSON.parse(row.fileId);
        if (!fileId || !Array.isArray(fileId) || fileId.length === 0) {
          this.$message.error("下载失败");
          return;
        }
        console.log(fileId, "fileId");
        const res = await getFileById({ fileInfoId: fileId[0].fileId });
        if (res) {
          const blob = new Blob([res], {});
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = window.URL.createObjectURL(blob);
          link.setAttribute("download", fileId[0].name || "未命名文件");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          this.$message.error("获取下载链接失败");
        }
      } catch (error) {
        console.error(error);
        this.$message.error("下载文件出错");
      }
    },
    modalEvt({ data }) {
      this.modalShow = false;
      if (this.varName) {
        this.searchData[`${this.varName}Name`] = data.length ? data[0].corpName : "";
        this.searchData[`${this.varName}Id`] = data.length ? data[0].corpId : "";
      } else {
        this.addData.createCorpName = data.length ? data[0].corpName : "";
        this.addData.createCorpId = data.length ? data[0].corpId : "";
      }
    },
    beforeSubmit(name) {
      let res = true;
      this.$refs[name].validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      return res;
    },
    async moveUpFileAttachment(id) {
      try {
        const { data, success, message } = await moveUpFileAttachment({ id });
        if (!success) {
          this.$message.error("移动失败：" + message);
          return false;
        }
        this.$message.success("移动成功");
        // this.getSelectArchiveFileList();
        const res = await this.getArchiveFileAttDetail(this.addData.id);
        this.fileList = res || [];
        return true;
      } catch (error) {
        console.error(error);
        this.$message.error("移动失败");
        return false;
      }
    },
    // 向上移动一行
    async moveDownFileAttachment(id) {
      try {
        const { data, success, message } = await moveDownFileAttachment({ id });
        if (!success) {
          this.$message.error("移动失败：" + message);
          return false;
        }
        this.$message.success("移动成功");
        // this.getSelectArchiveFileList();
        const res = await this.getArchiveFileAttDetail(this.addData.id);
        this.fileList = res || [];
        return true;
      } catch (error) {
        console.error(error);
        this.$message.error("移动失败");
        return false;
      }
    },
    // 文件提交
    async fileSubmit(id) {
      try {
        const { data, success, message } = await fileSubmit({ id });
        if (!success) {
          this.$message.error("文件提交失败：" + message);
          return false;
        }
        this.$message.success("文件提交成功");
        this.getSelectArchiveFileList();
        return true;
      } catch (error) {
        console.error(error);
        this.$message.error("文件提交失败");
        return false;
      }
    },
    async getFlowConfigs() {
      try {
        this.addButtonLoading = true;
        const { data, success, message } = await getFlowConfigs({
          pacId: this.packageId
        });
        if (!success) {
          this.$message.error("获取流程配置失败：" + message);
          return false;
        }
        this.flowConfigList = data;
        if (Array.isArray(data) && data.length > 0) {
          this.dataAll = {
            businessId: data[0].flowConfigId,
            taskId: ""
          };
        }
        return data;
      } catch (error) {
        console.error(error);
        this.$message.error("获取流程配置失败");
        return false;
      } finally {
        this.addButtonLoading = false;
      }
    },
    async handleAdd() {
      if (!this.selectionNode.id) {
        this.$message.error("请选择目录");
        return;
      }

      this.title = "新增";
      this.addData = {
        nodeId: this.selectionNode.id,
        nodeName: this.selectionNode.nodeName,
        fileName: "",
        fileId: ""
      };
      this.isAdd = true;
      this.isSHow = false;
      this.showDialog = true;
    },
    handelChangeNode() {
      if (!this.isAdd && !this.isSHow) {
        // 编辑文档
        this.treeDialog = true;
        this.treeDialogSelectNode = {};
      }
    },
    handelTreeDialogNodeClick(data) {
      this.treeDialogSelectNode = data;
    },
    handleClosedTreeDialog() {
      if (this.treeDialogSelectNode.id) {
        this.addData.nodeId = this.treeDialogSelectNode.id;
        this.addData.nodeName = this.treeDialogSelectNode.nodeName;
        this.treeDialog = false;
      } else {
        this.$message.warning("未选择任何节点");
      }

      // this.$refs.dialogTree
    },
    beforeClosedDialog(done) {
      done();
    },
    handleClosed() {
      this.flowShow = false;
    },
    childEvtHandle() {
      this.flowShow = false;
      this.handelSearchButtonClick();
    },
    showRecord(businessId) {
      this.flowShow = true;
      this.dataAll.businessId = businessId;
      this.detailStatus = "fine";
      localStorage.setItem("catalogue_flow_readonly", "1");
    },
    isShowRecodBtn(row) {
      return row.status !== 3;
    },
    onClear() {
      this.searchData.createCorpName = "";
      this.searchData.createCorpId = "";
    },
    handleTableSelectionChange(val) {
      this.tableMultipleSelection = val;
    },
    handelShowCorpModel(name) {
      this.varName = name;
      this.modalShow = true;
    },
    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX;
    },
    async archiveFileStoreExport() {
      const params = {
        ...this.searchData
      };
      const searchParams = new URLSearchParams(params);
      window.open(`/api/archiveFileStore/download?${searchParams}`, "_blank");
    },
    async archiveFileStoreSelectExport() {
      const params = {
        idList: this.tableMultipleSelection
          .map((item) => item.id)
          .filter(Boolean)
          .join()
      };
      const searchParams = new URLSearchParams(params);
      window.open(`/api/archiveFileStore/selectDownload?${searchParams}`, "_blank");
    },
    handleExportCommand(command) {
      switch (command) {
        case 1:
          this.archiveFileStoreExport();
          break;
        case 2:
          this.archiveFileStoreSelectExport();
          break;
        default:
          break;
      }
    },
    handelEditSelection() {
      this.editNodeData = this.$options.data().editNodeData;
      this.showNodeEditDialog = true;
      this.treeVar = "editNodeData";
    },
    async batchUpdateNode() {
      try {
        const { data, success, message } = await batchUpdateNode(
          this.editNodeData.nodeId,
          this.tableMultipleSelection.map((item) => item.id).filter(Boolean)
        );
        if (!success) {
          this.$message.error("批量修改文件节点失败：" + message);
          return false;
        }
        this.$message.success("修改成功");
        this.showNodeEditDialog = false;
        this.treeVar = "addData";
        this.getSelectArchiveFileList();

        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("批量修改文件节点失败");
        return false;
      }
    },
    handelNodeEditDialogConfirm() {
      this.$refs.NodeEditForm.validate((valid) => {
        if (valid) {
          this.batchUpdateNode();
        }
      });
    },
    handleCommand(command, row) {
      switch (command) {
        case "edit":
          this.editRow(row);
          break;
        case "delete":
          this.deleteRow(row);
          break;
        default:
          break;
      }
    },
    // 处理树节点选择
    handleTreeNodeSelect(data) {
      console.log("选择节点", data);
      // 使用$set确保响应式更新
      this.$set(this.addData, "nodeId", data.id);
      this.$set(this.addData, "nodeName", data.nodeName);
      console.log("addData", this.addData);

      // 手动关闭下拉框
      setTimeout(() => {
        // 1. 隐藏下拉框
        const dropdowns = document.querySelectorAll(".el-select-dropdown.tree-select");
        dropdowns.forEach((dropdown) => {
          dropdown.style.display = "none";
        });

        // 2. 修改select状态
        if (this.$refs.treeSelectDropdown) {
          this.$refs.treeSelectDropdown.visible = false;
        }

        // 3. 模拟点击外部
        document.body.click();
      }, 10);
    },

    // 处理选项点击，强制关闭下拉框
    handleOptionClick(data) {
      // 设置数据
      this.$set(this.addData, "nodeId", data.id);
      this.$set(this.addData, "nodeName", data.nodeName);

      // 手动关闭下拉框
      setTimeout(() => {
        // 1. 隐藏下拉框
        const dropdowns = document.querySelectorAll(".el-select-dropdown.tree-select");
        dropdowns.forEach((dropdown) => {
          dropdown.style.display = "none";
        });

        // 2. 修改select状态
        if (this.$refs.treeSelectDropdown) {
          this.$refs.treeSelectDropdown.visible = false;
        }

        // 3. 模拟点击外部
        document.body.click();
      }, 10);
    }
  }
});
export default Catalogue;
</script>

<style scoped lang="scss">
.page-catalogue {
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
    overflow: auto;
    border: #e5e5e5 1px solid;
    .tree-inner-wrapper {
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      height: 100%;
      overflow: hidden;
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
    height: 100%;
    padding: 20px 20px 20px 0;
  }
  .returnTableTitle {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .enclosure {
    width: 100%;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    span {
      font-weight: 600;
      color: black;
    }
    span:before {
      content: "*";
      color: red;
      margin-right: 4px;
    }
  }
  .dawnLoadText {
    color: blue;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .tree-dialog-wrapper {
    height: 50vh;
    overflow: auto;
  }
  .add-form {
    height: 70vh;
    overflow: auto;
  }
  .el-input.input-select {
    /deep/ .el-input__inner {
      cursor: pointer;
    }
    &:hover .pointer {
      display: unset;
    }
    .pointer {
      display: none;
    }
  }
}

.date {
  width: 25%;
  // display: flex;
  /deep/ .el-form-item__content {
    width: 65%;
  }
  .el-range-editor--small.el-input__inner {
    width: 100%;
  }
}

// 隐藏上传的文件
// /deep/ .el-upload-list {
//   display: none;
// }
/deep/ .flow-dialog {
  min-width: 1800px;
  min-height: 900px;
}
/deep/ {
  .wbench-el-dialog.is-fullscreen {
    .el-dialog__body {
      height: calc(100% - 45px);
    }
  }
}

.tree-select {
  max-height: 400px;
  overflow-y: auto;

  .el-select-dropdown__item {
    height: auto;
    padding: 0;

    &.selected {
      font-weight: normal;
    }
  }
}
.table-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* 设置元素间隔 */
}
</style>
