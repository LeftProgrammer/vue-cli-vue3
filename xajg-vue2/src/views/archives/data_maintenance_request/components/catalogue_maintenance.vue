<template>
  <div class="page-catalogue">
    <TreeTableLayout
      :page="searchData"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
      title="文件列表"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="文件题名">
            <el-input
              v-model="searchData.name"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="文件编号">
            <el-input
              v-model="searchData.code"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="文件状态">
            <el-select
              v-model="searchData.status"
              clearable
              placeholder="请选择"
              style="width: 200px"
            >
              <el-option
                v-for="item in statusList"
                :key="item.dictId"
                :label="item.dictName"
                :value="item.dictId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="责任单位">
            <el-input
              v-model="searchData.createCorpName"
              placeholder="请输入"
              readonly
              class="input-select"
              @click.native="handelShowCorpModel('createCorp')"
            >
              <i
                v-show="searchData.createCorpName"
                slot="suffix"
                class="el-icon-circle-close pointer"
                @click.stop="onClear()"
              />
            </el-input>
          </el-form-item>
        </el-form>
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
                      :class="
                        data.children.length > 0
                          ? 'el-icon-folder-opened'
                          : 'el-icon-folder'
                      "
                    />
                    <span>{{ data.nodeName }}</span>
                  </span>
                </template>
              </el-tree>
            </div>
            <DragLine @moveEnd="handelMoveEnd" :minMoveX="0"></DragLine>
          </div>

          <div class="table-wrapper">
            <el-table
              :data="tableData"
              height="100%"
              stripe
              border
              ref="table"
              @select="handleTableSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="序号" align="center" width="80">
                <template #default="{ $index }">
                  {{
                    $index + 1 + (searchData.current - 1) * searchData.pageSize
                  }}
                </template>
              </el-table-column>

              <el-table-column
                prop="name"
                show-overflow-tooltip
                label="文件题名"
                min-width="400"
                align="left"
              />
              <el-table-column
                prop="code"
                show-overflow-tooltip
                label="文件编号"
                width="120"
                align="left"
              />
              <el-table-column
                prop="version"
                show-overflow-tooltip
                label="版本号"
                width="120"
                align="left"
              />
              <el-table-column
                prop="createCorpName"
                label="责任单位"
                align="left"
                width="120"
              />
              <el-table-column
                prop="createDate"
                label="形成日期"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  {{ dateFormat(row.createDate) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="uploadDate"
                label="上传日期"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  {{ dateFormat(row.uploadDate) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="文件状态"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  {{ statusListMap[row.status] }}
                </template>
              </el-table-column>
              <el-table-column
                prop="source"
                label="上传单位"
                align="left"
                width="120"
              />
              <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="200"
                fixed="right"
              >
                <template #default="{ row }">
                  <div class="table-btn">
                    <el-button
                      type="text"
                      v-if="row.permssionMap[3]"
                      @click="showRow(row)"
                      >查看</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <footer class="text-right mb-10 mt-10">
      <el-button type="primary" @click="handelConfirmButtonClick">确定</el-button>
    </footer>
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
    <el-dialog :visible.sync="showDialog" :title="title" top="50px">
      <el-form
        ref="addForm"
        :rules="rulesAdd"
        :model="addData"
        label-width="100px"
        class="add-form"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="文号">
              <el-input v-model="addData.code" :readonly="dialogReadonly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属节点">
              <el-input
                :value="addData.nodeName"
                readonly
                @click.native="handelChangeNode"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="文件题名" prop="name">
              <el-input
                v-model="addData.name"
                :disabled="isSHow"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任单位" prop="createCorpName">
              <el-input
                v-model="addData.createCorpName"
                placeholder="请输入"
                readonly
                @click.native="handelCreateCorpClick"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成文日期" prop="createDate">
              <!-- <el-input v-model="addData.createTime" placeholder="请输入" /> -->
              <el-date-picker
                v-model="addData.createDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :disabled="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input
                v-model="addData.version"
                placeholder="请输入"
                :readonly="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传日期" prop="uploadDate">
              <el-date-picker
                v-model="addData.uploadDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属合同" prop="contract">
              <el-input
                v-model="addData.contract"
                :readonly="dialogReadonly"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子项目" prop="childProject">
              <el-input
                v-model="addData.childProject"
                :readonly="dialogReadonly"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位工程" prop="unitEngineering">
              <el-input
                v-model="addData.unitEngineering"
                placeholder="请输入"
                :readonly="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分部工程" prop="branchEngineering">
              <el-input
                v-model="addData.branchEngineering"
                placeholder="请输入"
                :readonly="dialogReadonly"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="页数" prop="pageNum">
              <el-input
                v-model="addData.pageNum"
                placeholder="请输入"
                :readonly="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文字材料页数" prop="docNum">
              <el-input
                v-model="addData.docNum"
                placeholder="请输入"
                :readonly="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图纸张数" prop="picNum">
              <el-input
                v-model="addData.picNum"
                placeholder="请输入"
                :readonly="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"> </el-col>
          <el-col :span="22">
            <el-form-item label="备注" prop="notes">
              <el-input
                v-model="addData.notes"
                type="textarea"
                rows="3"
                placeholder="请输入"
                :readonly="dialogReadonly"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="enclosure">
          <span>附件列表</span>
          <div v-if="!dialogReadonly">
            <!-- <el-button>新增</el-button> -->
            <el-upload
              class="upload-demo"
              action="/api/file/upload"
              :on-success="fileSuccess"
              :on-error="fileError"
              multiple
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </div>
        </div>
      </el-form>
      <el-table :data="fileList" max-height="280px">
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="filename" label="附件名称" align="center">
          <template #default="{ row }">
            <el-button
              type="text"
              :title="(row.attachment && row.attachment.fileName) || '-'"
              @click="
                previewFile(
                  row.attId,
                  row.attachment && row.attachment.fileName
                )
              "
            >
              {{ (row.attachment && row.attachment.fileName) || "-" }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="uploadUserName" label="上传人" align="center" />
        <el-table-column prop="uploadDate" label="上传日期" align="center">
          <template #default="{ row }">
            {{ dateFormat(row.uploadDate) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="typeName" label="类型" align="center" /> -->
        <el-table-column
          prop="name"
          label="操作"
          width="200"
          align="center"
          v-if="!dialogReadonly"
        >
          <template #default="{ row, $index }">
            <div class="table-btn">
              <el-button type="text" @click="deleteFile(row)">删除</el-button>
              <el-button
                type="text"
                :disabled="$index === 0"
                @click="moveUpFileAttachment(row.id)"
                >上移</el-button
              >
              <el-button
                type="text"
                :disabled="$index + 1 === fileList.length"
                @click="moveDownFileAttachment(row.id)"
                >下移</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="showDialog = false">关 闭</el-button>
        <el-button type="primary" @click="closeDialog" v-if="!dialogReadonly"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArchiveFileCatalogueTree,
  getSelectArchiveFileList,
  getArchiveFileAttDetail,
  deleteArchiveFile,
  getArchiveFileDetail,
  addFileAttachment,
  deleteFileAttachment,
  updateArchiveFile,
  moveUpFileAttachment,
  moveDownFileAttachment,
  fileAuthenticate,
  getFlowConfigs,
  fileSubmit,
  getFileStorePermissionByLoginUser,
  getFilePath,
} from "@/api/archives.js";
import { SzgcProcessGetor } from "@szgc/wbench";

import CorSelect from "@/components/CorSelect/index";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import DragLine from "@/views/archives/shared_component/DragLine/index.vue";
import { defineComponent } from "vue";

const CatalogueMaintenance = defineComponent({
  name: "CatalogueMaintenance",
  components: { CorSelect, TreeTableLayout, SzgcProcessGetor, DragLine },
  computed: {
    ...mapGetters(["loginInfo"]),
    dialogReadonly() {
      return this.isAdd === false && this.isSHow === true;
    },
  },
  data() {
    return {
      queryTree: null,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      searchData: {
        total: 0,
        current: 1,
        pageSize: 20,
        nodeId: "",
        status: "",
        name: "",
        code: "",
        createCorpName: "",
        createCorpId: "",
      },
      tableData: [],
      showDialog: false,
      addData: { mode: 1 },
      selectionNode: {},
      title: "",
      rulesAdd: {
        name: {
          required: true,
          message: "请输入文件题名",
          trigger: "change",
        },
        createCorpName: {
          required: true,
          message: "请输入责任单位",
          trigger: "change",
        },
        createDate: {
          required: true,
          message: "请输入成文日期",
          trigger: "change",
        },
      },
      isAdd: false,
      isSHow: false,
      fileList: [],
      statusList: [
        { dictId: 1, dictName: "待鉴定" },
        { dictId: 2, dictName: "鉴定中" },
        { dictId: 3, dictName: "整改中" },
        { dictId: 4, dictName: "待组卷" },
        { dictId: 5, dictName: "无需归档" },
      ],
      statusListMap: {
        1: "待鉴定",
        2: "鉴定中",
        3: "整改中",
        4: "待组卷",
        5: "无需归档",
        6: "已组卷",
        7: "已归档",
      },
      modalShow: false,
      editRow: null,
      flowShow: false,
      flowInfo: {
        businessId: "",
        status: false,
      },
      detailStatus: "mine",
      dataAll: {
        businessId: "",
        taskId: "",
      },
      packageId: "1224376020367310848",
      flowPageType: "mine",
      addButtonLoading: false,
      flowConfigList: [],
      treeDialog: false,
      treeDialogSelectNode: {},
      tableMultipleSelection: [],
      treeWidth: 267,
    };
  },
  watch: {
    queryTree(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getTreeData();
  },
  mounted() {
    
  },
  methods: {
    dateFormat,
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 查询左边目录树
    async getTreeData() {
      const res = await this.getArchiveFileCatalogueTree();
      if (res?.length > 0) {
        // 默认查询所有 修复禅道bug: #7981
        // const defaultNode = this.getFirstLeafNode(res);
        // this.searchData.nodeId = defaultNode.id;
        // this.selectionNode = defaultNode;
        this.$nextTick(() => {
          // const node = this.$refs.tree.getNode(defaultNode.id);
          // this.$refs.tree.setCurrentNode(node.data);
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
        const { data, success, message } = await getArchiveFileCatalogueTree();

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
      const metaData = this.$options.data();
      this.searchData = metaData.searchData;
      this.searchData.nodeId = "";
      // this.searchData.nodeId = this.selectionNode.id;
      this.getSelectArchiveFileList();
    },
    // 查表格数据
    async getSelectArchiveFileList() {
      this.tableData = [];
      try {
        const { data, success, message } = await getSelectArchiveFileList({
          ...this.searchData,
          status: this.searchData.status || 0,
        });

        if (!success) {
          this.$message.error("查询表格数据失败：" + message);
          return false;
        }
        this.tableData = data.records;
        this.searchData.total = data.total;
        this.tableMultipleSelection = [];
        this.handleTableSelectionChange([]);
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询表格数据失败");
        return false;
      }
    },
    // 点击左侧树形节点，查询表格数据
    async handelNodeClick(data, node, own) {
      // 只能选中叶节点
      // if (!node.isLeaf) {
      //   this.$refs.tree.setCurrentNode(this.selectionNode);
      //   return;
      // }
      this.selectionNode = data;
      this.searchData.nodeId = this.selectionNode.id;
      this.searchData.current = 1;
      // const res = await this.getFileStorePermissionByLoginUser(this.searchData.nodeId);
      // if (res) {
      //   this.getSelectArchiveFileList();
      // }
      this.getSelectArchiveFileList();
    },
    // 查表格数据
    async getFileStorePermissionByLoginUser(nodeId) {
      try {
        const { data, success, message } =
          await getFileStorePermissionByLoginUser({ nodeId });

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
      // this.searchData.pageSize = page
      this.getSelectArchiveFileList();
    },
    // 修改
    async updateArchiveFile() {
      try {
        const { data, success, message } = await updateArchiveFile(
          this.addData
        );
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
        this.fileList = res.archiveFileAttachmentVoList || [];
        this.title = "查看文档";
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
          identifyResult: identifyResult,
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
            inputErrorMessage: "请输入意见",
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
    async previewFile(fileInfoId, fileName, isDownload = 0) {
      try {
        const { data, success, message } = await getFilePath({
          fileInfoId,
          isDownload,
          fileName: fileName || "",
          fileSchema: 0,
        });
        if (!success) {
          this.$message.error("获取文件下载路径失败：" + message);
          return false;
        }
        window.open(data);
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件下载路径失败");
        return false;
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
            this.showDialog = false;
          }
        }
      });
    },
    // 查询文件详情
    async getArchiveFileDetail(id) {
      try {
        const { data, success, message } = await getArchiveFileDetail({ id });

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
          id,
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
      const res = await this.getArchiveFileDetail(row.id);
      if (res) {
        this.addData = res;
        this.addData.uploadDate = this.dateFormat(res.uploadDate);
        this.addData.createDate = this.dateFormat(res.createDate);
        this.fileList = res.archiveFileAttachmentVoList || [];
        this.showDialog = true;
        this.title = "编辑文档";
        this.isAdd = false;
        this.isSHow = false;
      }
    },
    beforeDelete() {
      return this.$confirm("是否要删除选中数据 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
    },
    // 删除数据
    async deleteArchiveFile() {
      try {
        await this.beforeDelete();
        const { data, success, message } = await deleteArchiveFile({
          id: this.tableMultipleSelection.map((item) => item.id).join(),
        });
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
    // 新增附件
    async addFileAttachment(id, submitData) {
      try {
        const { data, success, message } = await addFileAttachment(
          id,
          submitData
        );

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
    // 文件上传成功
    async fileSuccess(file) {
      if (!this.addData.id) {
        this.$message.error("上传失败");
        return;
      }
      const res = await this.addFileAttachment(this.addData.id, {
        attId: file.data.fileId,
        fileId: this.addData.id,
        type: 4,
      });
      if (res) {
        const res2 = await this.getArchiveFileAttDetail(this.addData.id);
        this.fileList = res2 || [];
        this.$message.success("上传成功");
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
      const res = await this.deleteFileAttachment(row.id);

      if (res) {
        const res2 = await this.getArchiveFileAttDetail(this.addData.id);
        this.fileList = res2 || [];
      }
    },
    downloadFile(id) {
      window.open(`/api/archiveFileStore/downloadFile?id=${id}`);
    },
    modalEvt({ data }) {
      this.modalShow = false;
      if (this.varName) {
        this.searchData[`${this.varName}Name`] = data.length
          ? data[0].corpName
          : "";
        this.searchData[`${this.varName}Id`] = data.length
          ? data[0].corpId
          : "";
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
          pacId: this.packageId,
        });
        if (!success) {
          this.$message.error("获取流程配置失败：" + message);
          return false;
        }
        this.flowConfigList = data;
        if (Array.isArray(data) && data.length > 0) {
          this.dataAll = {
            businessId: data[0].flowConfigId,
            taskId: "",
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
    async handelAdd() {
      if (!this.selectionNode.id) {
        return;
      }
      const res = await this.getFlowConfigs();
      if (!res) return;
      this.detailStatus = "mine";
      localStorage.setItem(
        "currentNodeInfo",
        JSON.stringify(this.selectionNode)
      );
      this.flowShow = true;
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
      if (this.tableMultipleSelection.length > 1) {
        this.$nextTick(() => {
          try {
            const oldRow = this.tableMultipleSelection.shift();
            this.$refs.table.toggleRowSelection(oldRow, false);
          } catch (error) {
            console.error(error);
          } finally {
            const parentWindow = window.opener;
            if (parentWindow) {
              parentWindow.handelCurrentChange?.(this.tableMultipleSelection[0] || {});
            }
            this.$emit("current-change", this.tableMultipleSelection[0] || {});
          }
        });
      } else {
        const parentWindow = window.opener;
            if (parentWindow) {
              parentWindow.handelCurrentChange?.(this.tableMultipleSelection[0] || {});
            }
        this.$emit("current-change", this.tableMultipleSelection[0] || {});
      }
    },
    handelShowCorpModel(name) {
      this.varName = name;
      this.modalShow = true;
    },
    async archiveFileStoreExport() {
      const params = {
        ...this.searchData,
      };
      const searchParams = new URLSearchParams(params);
      window.open(`/api/archiveFileStore/download?${searchParams}`, "_blank");
    },
    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX;
    },
    handelConfirmButtonClick() {
      if (!this.tableMultipleSelection?.length) {
        this.$message.warning("请选择一个项目");
        return
      }
      const parentWindow = window.opener;
      if (parentWindow) {
        parentWindow.handelFlowSelectDialogConfirm?.();
        window.close();
      }
    }
  },
});
export default CatalogueMaintenance;
</script>

<style scoped lang="scss">
.page-catalogue {
  height: calc(100% - 30px);
  overflow: hidden;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .treetable-content  {
    height: 0;
    flex: 1;
    width: 100%;
  }
  .content {
    width: 100%;
    display: flex;
    height: 100%;
    .left-content {
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
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
    .table-wrapper {
      flex: 1;
      width: 0;
      .el-table /deep/ .el-table__header-wrapper tr th .el-checkbox__inner {
        display: none;
      }
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
    height: 50vh;
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
/deep/ .el-upload-list {
  display: none;
}
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
</style>
