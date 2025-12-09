<template>
  <div class="page-verification-log">
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
          <el-form-item label="鉴定结果">
            <el-select
              v-model="searchData.identifyResult"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in identifyResultList"
                :key="item.dictId"
                :label="item.dictName"
                :value="item.dictId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="鉴定人">
            <UserSelectInput
              v-model="searchData.identifyUserId"
              placeholder="请选择"
            />
          </el-form-item>
          <el-form-item label="鉴定时间">
            <el-date-picker
              v-model="searchData.identifyDate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否闭合">
            <el-select
              v-model="searchData.isClosed"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in closedList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-dropdown @command="handleExportCommand">
          <el-button type="primary" plain icon="el-icon-download" class="ml-10"
            >导出</el-button
          >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">全量导出</el-dropdown-item>
            <el-dropdown-item
              :command="2"
              :disabled="tableMultipleSelection.length === 0"
              >导出选择项</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
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
                :default-expanded-keys="defaultExpandedKeys"
              >
                <template #default="{ data }">
                  <span class="custom-tree-node" :title="data.label">
                    <i
                      :class="
                        data.children.length > 0
                          ? 'el-icon-folder-opened'
                          : 'el-icon-document'
                      "
                    />
                    <span>{{ data.label }}</span>
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
              @selection-change="handleTableSelectionChange"
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
                prop="code"
                show-overflow-tooltip
                label="文件编号"
                width="120"
                align="left"
              />
              <el-table-column
                prop="name"
                show-overflow-tooltip
                label="文件题名"
                min-width="400"
                align="left"
              />
              <el-table-column
                prop="identifyUserName"
                show-overflow-tooltip
                label="鉴定人"
                width="120"
                align="left"
              />
              <el-table-column label="鉴定日期" align="left" width="120">
                <template #default="{ row }">
                  {{ dateFormat(row.identifyDate) }}
                </template>
              </el-table-column>
              <el-table-column label="鉴定结果" align="left" width="120">
                <template #default="{ row }">
                  <span
                    class="identify-result"
                    :class="['identify-type--' + row.identifyResult]"
                    >{{ identifyResultListMap[row.identifyResult] }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="是否闭合" align="left" width="120">
                <template #default="{ row }">
                  {{ row.isClosedStr }}
                </template>
              </el-table-column>
              <el-table-column label="整改日期" align="left" width="120">
                <template #default="{ row }">
                  {{ row.updateDate ? dateFormat(row.updateDate) : "" }}
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="200px"
                fixed="right"
              >
                <template #default="{ row }">
                  <div class="table-btn">
                    <el-button type="text" @click="showRow(row)"
                      >查看</el-button
                    >
                    <el-button type="text" @click="showLog(row)"
                      >鉴定详情</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <el-dialog :visible.sync="showDialog" title="查看文档" top="50px">
      <el-form ref="addForm" :model="rowDetail" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="文号">
              <el-input v-model="rowDetail.code" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属节点">
              <el-input :value="rowDetail.nodeName" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="文件题名" prop="name">
              <el-input
                v-model="rowDetail.name"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="责任单位" prop="createCorpName">
              <el-input
                v-model="rowDetail.createCorpName"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成文日期" prop="createDate">
              <el-date-picker
                v-model="rowDetail.createDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input
                v-model="rowDetail.version"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传日期" prop="uploadDate">
              <el-date-picker
                v-model="rowDetail.uploadDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属合同" prop="contract">
              <el-input
                v-model="rowDetail.contract"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子项目" prop="childProject">
              <el-input
                v-model="rowDetail.childProject"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位工程" prop="unitEngineering">
              <el-input
                v-model="rowDetail.unitEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分部工程" prop="branchEngineering">
              <el-input
                v-model="rowDetail.branchEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="页数" prop="pageNum">
              <el-input
                v-model="rowDetail.pageNum"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文字材料页数" prop="docNum">
              <el-input
                v-model="rowDetail.docNum"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="图纸张数" prop="picNum">
              <el-input
                v-model="rowDetail.picNum"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"> </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="notes">
              <el-input
                v-model="rowDetail.notes"
                type="textarea"
                rows="3"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="enclosure">
          <span>附件列表</span>
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
      </el-table>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="showDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showLogDialog" title="鉴定记录" top="50px">
      <el-form
        ref="logDialogForm"
        :model="logDialogFormData"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="文件编号">
              <el-input v-model="logDialogFormData.code" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件题名">
              <el-input :value="logDialogFormData.name" readonly />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="鉴定人" prop="identifyUserName">
              <el-input
                v-model="logDialogFormData.identifyUserName"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="鉴定日期" prop="identifyDate">
              <el-input
                :value="
                  logDialogFormData.identifyDate
                    ? dateFormat(logDialogFormData.identifyDate)
                    : ''
                "
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="鉴定结果" prop="identifyResult">
              <el-input
                :value="identifyResultListMap[logDialogFormData.identifyResult]"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否闭合" prop="isClosed">
              <el-input
                :value="logDialogFormData.isClosedStr"
                placeholder=""
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="整改日期" prop="updateDate">
              <el-input
                :value="
                  logDialogFormData.updateDate
                    ? dateFormat(logDialogFormData.updateDate)
                    : ''
                "
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="identifyMessage">
              <el-input
                v-model="logDialogFormData.identifyMessage"
                type="textarea"
                rows="3"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="showLogDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import UserSelectInput from "@/components/UserSelectInput/index.vue";
import { dateFormat } from "@/utils";
import {
  getArchiveAuthenticateRecordRecordList,
  getRecordList,
  getArchiveFileDetail,
  archiveAuthenticateRecordDownload,
  getFilePath,
} from "@/api/archives.js";
import DragLine from "../shared_component/DragLine";
import { defineComponent } from "vue";
const VerificationLog = defineComponent({
  name: "VerificationLog",
  components: { TreeTableLayout, UserSelectInput, DragLine },

  data() {
    return {
      searchData: {
        total: 0,
        current: 1,
        pageSize: 20,
        name: "",
        code: "",
        identifyResult: "",
        isClosed: null,
        identifyUserId: "",
        date: null,
        month: null,
        year: null,
        identifyDate: "",
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      defaultExpandedKeys: [],
      tableData: [],
      selectionNode: {},
      identifyResultList: [
        { dictId: 1, dictName: "通过" },
        { dictId: 2, dictName: "退回" },
        { dictId: 3, dictName: "无需归档" },
      ],
      identifyResultListMap: {
        1: "通过",
        2: "退回",
        3: "无需归档",
      },
      closedList: [
        { value: 1, label: "是" },
        { value: 0, label: "否" },
      ],
      closedListMap: {
        1: "是",
        2: "否",
      },
      showDialog: false,
      rowDetail: { mode: 1, isArchive: 0 },
      fileList: [],
      showLogDialog: false,
      logDialogFormData: {},
      treeWidth: 200,
      tableMultipleSelection: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    dateFormat,
    handelPageSizeChange(page) {
      this.searchData.current = 1;
      this.searchData.pageSize = page.pageSize;
      this.getRecordList();
    },
    handelCurrentChange(page) {
      this.searchData.current = page.current;
      this.getRecordList();
    },
    handelSearchButtonClick() {
      this.searchData.current = 1;
      this.getRecordList();
    },
    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.searchData = {
        ...metaData.searchData,
        month: this.searchData.month,
        year: this.searchData.year,
      };
      this.getRecordList();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handelNodeClick(data, node) {
      // 只能选中叶节点
      if (!node.isLeaf) {
        this.$refs.tree.setCurrentNode(this.selectionNode);
        return;
      }
      if (data.month) {
        this.selectionNode = data;
        this.searchData.year = data.year;
        this.searchData.month = data.month;
        this.searchData.current = 1;
        this.getRecordList();
      }
    },
    async init() {
      const res = await this.getArchiveAuthenticateRecordRecordList();
      if (res?.length > 0) {
        const defaultNode = res[0].children[0];
        this.searchData.year = defaultNode.year;
        this.searchData.month = defaultNode.month;
        this.selectionNode = defaultNode;
        this.defaultExpandedKeys = [defaultNode.id];
        this.$nextTick(() => {
          const node = this.$refs.tree.getNode(defaultNode.id);
          this.$refs.tree.setCurrentNode(node.data);

          this.getRecordList();
        });
      } else {
        this.treeData = [];
      }
    },
    async getArchiveAuthenticateRecordRecordList() {
      try {
        const { data, success, message } =
          await getArchiveAuthenticateRecordRecordList();

        if (!success) {
          this.$message.error("获取文件鉴定日期目录树失败：" + message);
          return false;
        }

        this.treeData = this.composeTree(data);
        return this.treeData;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件鉴定日期目录树失败");
        return false;
      }
    },
    composeTree(data) {
      let res = [];
      if (Array.isArray(data)) {
        res = data.map((item) => ({
          label: item.year,
          value: item.year,
          id: `${item.year}`,
          children: item.month.map((item2) => ({
            label: item2,
            value: item2,
            month: item2,
            year: item.year,
            id: `${item.year},${item2}`,
            children: [],
          })),
        }));
      }
      return res;
    },
    async getRecordList() {
      try {
        const { data, success, message } = await getRecordList(this.searchData);
        if (!success) {
          this.$message.error("查询文件鉴定记录失败：" + message);
          return false;
        }
        this.tableData = data.records;
        this.searchData.total = data.total;
        this.tableMultipleSelection = [];
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询文件鉴定记录失败");
        return false;
      }
    },
    async showRow(row) {
      const res = await this.getArchiveFileDetail(row.fileId);
      if (res) {
        this.rowDetail = res;
        this.rowDetail.uploadDate = this.dateFormat(res.uploadDate);
        this.rowDetail.createDate = this.dateFormat(res.createDate);
        this.fileList = res.archiveFileAttachmentVoList || [];
        this.showDialog = true;
      }
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
    async previewFile(fileInfoId, fileName, isDownload = 0) {
      try {
        const { data, success, message } = await getFilePath({
          fileInfoId,
          isDownload: 0,
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
    async archiveAuthenticateRecordDownload() {
      const searchParams = new URLSearchParams({
        current: this.searchData.current,
        pageSize: this.searchData.pageSize,
        name: this.searchData.name || "",
        code: this.searchData.code || "",
        identifyResult: this.searchData.identifyResult || "",
        isClosed: this.searchData.isClosed || "",
        identifyUserId: this.searchData.identifyUserId || "",
        date: this.searchData.date || "",
        month: this.searchData.month || "",
        year: this.searchData.year || "",
        identifyDate: this.searchData.identifyDate
          ? this.dateFormat(this.searchData.identifyDate)
          : "",
      });
      window.open(
        `/api/archiveAuthenticateRecord/download?${searchParams}`,
        "_blank"
      );
    },
    showLog(row) {
      this.logDialogFormData = {
        ...row,
      };
      this.showLogDialog = true;
    },
    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX;
    },
    handleTableSelectionChange(val) {
      this.tableMultipleSelection = val;
    },
    async archiveAuthenticateRecordExport() {
      const params = {
        idList: this.tableMultipleSelection
          .map((item) => item.id)
          .filter(Boolean)
          .join(),
      };
      const searchParams = new URLSearchParams(params);
      window.open(
        `/api/archiveAuthenticateRecord/selectDownload?${searchParams}`,
        "_blank"
      );
    },
    handleExportCommand(command) {
      switch (command) {
        case 1:
          this.archiveAuthenticateRecordDownload();
          break;
        case 2:
          this.archiveAuthenticateRecordExport();
          break;
        default:
          break;
      }
    },
  },
});
export default VerificationLog;
</script>

<style lang="scss" scoped>
.page-verification-log {
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
      height: 100%;
      overflow-y: auto;
      border: #e5e5e5 1px solid;
    }
    .table-wrapper {
      flex: 1;
      width: 0;
      .identify-result {
        padding: 6px 8px;
        border-radius: 8px;
        color: #fff;
      }
      .identify-type--1 {
        background-color: #67c23a;
      }
      .identify-type--2 {
        background-color: #f56c6c;
      }
      .identify-type--3 {
        background-color: #909399;
      }
    }
  }
}
</style>
