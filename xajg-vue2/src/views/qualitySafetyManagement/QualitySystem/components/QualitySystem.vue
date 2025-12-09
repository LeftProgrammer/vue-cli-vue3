<template>
  <div class="page-measure-system">
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
          <el-form-item label="文件编号">
            <el-input
              v-model="searchData.code"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="文件名称">
            <el-input
              v-model="searchData.name"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="上传日期">
            <el-date-picker
              v-model="searchData.uploadDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="所属标段">
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
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button type="primary" icon="el-icon-plus" v-if="!loginInfo.systemManager" @click="handelAdd"
          >新增</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          :disabled="!activeItem.corpId"
          @click="handelExport"
          >导出</el-button
        >
      </template>
      <template slot="tree">
        <div class="list-content">
          <div class="list-wrapper">
            <h4>单位列表</h4>
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
        </div>
        
      </template>
      <template slot="table">
        <div class="content">
          <!-- <div class="list-wrapper">
            <h4>单位列表</h4>
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
          </div> -->

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
                prop="name"
                show-overflow-tooltip
                label="文件名称"
                align="center"
              />
              <el-table-column
                prop="sectionName"
                show-overflow-tooltip
                label="所属标段"
                align="center"
              />
              <el-table-column prop="pbsName" label="工程部位" align="center" />
              <el-table-column
                prop="uploadUserName"
                label="上传人"
                align="center"
              />
              <el-table-column
                prop="uploadDate"
                label="上传日期"
                align="center"
              >
                <template #default="{ row }">
                  {{ dateFormat(row.uploadDate) }}
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
                    <el-button type="text" @click="handelEdit(row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="text"
                      @click="deleteQualitySystemManagement(row)"
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
    <el-dialog
      :visible.sync="showDialog"
      width="50%"
      top="50px"
      :title="typeName"
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
            <el-form-item label="文件类型" prop="typeName">
              <el-input readonly :value="dialogFormData.typeName" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件添加方式" prop="method">
              <el-radio-group
                v-model="dialogFormData.method"
                :disabled="dialogReadonly"
                @change="handelMethodChange"
              >
                <el-radio :label="1">手动上传</el-radio>
                <el-radio :label="2">文件关联</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <template v-if="dialogFormData.method === 1">
            <el-col :span="24">
              <el-form-item label="文件编号" prop="code">
                <el-input
                  v-model.trim="dialogFormData.code"
                  :disabled="dialogReadonly"
                  maxlength="100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="文件名称" prop="name">
                <el-input
                  v-model.trim="dialogFormData.name"
                  :disabled="dialogReadonly"
                  maxlength="200"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属标段" prop="section">
                <el-select
                  v-model="dialogFormData.section"
                  clearable
                  placeholder="请选择"
                  style="width: 100%"
                  :disabled="dialogReadonly"
                >
                  <el-option
                    v-for="item in sectionList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="工程部位" prop="pbs">
                <pbsSelect
                  v-model="dialogFormData.pbs"
                  :readonly="dialogReadonly"
                  type="code"
                />
              </el-form-item>
            </el-col>
          </template>
          <template v-else>
            <el-col :span="24">
              <el-form-item label="关联文件" prop="relatedReceiving">
                <FileSystemPick
                  v-model="dialogFormData.relatedReceiving"
                  :readonly="dialogReadonly"
                  :unitType="activeItem.corpType"
                  :relatedReceivingName="dialogFormData.relatedReceivingName"
                  @change="handelChange"
                />
              </el-form-item>
            </el-col>
          </template>

          <el-col :span="12">
            <el-form-item label="上传人" prop="uploadUserName">
              <el-input
                v-model="dialogFormData.uploadUserName"
                placeholder="请输入"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传日期" prop="uploadDate">
              <el-input
                v-model="dialogFormData.uploadDate"
                placeholder="请输入"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="正文" prop="content">
              <el-upload
                action="/api/file/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove.bind(this, 'content')"
                :before-remove="beforeRemove"
                :before-upload="beforeUpload"
                :on-success="handelUploadSuccess.bind(this, 'content')"
                :file-list="dialogFormData.content"
                :disabled="dialogReadonly || dialogFormData.method === 2"
                :limit="1"
                :on-exceed="handleExceed"
              >
                <el-button size="small" type="primary" :disabled="dialogReadonly || dialogFormData.method === 2">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="attachment">
              <el-upload
                action="/api/file/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove.bind(this, 'attachment')"
                :before-remove="beforeRemove"
                :before-upload="beforeUpload"
                :on-success="handelUploadSuccess.bind(this, 'attachment')"
                :file-list="dialogFormData.attachment"
                :disabled="dialogReadonly || dialogFormData.method === 2"
              >
                <el-button size="small" type="primary" :disabled="dialogReadonly || dialogFormData.method === 2">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="handelDialogClose">关 闭</el-button>
        <el-button
          v-if="!dialogReadonly"
          type="primary"
          @click="handelDialogConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { dateFormat } from "@/utils";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import {
  getCorporateList,
  getQualitySystemManagementPageList,
  deleteQualitySystemManagement,
  addQualitySystemManagement,
  updateQualitySystemManagement,
  getQualitySystemManagementDetail,
  getSectionList,
  getMeasureDict,
  getSlefCorporates
} from "@/api/quality";
import { getFilePath } from "@/api/archives.js";
import FileSystemPick from "./FileSystemPick";

import { defineComponent } from "vue";
const QualitySystem = defineComponent({
  name: "QualitySystem",
  components: { TreeTableLayout, FileSystemPick },
  props: {
    type: {
      type: String,
    },
    typeName: {
      type: String,
    },
  },
  data() {
    return {
      searchData: {
        total: 0,
        current: 1,
        pageSize: 20,
        code: "",
        section: "",
        name: "",
        type: this.type,
        uploadDate: "",
        corp: "",
      },
      departList: [],
      tableData: [],
      achieveTypeOptions: [],
      sectionList: [],
      reportTypeOptions: [],
      activeItem: {},
      corpId: "",
      showDialog: false,
      dialogReadonly: false,
      dialogFormData: {
        attachment: "",
        code: "",
        corp: "",
        method: 1,
        name: "",
        pbs: "",
        relatedReceiving: "",
        section: "",
        type: this.type,
        uploadDate: "",
        uploadUser: 0,
        content: [],
        attachment: [],
      },
      dialogFormRules: {
        method: {
          required: true,
          message: "请选择成果类型",
          trigger: "change",
        },
        code: [
          {
            required: true,
            message: "请输入文件编号",
            trigger: "blur",
          },
          { max: 100, message: "长度最大 100 个字符", trigger: "blur" },
        ],
        name: [
          {
            required: true,
            message: "请输入文件名称",
            trigger: "blur",
          },
          { max: 200, message: "长度最大 200 个字符", trigger: "blur" },
        ],
        section: {
          required: true,
          message: "请选择工程部位",
          trigger: "blur",
        },
        pbs: {
          required: true,
          message: "请选择工程部位",
          trigger: "blur",
        },
        uploadUserName: {
          required: true,
          message: "请选择上传人",
          trigger: "blur",
        },
        uploadDate: {
          required: true,
          message: "请选择上传日期",
          trigger: "blur",
        },
        content: {
          type: "array",
          required: true,
          message: "请上传文件",
          trigger: "change",
        },
        relatedReceiving: {
          required: true,
          message: "请选择关联文件",
          trigger: "blur",
        },
      },
    };
  },
  computed: {
    ...mapGetters(["loginInfo"]),
  },

  async mounted() {
    if (!this.loginInfo.systemManager) {
      this.getSlefCorporates();
    }
    const res = await this.getCorporateList();

    this.getMeasureDict("cl-cglx", "achieveTypeOptions");
    this.getMeasureDict("cl-bslx", "reportTypeOptions");
    this.getSectionList();
    this.handelSearchButtonClick();
    // if (Array.isArray(res) && res.length > 0) {
    //   this.handelListItemClick(res[0]);
    // }
  },
  methods: {
    dateFormat,
    handelSearchButtonClick() {
      this.searchData.current = 1;
      this.getQualitySystemManagementPageList();
    },
    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.searchData = metaData.searchData;
      this.searchData.corp = this.activeItem.corpId;
      this.getQualitySystemManagementPageList();
    },
    async handelListItemClick(data, node, own) {
      this.activeItem = data;
      this.searchData.current = 1;
      this.searchData.corp = data.corpId;
      this.searchData.section = "";
      this.getQualitySystemManagementPageList();
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
    async getSectionList() {
      try {
        const { data, success, message } = await getSectionList({});

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
    async getSlefCorporates() {
      try {
        const { data, success, message } = await getSlefCorporates({});

        if (!success) {
          this.$message.error("获取我的单位信息失败：" + message);
          return false;
        }
        this.corpId = data.corpId;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取我的单位信息失败");
        return false;
      }
    },
    async getMeasureDict(dictType, varName) {
      try {
        const { data, success, message } = await getMeasureDict({
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

    // 查表格数据
    async getQualitySystemManagementPageList() {
      this.tableData = [];
      try {
        const { data, success, message } =
          await getQualitySystemManagementPageList(this.searchData);

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

    handelPageSizeChange(page) {
      this.searchData.current = 1;
      this.searchData.pageSize = page.pageSize;
      this.getQualitySystemManagementPageList();
    },
    handelCurrentChange(page) {
      this.searchData.current = page.current;
      this.getQualitySystemManagementPageList();
    },
    async handelAdd() {
      // if (!this.corpId) return;
      this.showDialog = true;
      this.dialogReadonly = false;
      this.dialogFormData = this.$options.data().dialogFormData;
      this.dialogFormData.corp = this.corpId;
      this.dialogFormData.type = this.type;
      this.dialogFormData.typeName = this.typeName;
      this.dialogFormData.corporateName = this.activeItem.corpName;
      this.dialogFormData.uploadUserName = this.loginInfo.realName;
      this.dialogFormData.uploadUser = this.loginInfo.userId;
      this.dialogFormData.uploadDate = this.dateFormat(new Date());
    },
    async getQualitySystemManagementDetail(id) {
      try {
        const { data, success, message } =
          await getQualitySystemManagementDetail({ id });

        if (!success) {
          this.$message.error("查询详情数据失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询详情数据失败");
        return false;
      }
    },
    async handelInspect(row) {
      const data = await this.getQualitySystemManagementDetail(row.id);
      if (!data) return;
      this.dialogFormData = data;
      this.dialogFormData.uploadDate = this.dateFormat(
        this.dialogFormData.uploadDate
      );
      this.dialogFormData.attachment = (
        this.dialogFormData.attachmentList || []
      ).map((item) => ({
        url: item.requestRelativeUrl,
        name: item.fileName,
        requestRelativeUri: item.requestRelativeUrl,
        attId: item.fileId,
      }));
      this.dialogFormData.content = (this.dialogFormData.contentList || []).map(
        (item) => ({
          url: item.requestRelativeUrl,
          name: item.fileName,
          requestRelativeUri: item.requestRelativeUrl,
          attId: item.fileId,
        })
      );
      this.showDialog = true;
      this.dialogReadonly = true;
    },
    async handelEdit(row) {
      const data = await this.getQualitySystemManagementDetail(row.id);
      if (!data) return;
      this.dialogFormData = data;
      this.dialogFormData.uploadDate = this.dateFormat(
        this.dialogFormData.uploadDate
      );
      this.dialogFormData.attachment = (
        this.dialogFormData.attachmentList || []
      ).map((item) => ({
        url: item.requestRelativeUrl,
        name: item.fileName,
        requestRelativeUri: item.requestRelativeUrl,
        attId: item.fileId,
      }));
      this.dialogFormData.content = (this.dialogFormData.contentList || []).map(
        (item) => ({
          url: item.requestRelativeUrl,
          name: item.fileName,
          requestRelativeUri: item.requestRelativeUrl,
          attId: item.fileId,
        })
      );
      this.showDialog = true;
      this.dialogReadonly = false;
    },
    beforeDelete() {
      return this.$confirm("是否要删除这条数据 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
    },
    // 删除数据
    async deleteQualitySystemManagement(row) {
      try {
        await this.beforeDelete();
        const { data, success, message } = await deleteQualitySystemManagement({
          id: row.id,
        });
        if (!success) {
          this.$message.error("质量体系删除失败：" + message);
          return false;
        }
        this.$message.success("质量体系删除成功!");
        this.searchData.current = 1;
        this.getQualitySystemManagementPageList();
        return true;
      } catch (error) {
        console.error(error);
        if (error !== "cancel") {
          this.$message.error("质量体系删除失败");
        }
        return false;
      }
    },
    handelExport() {
      if (!this.activeItem.corpId) {
        return;
      }
      const query = new URLSearchParams(this.searchData);
      window.open(`/api/qualitySystemManagement/download?${query}`, "_blank");
    },
    beforeUpload(file) {
      const isRightSize = file.size / 1024 / 1024 < 500;
      if (!isRightSize) {
        this.$message.error("文件大小超过 500MB");
      }
      return isRightSize;
    },
    handleRemove(varName, file) {
      this.dialogFormData[varName] = this.dialogFormData[varName].filter(
        (item) => item.attId !== file.attId
      );
    },
    async handlePreview(file) {
      // window.open(`/api/file/getFileForApp?fileInfoId=${file.attId}`, "_blank");
      try {
        const { data, success, message } = await getFilePath({
          fileInfoId: file.attId,
          isDownload: 0,
          fileName: file.name || "",
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
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handelUploadSuccess(varName, res) {
      this.dialogFormData[varName].push({
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
      if (this.dialogFormData.id) {
        // 编辑
        this.updateQualitySystemManagement();
      } else {
        this.addQualitySystemManagement();
      }
    },
    async addQualitySystemManagement() {
      try {
        const { data, success, message } = await addQualitySystemManagement({
          ...this.dialogFormData,
          type: this.type,
          attachment: this.dialogFormData.attachment
            .map((item) => item.attId)
            .join(),
          content: this.dialogFormData.content.map((item) => item.attId).join(),
        });

        if (!success) {
          this.$message.error("创建质量体系信息失败：" + message);
          return false;
        }
        this.$message.success("创建质量体系信息成功");
        this.handelDialogClose();
        this.searchData.current = 1;
        this.getQualitySystemManagementPageList();
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("创建质量体系信息失败");
        return false;
      }
    },
    async updateQualitySystemManagement() {
      try {
        const { data, success, message } = await updateQualitySystemManagement({
          ...this.dialogFormData,
          attachment: this.dialogFormData.attachment
            .map((item) => item.attId)
            .join(),
          content: this.dialogFormData.content.map((item) => item.attId).join(),
        });

        if (!success) {
          this.$message.error("修改质量体系信息失败：" + message);
          return false;
        }
        this.$message.success("修改质量体系信息成功");
        this.handelDialogClose();
        this.getQualitySystemManagementPageList();
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("修改质量体系信息失败");
        return false;
      }
    },
    handelMethodChange() {
      this.dialogFormData = {
        ...this.dialogFormData,
        content: [],
        attachment: [],
        pbs: "",
        relatedReceiving: "",
        code: "",
        name: "",
        section: "",
        pbs: ""
      }
    },
    handelChange(id, file) {
      console.log(file);
      try {
        if (file.uploadFileContent) {
          const uploadFileContent = JSON.parse(file.uploadFileContent);
          this.dialogFormData.content = uploadFileContent.map((item) => ({
            attId: item.fileId,
            name: item.name,
          }));
        }

        if (file.uploadFile) {
          const uploadFile = JSON.parse(file.uploadFile);

          if (Array.isArray(uploadFile)) {
            this.dialogFormData.content = uploadFile.map((item) => ({
              attId: item.fileId,
              name: item.name,
            }));
          }
        }
      } catch (error) {
        console.error(error);
        this.dialogFormData.content = [];
        this.dialogFormData.attachment = [];
      }
    },
  },
});
export default QualitySystem;
</script>

<style lang="scss" scoped>
.page-measure-system {
  height: calc(100% - 55px);
  overflow: hidden;

  .content {
    width: 100%;
    display: flex;
    height: 100%;
    
    .table-wrapper {
      flex: 1;
      width: 0;
    }
  }
   .list-content {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
   }
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
}
</style>
