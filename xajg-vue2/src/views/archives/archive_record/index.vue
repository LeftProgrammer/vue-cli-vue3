<template>
  <div class="page-archive-record">
    <TreeTableLayout
      :page="searchData"
      title="文件列表"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="案卷题名">
            <el-input
              v-model="searchData.recordsName"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="档号">
            <el-input
              v-model="searchData.reference"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="案卷状态">
            <el-select
              v-model="searchData.status"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in statusList"
                :key="item.dictId"
                :label="item.dictName"
                :value="item.dictId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核时间">
            <el-date-picker
              v-model="date"
              clearable
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              style="width: 300px !important"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button type="primary" plain @click="archiveAdvanceStoreDownload">导出</el-button>
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
                node-key="id"
                :expand-on-click-node="false"
                @node-click="handelNodeClick"
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
            <DragLine :min-move-x="0" @moveEnd="handelMoveEnd" />
          </div>

          <div class="table-wrapper">
            <el-table :data="tableData" height="100%" stripe border>
              <el-table-column label="序号" align="center" width="54">
                <template #default="{ $index }">
                  {{
                    $index + 1 + (searchData.pageNum - 1) * searchData.pageSize
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="recordsName"
                show-overflow-tooltip
                label="案卷题名"
                min-width="400"
                align="left"
              />
              <el-table-column
                prop="reference"
                show-overflow-tooltip
                label="档号"
                width="120"
                align="left"
              />
              <el-table-column
                prop="nodeName"
                show-overflow-tooltip
                label="案卷目录"
                width="120"
                align="left"
              />
              <el-table-column
                prop="filingCorpName"
                label="立卷单位"
                align="left"
                width="120"
              />
              <el-table-column
                prop="formationTime"
                label="立卷日期"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  {{ dateFormat(row.filingDate) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="案卷状态"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  {{ row.filingStatus }}
                </template>
              </el-table-column>
              <el-table-column
                prop="checkStartDate"
                label="审核发起时间"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  {{ dateFormat(row.checkStartDate) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="filingFinishDate"
                label="结束时间"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  {{ dateFormat(row.filingFinishDate) }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="200"
                fixed="right"
              >
                <template slot-scope="{ row }">
                  <div class="table-btn">
                    <el-button type="text" @click="showRow(row)">查看</el-button>
                    <el-button type="text" @click="downloadFile(row.recordsId)">下载</el-button>
                    <el-button type="text" @click="showRecord(row.businessId)">审核记录</el-button>
                    <el-button type="text" @click="previewFile(row.localReport)">四性检测报告</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <el-dialog :visible.sync="showDialog" :title="title" width="80%" top="50px">
      <el-form
        ref="dialogForm"
        :model="dialogFormData"
        label-width="100px"
        class="dialog-form"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="档号" prop="reference">
              <el-input v-model="dialogFormData.reference" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属节点" prop="nodeName">
              <el-input v-model="dialogFormData.nodeName" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目代号" prop="projectCode">
              <el-input
                v-model="dialogFormData.projectCode"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="分类号" prop="typeCode">
              <el-input v-model="dialogFormData.typeCode" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案卷流水号" prop="recordsSerialNumber">
              <el-input
                v-model="dialogFormData.recordsSerialNumber"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案卷题名" prop="recordsName">
              <el-input v-model="dialogFormData.recordsName" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="立卷单位" prop="filingCorpId">
              <el-input
                v-model="dialogFormData.filingCorpName"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起止日期" prop="Date">
              <el-date-picker
                v-model="dialogFormData.Date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                disabled
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="立卷人" prop="filingUserId">
              <el-input
                v-model="dialogFormData.filingUserName"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="立卷日期" prop="filingDate">
              <el-date-picker
                v-model="dialogFormData.filingDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                disabled
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属合同" prop="contract">
              <el-input
                v-model="dialogFormData.contract"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="子项目" prop="project">
              <el-input
                v-model="dialogFormData.project"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单位工程" prop="unitEngineering">
              <el-input
                v-model="dialogFormData.unitEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分部工程" prop="branchEngineering">
              <el-input
                v-model="dialogFormData.branchEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="阶段" prop="stage">
              <el-input
                v-model="dialogFormData.stage"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="专业" prop="speciality">
              <el-input
                v-model="dialogFormData.speciality"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保管期限" prop="retentionPeriod">
              <el-input
                v-model="dialogFormData.retentionPeriod"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密级" prop="classification">
              <el-input
                v-model="dialogFormData.classification"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="总页数" prop="pageNum">
              <el-input
                v-model="dialogFormData.pageNum"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="照片张数" prop="picNum">
              <el-input
                v-model="dialogFormData.picNum"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="脊背宽度" prop="backboneWidth">
              <el-input
                v-model="dialogFormData.backboneWidth"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="归档份数" prop="fileNum">
              <el-input
                v-model="dialogFormData.fileNum"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="归档单位" prop="fileCorpId">
              <el-input
                v-model="dialogFormData.fileCorpId"
                placeholder="请输入"
                disabled
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="整编人" prop="fileUserName">
              <el-input
                v-model="dialogFormData.fileUserName"
                placeholder="请输入"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="整编日期" prop="fileDate">
              <el-input
                v-model="dialogFormData.fileDate"
                placeholder="请输入"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="notes">
              <el-input
                v-model="dialogFormData.notes"
                type="textarea"
                rows="3"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="enclosure">
        <span>卷内文件列表</span>
      </div>
      <el-table :data="fileList" max-height="280px">
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="文件题名" prop="name" align="center">
          <template #default="{ row }">
            <el-button
              type="text"
              :title="row.name"
              @click="showFileRow(row)"
            >{{ row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="文件编号" align="center" />
        <el-table-column
          prop="createCorpName"
          label="形成单位"
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
      </el-table>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="showDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showFileDialog" title="查看文档" top="50px">
      <el-form :model="fileDetail" label-width="100px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="文件题名" prop="name">
              <el-input
                v-model="fileDetail.name"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="形成单位" prop="createCorpName">
              <el-input
                v-model="fileDetail.createCorpName"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="形成时间" prop="createDate">
              <el-date-picker
                v-model="fileDetail.createDate"
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
                v-model="fileDetail.version"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传日期" prop="uploadDate">
              <el-date-picker
                v-model="fileDetail.uploadDate"
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
                v-model="fileDetail.contract"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子项目" prop="childProject">
              <el-input
                v-model="fileDetail.childProject"
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
                v-model="fileDetail.unitEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分部工程" prop="branchEngineering">
              <el-input
                v-model="fileDetail.branchEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="notes">
              <el-input
                v-model="fileDetail.notes"
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
      <el-table :data="fileDialogList" max-height="280px">
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="filename" label="附件名称" align="center">
          <template
            #default="{ row }"
            :title="(row.attachment && row.attachment.fileName) || '-'"
          >
            <el-button
              type="text"
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
        <el-button @click="showFileDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="流程处理表单"
      custom-class="wbench-el-dialog flow-dialog"
      :visible.sync="multiArchiveFlowShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      center
      fullscreen
      @closed="handleClosed('multiArchiveFlowShow')"
    >
      <SzgcProcessGetor
        v-if="multiArchiveFlowShow"
        ref="SzgcProcessGetorMultiArchiveFlow"
        :top-show="false"
        :page="multiArchiveFlowPageType"
        :data-all="multiArchiveDataAll"
        @childEvt="childEvtHandle('multiArchiveFlowShow')"
      />
    </el-dialog>
  </div>
</template>

<script>
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import { SzgcProcessGetor } from "@szgc/wbench";
import {
  getArchiveCatalogueTree,
  archiveFileRecordPageList,
  getArchiveAdvanceStoreDetail,
  archiveAdvanceStoreDownload,
  getArchiveFileDetail,
  getFlowConfigs,
  getFilePath,
} from "@/api/archives.js";
import { dateFormat } from "@/utils";
import DragLine from "../shared_component/DragLine";

export default {
  name: "ArchiveRecord",
  components: { TreeTableLayout, SzgcProcessGetor, DragLine },
  data() {
    return {
      searchData: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        nodeId: undefined,
        status: undefined,
        recordsName: "",
        reference: "",
        filingCorpId: "",
        startDate: null,
        endDate: null,
      },
      date: [],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      tableData: [],
      selectionNode: {},
      statusList: [
        { dictId: 1, dictName: "已组卷" },
        { dictId: 2, dictName: "预审中" },
        { dictId: 3, dictName: "已预审" },
        { dictId: 4, dictName: "审核中" },
        { dictId: 5, dictName: "审核未通过" },
        { dictId: 6, dictName: "归档中" },
        { dictId: 7, dictName: "已归档" },
        { dictId: 8, dictName: "归档失败" },
      ],
      statusListMap: {
        1: "已组卷",
        2: "预审中",
        3: "已预审",
        4: "审核中",
        5: "审核未通过",
        6: "归档中",
        7: "已归档",
        8: "归档失败",
      },
      showDialog: false,
      dialogFormData: {},
      title: "",
      isAdd: false,
      isSHow: false,
      fileList: [],
      fileDialogList: [],
      fileDetail: {},
      showFileDialog: false,
      multiArchiveFlowShow: false,
      multiArchiveDataAll: {
        businessId: "",
        taskId: "",
      },
      multiArchiveDataAllCache: {}, // 缓存
      multiArchiveFlowPageType: "mine", // fine 查看 mine 发起
      multiArchivePackageId: "1226480574269489152",
      treeWidth: 267,
    };
  },
  async mounted() {
    await this.getFlowConfigs(
      this.multiArchivePackageId,
      "multiArchiveDataAll"
    );
    this.init();
  },
  methods: {
    dateFormat,
    handelPageSizeChange(page) {
      this.searchData.pageNum = 1;
      this.searchData.pageSize = page.pageSize;
      this.archiveFileRecordPageList();
    },
    handelCurrentChange(page) {
      this.searchData.pageNum = page.current;
      this.archiveFileRecordPageList();
    },
    handelSearchButtonClick() {
      this.searchData.pageNum = 1;
      this.searchData.nodeId = "";
      this.archiveFileRecordPageList();
    },
    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.searchData = metaData.searchData;
      this.date = metaData.date;
      // this.searchData.nodeId = this.selectionNode.id;
      this.searchData.nodeId = "";
      this.archiveFileRecordPageList();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handelNodeClick(data, node, own) {
      // 只能选中叶节点
      // if (!node.isLeaf) {
      //   this.$refs.tree.setCurrentNode(this.selectionNode);
      //   return;
      // }
      this.selectionNode = data;
      this.searchData.nodeId = this.selectionNode.id;
      this.searchData.pageNum = 1;
      this.archiveFileRecordPageList();
    },
    async init() {
      const res = await this.getArchiveCatalogueTree();
      if (res?.length > 0) {
        // 默认查询所有 修复禅道bug: #7981
        // const defaultNode = this.getFirstLeafNode(res);
        // this.searchData.nodeId = defaultNode.id;
        // this.selectionNode = defaultNode;
        this.$nextTick(() => {
          // const node = this.$refs.tree.getNode(defaultNode.id);
          // this.$refs.tree.setCurrentNode(node.data);

          this.archiveFileRecordPageList();
        });
      } else {
        this.treeData = [];
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
    async getArchiveCatalogueTree() {
      try {
        const { data, success, message } = await getArchiveCatalogueTree();

        if (!success) {
          this.$message.error("获取文件鉴定日期目录树失败：" + message);
          return false;
        }
        this.treeData = data || [];
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件鉴定日期目录树失败");
        return false;
      }
    },
    async archiveFileRecordPageList() {
      try {
        const searchData = { ...this.searchData };
        if (this.date?.length > 0) {
          searchData.startDate = this.date[0];
          searchData.endDate = this.date[1];
        }
        const { data, success, message } = await archiveFileRecordPageList(
          searchData
        );

        if (!success) {
          this.$message.error("获取文件预归档列表失败：" + message);
          return false;
        }
        this.tableData = data.records;
        this.searchData.total = data.total;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件预归档列表失败");
        return false;
      }
    },
    // 点击查看
    async showRow(row) {
      const res = await this.getArchiveAdvanceStoreDetail(row.recordsId);
      if (res) {
        this.dialogFormData = res;
        this.dialogFormData.filingDate = res.filingDate
          ? this.dateFormat(res.filingDate)
          : "";
        this.dialogFormData.fileDate = res.fileDate
          ? this.dateFormat(res.fileDate)
          : "";
        this.dialogFormData.Date = res.beginDate
          ? [this.dateFormat(res.beginDate), this.dateFormat(res.endDate)]
          : [];
        this.fileList = res.fileStoreList || [];
        this.title = "查看案卷";
        this.isAdd = false;
        this.isSHow = true;
        this.showDialog = true;
      }
    },
    // 查询案卷详情
    async getArchiveAdvanceStoreDetail(id) {
      try {
        const { data, success, message } = await getArchiveAdvanceStoreDetail(
          id
        );

        if (!success) {
          this.$message.error("查询案卷详情失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询案卷详情失败");
        return false;
      }
    },
    async archiveAdvanceStoreDownload() {
      const params = {
        pageNum: this.searchData.pageNum,
        pageSize: this.searchData.pageSize,
        recordsName: this.searchData.recordsName || "",
        reference: this.searchData.reference || "",
        status: this.searchData.status || "",
      };
      if (this.date?.length > 0) {
        searchParams.startDate = this.dateFormat(this.date[0]);
        searchParams.endDate = this.dateFormat(this.date[1]);
      }

      const searchParams = new URLSearchParams(params);
      window.open(`/api/archiveFileRecord/download?${searchParams}`, "_blank");
    },
    downloadFile(id) {
      window.open(`/api/archiveAdvanceStore/downloadFile?id=${id}`);
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
    async showFileRow(row) {
      const res = await this.getArchiveFileDetail(row.id);
      if (res) {
        this.fileDetail = res;
        this.fileDetail.uploadDate = this.dateFormat(res.uploadDate);
        this.fileDetail.createDate = this.dateFormat(res.createDate);
        this.fileDialogList = res.archiveFileAttachmentVoList || [];
        this.showFileDialog = true;
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
    async getFlowConfigs(pacId, varName) {
      try {
        const { data, success, message } = await getFlowConfigs({
          pacId,
        });
        if (!success) {
          this.$message.error("获取流程配置失败：" + message);
          return false;
        }
        // this.flowConfigList = data;
        if (Array.isArray(data) && data.length > 0) {
          this[`${varName}Cache`] = {
            businessId: data[0].flowConfigId,
            taskId: "",
          };
        }
        return data;
      } catch (error) {
        console.error(error);
        this.$message.error("获取流程配置失败");
        return false;
      }
    },
    showRecord(businessId) {
      this.multiArchiveFlowShow = true;
      this.multiArchiveDataAll.businessId = businessId;
      this.multiArchiveFlowPageType = "fine";
      localStorage.setItem("multi_archive_flow_readonly", "1");
    },
    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX;
    },
  },
};
</script>

<style lang="scss" scoped>
.page-archive-record {
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
      //   width: 250px;
      height: 100%;
      overflow-y: auto;
      border: #e5e5e5 1px solid;
      //   resize: horizontal;
      //   min-width: 250px;
    }
    .table-wrapper {
      flex: 1;
      width: 0;
    }
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
