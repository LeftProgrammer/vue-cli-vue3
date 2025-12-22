<template>
  <div class="page-catalogue">
    <TreeTableLayout
      :page="searchData" title="文件目录列表" @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange" @query="handelSearchButtonClick" @reset="handelResetButtonClick"
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
          type="primary" icon="el-icon-plus" :disabled="!selectionNode.id" :loading="addButtonLoading"
          @click="handleAdd"
        >新增</el-button>
        <el-button
          icon="el-icon-s-operation" :disabled="tableMultipleSelection.length === 0"
          @click="handleMove"
        >移动</el-button>
      </template>
      <template slot="table">
        <div class="content">
          <div class="left-content">
            <div class="tree-wrapper" :style="{ width: treeWidth + 'px' }">
              <el-tree
                ref="tree" :highlight-current="true" class="tree" :data="treeData" :props="defaultProps"
                default-expand-all :filter-node-method="filterNode" node-key="id" :expand-on-click-node="false"
                @node-click="handelNodeClick"
              >
                <template #default="{ data }">
                  <span class="custom-tree-node" :title="data.nodeName">
                    <i
                      style="color: #014acb" :class="data.children.length > 0
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
            <el-table :data="tableData" height="100%" stripe border @selection-change="handleTableSelectionChange">
              <el-table-column type="selection" width="55" align="center" :selectable="isRowSelectable" />
              <el-table-column label="序号" align="center" width="54">
                <template #default="{ $index }">
                  {{ $index + 1 + (searchData.current - 1) * searchData.pageSize }}
                </template>
              </el-table-column>

              <el-table-column prop="fileName" show-overflow-tooltip label="文件题名" header-align="center" align="left">
                <template #default="{ row }">
                  <el-link :underline="false" type="primary" @click="showRow(row)">
                    {{ row.fileName }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="code" show-overflow-tooltip label="文件编号" width="240" header-align="center"
                align="left"
              />
              <el-table-column prop="issueDate" label="印发日期" header-align="center" width="120" align="center">
                <template #default="{ row }">
                  {{ row.issueDate ? dateFormat(row.issueDate) : "" }}
                </template>
              </el-table-column>
              <el-table-column prop="createDate" label="上传日期" header-align="center" width="120" align="center">
                <template #default="{ row }">
                  {{ row.createDate ? dateFormat(row.createDate) : "" }}
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="180" fixed="right">
                <template #default="{ row }">
                  <!-- <div class="table-btn">
                    <el-link type="primary" @click="changeRow(row)"
                      >编辑</el-link
                    >
                    <el-link type="primary" @click="downloadFile(row)"
                      >下载</el-link
                    >
                    <el-link type="danger" @click="deleteCommonFile(row)"
                      >删除</el-link
                    >
                  </div> -->
                  <list-button
                    :data="row" :btns="[
                      { title: '编辑', method: 'edit' },
                      {
                        title: '下载',
                        method: 'downloadFile'
                      },
                      { title: '删除', method: 'delete' }
                    ]" @edit="changeRow" @downloadFile="downloadFile" @delete="deleteCommonFile"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <el-dialog
      v-if="showDialog" v-draggable :visible.sync="showDialog" :title="title" width="30%"
      :close-on-click-modal="false"
    >
      <el-form ref="addForm" :rules="rulesAdd" :model="addData" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="文件编号" prop="code">
              <el-input v-model="addData.code" :disabled="dialogReadonly" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件题名" prop="fileName">
              <el-input v-model="addData.fileName" :disabled="isSHow" placeholder="请输入" maxlength="255" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="印发日期" prop="issueDate">
              <el-date-picker
                v-model="addData.issueDate"
                type="date"
                placeholder="请选择印发日期"
                :disabled="isSHow"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="所属节点" prop="nodeId">
            <el-select
              ref="treeSelectDropdown" v-model="addData.nodeName" placeholder="请选择节点" class="w-100pre"
              popper-class="tree-select" :disabled="isSHow"
            >
              <el-option value="" style="height: auto; padding: 0">
                <el-tree
                  ref="treeSelect" :data="treeData" :props="defaultProps" default-expand-all node-key="id"
                  :highlight-current="true" :expand-on-click-node="false" @node-click="handleTreeNodeSelect"
                >
                  <span slot-scope="{ data }" class="custom-tree-node w-100pre">
                    <span>{{ data.nodeName }}</span>
                  </span>
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input
                v-model="addData.remarks" type="textarea" rows="3" placeholder="请输入"
                :disabled="dialogReadonly"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="附件">
            <uploadFile
              v-model="addData.fileId" :readonly="dialogReadonly" :limit="1" :max-size="50"
              @change="handleFileChange"
            />
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="showDialog = false">{{ isSHow ? "关闭" : "取消" }}</el-button>
        <el-button v-if="!isSHow" type="primary" @click="closeDialog">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="dialog-body-np" title="责任单位" :visible.sync="modalShow" append-to-body width="800px"
      :destroy-on-close="true" :close-on-press-escape="false" :close-on-click-modal="false"
    >
      <CorSelect v-if="modalShow" single @childEvt="modalEvt" />
    </el-dialog>
    <el-dialog
      title="流程处理表单" custom-class="wbench-el-dialog flow-dialog" :visible.sync="flowShow"
      :destroy-on-close="true" :close-on-press-escape="false" :close-on-click-modal="false" append-to-body center
      fullscreen :before-close="beforeClosedDialog" @closed="handleClosed"
    >
      <SzgcProcessGetor
        v-if="flowShow" ref="SzgcProcessGetor" :top-show="false" :page="detailStatus"
        :data-all="dataAll" @childEvt="childEvtHandle"
      />
    </el-dialog>
    <el-dialog
      title="变更节点" :visible.sync="treeDialog" :destroy-on-close="true" :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="tree-dialog-wrapper">
        <el-tree
          v-if="treeDialog" ref="dialogTree" :highlight-current="true" class="tree" :data="treeData"
          :props="defaultProps" default-expand-all node-key="id" :expand-on-click-node="false"
          @node-click="handelTreeDialogNodeClick"
        >
          <template #default="{ data }">
            <span class="custom-tree-node">
              <i
                style="color: #014acb" :class="data.children.length > 0 ? 'el-icon-folder-opened' : 'el-icon-folder'
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
    getArchiveFileCatalogueManagerTree,
    getSelectCommonFileList,
    getArchiveFileAttDetail,
    deleteCommonFile,
    getCommonFileDetail,
    addFileAttachment,
    deleteFileAttachment,
    saveCommonFile,
    updateCommonFile,
    moveUpFileAttachment,
    moveDownFileAttachment,
    getFlowConfigs,
    fileSubmit,
    getFileStorePermissionByLoginUser,
  } from "@/api/archives.js";
  import { SzgcProcessGetor } from "@szgc/wbench";

  import CorSelect from "@/components/CorSelect/index";
  import TreeTableLayout from "@/components/ContentLayout/TreeTable";
  import { dateFormat } from "@/utils";
  import { mapGetters } from "vuex";
  // import DragLine from "../shared_component/DragLine";
  import { defineComponent } from "vue";
  import { getFileById } from "@/api/user.js";
  import ListButton from "@/components/ListButton";
  import { BaseMixin } from "@/mixins/BaseMixin";

  const Catalogue = defineComponent({
    name: "Catalogue",
    components: {
      CorSelect,
      TreeTableLayout,
      SzgcProcessGetor,
      // DragLine,
      ListButton
    },
    mixins: [BaseMixin],

    data() {
      return {
        queryTree: null,
        treeData: [],
        defaultProps: {
          children: "children",
          label: "label"
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
          },
          issueDate: {
            required: true,
            message: "请选择印发日期",
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
        isMovingFiles: false,
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
      },
      userId() {
        return this.$getStorage("userInfo").userId;
      }
    },
    watch: {
      queryTree(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
      this.getTreeData();
    },
    mounted() { },
    methods: {
      dateFormat,
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 权限判断方法，参考ListButton组件的disabledBtn逻辑
      isRowSelectable(row) {
        // 如果是系统管理员，允许选择所有行
        if (this.isSystem) return true;

        // 对于普通用户，只有创建者本人才能选择该行进行编辑或删除操作
        return row.createUser === this.userId;
      },

      handleFileChange(value) {
        if (value) {
          this.$refs.addForm?.clearValidate("file");
        }
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
            this.getCommonFilePage();
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
          const { data, success, message } = await getArchiveFileCatalogueManagerTree();
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
        this.searchData.nodeId = this.selectionNode.id;
        this.getCommonFilePage();
      },
      handelResetButtonClick() {
        this.searchData = {
          current: 1,
          pageSize: 20,
          fileName: "",
          total: 0, // 确保总数也被重置
          code: "",
          nodeId: this.selectionNode.id,
          entity: {
            fileName: "",
            code: "",
            nodeId: this.selectionNode.id
          }
        };
        this.$nextTick(() => {
          this.getCommonFilePage();
        });
      },
      // 查表格数据
      async getCommonFilePage() {
        try {
          const searchData = {
            current: this.searchData.current,
            pageSize: this.searchData.pageSize,
            entity: {
              fileName: this.searchData.fileName,
              code: this.searchData.code,
              nodeId: this.selectionNode.id
            }
          };
          this.tableData = [];
          const { data, success, message } = await getSelectCommonFileList(searchData);
          if (!success) {
            this.$message.error("查询档案表格数据失败：" + message);
            return false;
          }
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
        this.getCommonFilePage();
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
        this.searchData.size = page.pageSize;
        this.getCommonFilePage();
      },

      handelCurrentChange(page) {
        this.searchData.current = page.current;
        this.getCommonFilePage();
      },
      // 修改
      async updateCommonFile() {
        try {
          const { data, success, message } = await updateCommonFile(this.addData);
          if (!success) {
            this.$message.error("修改文件信息失败：" + message);
            return false;
          }
          this.$message.success("修改成功");
          this.showDialog = false;
          this.getCommonFilePage();
          return data;
        } catch (err) {
          console.error(err);
          this.$message.error("修改文件信息失败");
          return false;
        }
      },
      // 新建
      async saveCommonFile() {
        try {
          const { data, success, message } = await saveCommonFile(this.addData);
          if (!success) {
            this.$message.error("新增文档失败" + message);
            return false;
          }
          this.$message.success("新增文档成功");
          this.showDialog = false;
          this.getCommonFilePage();
          return data;
        } catch (err) {
          console.error(err);
          this.$message.error("新增文档失败");
          return false;
        }
      },
      // 点击查看
      async showRow(row) {
        console.log(row);
        const res = await this.getCommonFileDetail(row.id);
        console.log(res);
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

      // 关闭dialog
      closeDialog() {
        console.log("closeDialog", this.addData);
        try {
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              if (!this.isAdd && !this.isSHow) {
                // 编辑文档
                this.updateCommonFile();
              } else {
                // 新建文档
                this.saveCommonFile();
              }
            }
          });
        } catch (err) {
          console.error(err);
        }
      },
      // 查询文件详情
      async getCommonFileDetail(id) {
        try {
          const { data, success, message } = await getCommonFileDetail({ id });

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
        debugger;
        const res = await this.getCommonFileDetail(row.id);
        if (res) {
          this.addData = res;
          this.addData.uploadDate = this.dateFormat(res.uploadDate);
          this.addData.createDate = this.dateFormat(res.createDate);
          this.showDialog = true;
          this.title = "编辑文档";
          this.isAdd = false;
          this.isSHow = false;
          this.treeVar = "addData";
        }
      },
      beforeDelete() {
        return this.$confirm("是否要删除这条数据 ?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
      },
      // 删除数据
      async deleteCommonFile(row) {
        try {
          // await this.beforeDelete();
          const { success, message } = await deleteCommonFile(row.id);
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
          this.getCommonFilePage();
          return true;
        } catch (error) {
          console.error(error);
          if (error !== "cancel") {
            this.$message.error("删除失败");
          }
          return false;
        }
      },
      // 新增附件
      async addFileAttachment(id, submitData) {
        try {
          const { data, success, message } = await addFileAttachment(id, submitData);

          if (!success) {
            this.$message.error("新增附件失败：" + message);
            return false;
          }
          return data;
        } catch (err) {
          console.error(err);
          this.$message.error("新增附件失败");
          return false;
        }
      },

      // 上传文件失败
      fileError(err) {
        this.$message.error("上传失败：" + err.message);
      },
      // 删除附件
      async deleteFileAttachment(id) {
        try {
          const { data, success, message } = await deleteFileAttachment({ id });

          if (!success) {
            this.$message.error("删除附件失败：" + message);
            return false;
          }
          return data;
        } catch (err) {
          console.error(err);
          this.$message.error("删除附件失败");
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
          const { success, message } = await moveUpFileAttachment({ id });
          if (!success) {
            this.$message.error("移动失败：" + message);
            return false;
          }
          this.$message.success("移动成功");
          // this.getCommonFilePage();
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
          const { success, message } = await moveDownFileAttachment({ id });
          if (!success) {
            this.$message.error("移动失败：" + message);
            return false;
          }
          this.$message.success("移动成功");
          // this.getCommonFilePage();
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
          const { success, message } = await fileSubmit({ id });
          if (!success) {
            this.$message.error("文件提交失败：" + message);
            return false;
          }
          this.$message.success("文件提交成功");
          this.getCommonFilePage();
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
        debugger;
        if (!this.selectionNode.id) {
          this.$message.error("请选择目录");
          return;
        }

        this.addData = {
          nodeId: this.selectionNode.id,
          nodeName: this.selectionNode.nodeName,
          fileName: "",
          fileId: ""
        };
        this.fileList = [];
        this.title = "新增";
        this.isAdd = true;
        this.isSHow = false;
        this.showDialog = true;
      },
      handleMove() {
        if (this.tableMultipleSelection.length === 0) {
          this.$message.warning("请选择要移动的文件");
          return;
        }
        // 打开移动对话框
        this.isMovingFiles = true;
        this.treeDialog = true;
        this.treeDialogSelectNode = {};
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
          if (this.isMovingFiles) {
            // 移动文件逻辑
            this.moveSelectedFiles();
          } else {
            // 编辑节点逻辑
            this.addData.nodeId = this.treeDialogSelectNode.id;
            this.addData.nodeName = this.treeDialogSelectNode.nodeName;
            this.treeDialog = false;
          }
        } else {
          this.$message.warning("未选择任何节点");
        }
      },
      async moveSelectedFiles() {
        try {
          const targetNodeId = this.treeDialogSelectNode.id;
          const targetNodeName = this.treeDialogSelectNode.nodeName;
          const selectedFiles = this.tableMultipleSelection;

          if (selectedFiles.length === 0) {
            this.$message.warning("请选择要移动的文件");
            return;
          }

          // 确认移动操作
          const confirmResult = await this.$confirm(
            `确定要将选中的 ${selectedFiles.length} 个文件移动到 "${targetNodeName}" 节点吗？`,
            "确认移动",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          );

          if (confirmResult) {
            let successCount = 0;
            let failCount = 0;

            for (const file of selectedFiles) {
              try {
                const updateData = {
                  ...file,
                  nodeId: targetNodeId,
                  nodeName: targetNodeName
                };
                const result = await updateCommonFile(updateData);
                if (result.success) {
                  successCount++;
                } else {
                  failCount++;
                }
              } catch (error) {
                console.error(`移动文件 ${file.fileName} 失败:`, error);
                failCount++;
              }
            }

            // 显示结果消息
            if (successCount > 0) {
              this.$message.success(`成功移动 ${successCount} 个文件`);
            }
            if (failCount > 0) {
              this.$message.error(`${failCount} 个文件移动失败`);
            }

            // 关闭对话框并刷新数据
            this.treeDialog = false;
            this.isMovingFiles = false;
            this.getCommonFilePage();
          }
        } catch (error) {
          if (error !== "cancel") {
            console.error("移动文件失败:", error);
            this.$message.error("移动文件失败");
          }
          this.treeDialog = false;
          this.isMovingFiles = false;
        }
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

      handleCommand(command, row) {
        switch (command) {
          case "delete":
            this.deleteCommonFile(row);
            break;
          default:
            break;
        }
      },

      handleTreeNodeSelect(data) {
        console.log("选择节点", data);
        // 使用$set确保响应式更新
        this.$set(this.addData, "nodeId", data.id);
        this.$set(this.addData, "nodeName", data.nodeName);
        console.log("addData", this.addData);

        // 手动关闭下拉框 - 使用更加彻底的方式
        setTimeout(() => {
          try {
            // 方法1：隐藏下拉框
            const dropdowns = document.querySelectorAll(".el-select-dropdown.tree-select");
            dropdowns.forEach((dropdown) => {
              dropdown.style.display = "none";
            });

            // 方法2：修改select状态
            if (this.$refs.treeSelectDropdown) {
              this.$refs.treeSelectDropdown.visible = false;
              this.$refs.treeSelectDropdown.blur();
            }

            // 方法3：模拟点击外部
            document.body.click();

            // 方法4：手动触发下拉框关闭事件
            const selectWrappers = document.querySelectorAll(".el-select");
            selectWrappers.forEach((wrapper) => {
              const event = new Event("mousedown", { bubbles: true });
              document.body.dispatchEvent(event);
            });
          } catch (e) {
            console.error("关闭下拉框失败", e);
          }
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
      height: 100%;
      gap: 16px;

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
      height: 60vh;
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

  .table-btn {
    display: flex;
    /* 使用flex布局 */
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中（如果需要） */
    gap: 10px;
    /* 按钮之间的间距，可以根据需要调整 */
  }
</style>
