<template>
  <div class="page-subpackage-control">
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
          <el-form-item label="文件编号">
            <el-input
              v-model="searchData.code"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="标段">
            <el-select
              v-model="searchData.section"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in sectionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文件类型">
            <el-select
              v-model="searchData.fbType"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in fbTypeOptions"
                :key="item.dictId"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="分包类型">
            <el-select
              v-model="searchData.fbType"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in fbTypeOptions"
                :key="item.dictId"
                :label="item.dictName"
                :value="item.dictName"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="发起日期">
            <el-date-picker
              v-model="searchData.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button type="primary" plain icon="el-icon-download" @click="handelExport">导出</el-button>
      </template>
      <template slot="table">
        <div class="content">
          <div class="list-wrapper">
            <h4>参建单位列表</h4>
            <ul>
              <li
                v-for="item in departList"
                :key="item.corpId"
                :class="{ active: item === activeItem }"
                @click="handelListItemClick(item)"
              >
                {{ item.corpName }}
              </li>
            </ul>
          </div>

          <div class="table-wrapper">
            <el-table :data="tableData" height="100%" stripe border>
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="80"
              />
              <el-table-column
                prop="code"
                show-overflow-tooltip
                label="文件编号"
                align="center"
              />
              <el-table-column
                prop="title"
                show-overflow-tooltip
                label="标题"
                align="center"
              />
              <!-- <el-table-column
                prop="fbFileType"
                label="分包文件类型"
                align="center"
              /> -->
              <el-table-column
                prop="fbType"
                label="归档文件类型"
                align="center"
              />
              <el-table-column prop="section" label="标段" align="center" />
              <!-- <el-table-column
                prop="sendUnitName"
                label="发文单位"
                align="center"
              /> -->
              <el-table-column prop="sendDate" label="发起时间" align="center">
                <template #default="{ row }">
                  {{ dateFormat(row.sendDate, "yyyy-MM-dd HH:mm") }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="200px"
                fixed="right"
              >
                <template #default="{ row }">
                  <div class="table-btn">
                    <el-button type="text" @click="handelInspect(row)"
                      >查看</el-button
                    >
                  </div>
                  <div class="table-btn">
                    <el-button type="text" @click="handelEdit(row)"
                      >上传附件</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <el-dialog
      :visible.sync="showDialog"
      width="50%"
      top="50px"
      title="分包管理-附件"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dialogForm"
        :rules="dialogFormRules"
        :model="dialogFormData"
        label-width="120px"
        class="dialog-form"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="文件上传" prop="fileList">
              <el-upload
                action="/api/file/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :before-upload="beforeUpload"
                :on-success="handelUploadSuccess"
                :file-list="dialogFormData.fileList"
                :disabled="dialogReadonly"
                accept=".pdf"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="handelDialogClose">关 闭</el-button>
        <el-button
          type="primary"
          @click="handelDialogConfirm"
          v-if="!dialogReadonly"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- <PostingDoc ref="PostingDoc" class="indexForm" /> -->
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @closed="flowShow = false"
    ></flow-dialog>
  </div>
</template>

<script>
import { dateFormat } from "@/utils";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import { getSectionList } from "@/api/measure";
import {
  getCorporateList,
  getConstructionDict,
  getConstructionoPageList,
  uploadConstructionCustomFile,
  getConstructionDetail,
  getConstructionCustomFileList,
} from "@/api/construct";
import PostingDoc from "@/views/office/ownerSendDocument/newForm.vue";
import FlowDialog from "@/components/FlowHandle/Dialog";
export default {
  name: "SubpackageControl",
  components: { TreeTableLayout, PostingDoc, FlowDialog },
  computed: {},
  data() {
    return {
      searchData: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        code: "",
        section: "",
        time: [],
        fbFileType: "",
        fbType: "",
      },
      sectionList: [],
      departList: [],
      tableData: [],
      activeItem: {},
      fbFileTypeOptions: [],
      fbTypeOptions: [
        {
          dictId: "分包制度",
          dictName: "分包制度",
          dictCode: "分包制度",
        },
        {
          dictId: "分包计划",
          dictName: "分包计划",
          dictCode: "分包计划",
        },
        {
          dictId: "分包检查",
          dictName: "分包检查",
          dictCode: "分包检查",
        },
        {
          dictId: "分包审批及备案表",
          dictName: "分包审批及备案表",
          dictCode: "分包审批及备案表",
        },
      ],
      showDialog: false,
      dialogReadonly: false,
      dialogFormData: {
        fileList: [],
      },
      dialogFormRules: {
        fileList: {
          type: "array",
          required: true,
          message: "请上传文件",
          trigger: "change",
        },
      },
      flowShow: false,
      flowInfo: {},
    };
  },
  async mounted() {
    // this.getConstructionDict("fblx", "fbTypeOptions");
    // this.getConstructionDict("sg-fbwjlx", "fbFileTypeOptions");
    const res = await this.getCorporateList();
    if (Array.isArray(res) && res.length > 0) {
      this.handelListItemClick(res[0]);
    }
  },
  methods: {
    dateFormat,
    handelSearchButtonClick() {
      this.searchData.pageNum = 1;
      this.getConstructionoPageList();
    },
    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.searchData = metaData.searchData;
      this.searchData.corporateId = this.activeItem.corpId;
      this.getConstructionoPageList();
    },
    async handelListItemClick(data) {
      this.activeItem = data;
      this.searchData.pageNum = 1;
      this.searchData.corporateId = data.corpId;
      this.searchData.section = "";
      await this.getSectionList(data.corpId);
      this.getConstructionoPageList();
    },
    async getSectionList(corporateId) {
      try {
        const { data, success, message } = await getSectionList({
          corporateId,
        });

        if (!success) {
          this.$message.error("查询标段失败：" + message);
          return false;
        }
        this.sectionList = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询标段失败");
        return false;
      }
    },
    async getConstructionDict(dictType, varName) {
      try {
        const { data, success, message } = await getConstructionDict({
          dictType,
        });

        if (!success) {
          this.$message.error("字典查询失败：" + message);
          return false;
        }
        this[varName] = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("字典查询失败");
        return false;
      }
    },
    async getCorporateList() {
      try {
        const { data, success, message } = await getCorporateList();

        if (!success) {
          this.$message.error("查询单位列表失败：" + message);
          return false;
        }
        this.departList = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询单位列表失败");
        return false;
      }
    },
    // 查表格数据
    async getConstructionoPageList() {
      this.tableData = [];
      try {
        const { data, success, message } = await getConstructionoPageList({
          ...this.searchData,
          startDate: (this.searchData.time || [])[0] || "",
          endDate: (this.searchData.time || [])[1] || "",
        });

        if (!success) {
          this.$message.error("查询表格数据失败：" + message);
          return false;
        }
        this.tableData = data.records;
        this.searchData.total = data.total;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询表格数据失败");
        return false;
      }
    },

    async getConstructionDetail(id) {
      try {
        const { data, success, message } = await getConstructionDetail({
          id,
        });
        if (!success) {
          this.$message.error("获取详情失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取详情失败");
        return false;
      }
    },
    async getConstructionCustomFileList(businessId) {
      try {
        const { data, success, message } = await getConstructionCustomFileList({
          businessId,
        });
        if (!success) {
          this.$message.error("查询自定义附件列表失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询自定义附件列表失败");
        return false;
      }
    },

    handelPageSizeChange(page) {
      this.searchData.pageNum = 1;
      this.searchData.pageSize = page.pageSize;
      this.getConstructionoPageList();
    },
    handelCurrentChange(page) {
      this.searchData.pageNum = page.current;
      this.getConstructionoPageList();
    },
    async handelInspect(row) {
      const res = await this.getConstructionDetail(row.id);
      if (!res) {
        return;
      }
      const checkRow = {
        ...res,
        page: "fine",
        businessId: row.id,
        flowInfo: {
          page: "fine",
          businessId: row.id,
        },
        // signStatusList: (res.signStatusVos || []).map((item) => ({
        //   ...item,
        //   sendUnits: item.swUnit,
        // })),
      };
      this.flowInfo = {
        ...checkRow,
      };
      localStorage.setItem(
        "flow_data_row_" + res.flowConfigId,
        JSON.stringify(checkRow)
      );
      this.flowShow = true;
      //   this.$refs.PostingDoc.dialogShow = true;
      //   this.$nextTick(() => {
      //     this.$refs.PostingDoc.edit({ ...checkRow }, true);
      //   });
    },
    async handelEdit(row) {
      this.dialogFormData = structuredClone(row);
      const res = await this.getConstructionCustomFileList(row.id);
      if (res) {
        this.dialogFormData.fileList = (res || []).map((item) => ({
          url: item.requestRelativeUrl,
          name: item.fileName,
          requestRelativeUri: item.requestRelativeUrl,
          attId: item.fileId,
        }));
      } else {
        this.dialogFormData.fileList = [];
      }
      this.showDialog = true;
      this.dialogReadonly = false;
    },
    handlePreview(file) {
      window.open(`/api/file/getFileForApp?fileInfoId=${file.attId}`, "_blank");
    },
    beforeUpload(file) {
      const isPdf = file.type === "application/pdf";
      if (!isPdf) {
        this.$message.error("上传文件只能是 PDF 格式!");
      }
      return isPdf;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file) {
      this.dialogFormData.fileList = this.dialogFormData.fileList.filter(
        (item) => item.attId !== file.attId
      );
    },
    handelUploadSuccess(res) {
      this.dialogFormData.fileList.push({
        url: res.data.requestRelativeUrl,
        name: res.data.fileName,
        requestRelativeUri: res.data.requestRelativeUrl,
        attId: res.data.fileId,
      });
    },
    handelDialogClose() {
      this.showDialog = false;
      this.$refs.dialogForm.resetFields();
      this.dialogFormData = this.$options.data().dialogFormData;
    },
    beforeSubmit(refsName) {
      let res = true;
      this.$refs[refsName].validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      return res;
    },
    handelDialogConfirm() {
      if (!this.beforeSubmit("dialogForm")) return;
      this.uploadConstructionCustomFile();
    },
    async uploadConstructionCustomFile() {
      try {
        const { data, success, message } = await uploadConstructionCustomFile({
          businessId: this.dialogFormData.id,
          fileIds: this.dialogFormData.fileList
            .map((item) => item.attId)
            .join(),
        });

        if (!success) {
          this.$message.error("上传附件信息信息失败：" + message);
          return false;
        }
        this.$message.success("上传附件信息信息成功");
        this.handelDialogClose();
        this.searchData.pageNum = 1;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("上传附件信息失败");
        return false;
      }
    },
    handelExport() {

      const params = {
        ...this.searchData,
        startDate: (this.searchData.time || [])[0] ? this.dateFormat((this.searchData.time || [])[0])   : "",
        endDate: (this.searchData.time || [])[1] ? this.dateFormat((this.searchData.time || [])[1])  : "",
      };

      const searchParams = new URLSearchParams(params);
      window.open(
        `/api/construction/fb/export?${searchParams}`,
        "_blank"
      );
    }
  },
};
</script>

<style lang="scss" scoped>
.page-subpackage-control {
  height: 100%;
  overflow: hidden;
  .content {
    width: 100%;
    display: flex;
    height: 100%;
    .list-wrapper {
      width: 267px;
      height: 100%;
      overflow: auto;
      border: #e5e5e5 1px solid;
      padding: 10px;
      h4 {
        color: #303133;
        font-size: 16px;
      }
      ul {
        margin-top: 8px;
        font-size: 14px;

        list-style: none;
        li {
          cursor: pointer;
          padding: 8px 1em;
          transition: all 0.2s ease-in-out;
          &:hover {
            background-color: #f5f7fa;
          }
          &.active {
            color: #409eff;
            background-color: #d9ecff;
          }
        }
      }
    }
    .table-wrapper {
      flex: 1;
      width: 0;
    }
  }
}
</style>
