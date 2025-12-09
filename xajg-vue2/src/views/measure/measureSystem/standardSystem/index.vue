<template>
  <div class="page-standard-system">
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
          <el-form-item label="文件名称">
            <el-input
              v-model="searchData.attName"
              clearable
              placeholder="请输入"
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
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!activeItem.corpId"
          @click="handelAdd"
          v-if="loginInfo.corpId === activeItem.corpId"
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
                prop="attName"
                show-overflow-tooltip
                label="文件名称"
                align="center"
              />
              <el-table-column
                prop="section"
                show-overflow-tooltip
                label="所属标段"
                align="center"
              />
              <el-table-column
                prop="corporateName"
                show-overflow-tooltip
                label="所属单位"
                align="center"
              />
              <el-table-column prop="pbsName" label="工程部位" align="center" />
              <el-table-column
                prop="uploadDateStr"
                label="上传日期"
                align="center"
              />
              <el-table-column
                label="操作"
                align="center"
                width="200"
                fixed="right"
              >
                <template #default="{ row }">
                  <div class="table-btn">
                    <el-button type="text" @click="handelInspect(row)"
                      >查看</el-button
                    >
                    <el-button
                      type="text"
                      @click="handelEdit(row)"
                      v-if="loginInfo.corpId === activeItem.corpId"
                      >编辑</el-button
                    >
                    <el-button
                      type="text"
                      @click="deleteStandardInfo(row)"
                      v-if="loginInfo.corpId === activeItem.corpId"
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
      title="标准体系"
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
            <el-form-item label="体系文件" prop="fileList">
              <el-upload
                action="/api/file/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :before-remove="beforeRemove"
                :on-success="handelUploadSuccess"
                :file-list="dialogFormData.fileList"
                :disabled="dialogReadonly"
                :limit="1"
                :on-exceed="handleExceed"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件名称" prop="attName">
              <el-input
                v-model.trim="dialogFormData.attName"
                :disabled="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工程部位" prop="pbs">
              <pbsSelect
                v-model="dialogFormData.pbs"
                :readonly="dialogReadonly"
                type="id"
              ></pbsSelect>
            </el-form-item>
          </el-col>

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
          <el-col :span="12">
            <el-form-item label="所属单位" prop="corporateName">
              <el-input
                v-model="dialogFormData.corporateName"
                placeholder="请输入"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
                  :value="item.name"
                />
              </el-select>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { dateFormat } from "@/utils";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";

import {
  getCorporateList,
  getStandardInfoPageList,
  deleteStandardInfo,
  createStandardInfo,
  updateStandardInfo,
  getSectionList,
} from "@/api/measure";
export default {
  name: "StandardSystem",
  components: { TreeTableLayout },
  computed: {
    ...mapGetters(["loginInfo"]),
  },
  data() {
    return {
      searchData: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        attName: "",
        section: "",
      },
      departList: [],
      sectionList: [],
      tableData: [],
      activeItem: {},
      showDialog: false,
      dialogReadonly: false,
      dialogFormData: {
        attId: "",
        attName: "",
        corporateId: "",
        corporateName: "",
        pbs: "",
        section: "",
        uploadUserId: 0,
        uploadUserName: "",
        uploadDate: "",
        fileList: [],
      },
      dialogFormRules: {
        attName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
          { max: 50, message: "长度最大 50 个字符", trigger: "blur" },
        ],
        fileList: {
          type: "array",
          required: true,
          message: "请上传文件",
          trigger: "change",
        },
      },
    };
  },
  async mounted() {
    const res = await this.getCorporateList();
    this.getSectionList();
    if (Array.isArray(res) && res.length > 0) {
      this.handelListItemClick(res[0]);
    }
  },
  methods: {
    dateFormat,
    handelSearchButtonClick() {
      this.searchData.pageNum = 1;
      this.getStandardInfoPageList();
    },
    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.searchData = metaData.searchData;
      this.searchData.corporateId = this.activeItem.corpId;
      this.getStandardInfoPageList();
    },
    async handelListItemClick(data) {
      this.activeItem = data;
      this.searchData.pageNum = 1;
      this.searchData.corporateId = data.corpId;
      this.searchData.section = "";
      // await this.getSectionList(data.corpId);
      this.getStandardInfoPageList();
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
        const { data, success, message } = await getSectionList({})

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

    // 查表格数据
    async getStandardInfoPageList() {
      this.tableData = [];
      try {
        const { data, success, message } = await getStandardInfoPageList(
          this.searchData
        );

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
      this.searchData.pageNum = 1;
      this.searchData.pageSize = page.pageSize;
      this.getStandardInfoPageList();
    },
    handelCurrentChange(page) {
      this.searchData.pageNum = page.current;
      this.getStandardInfoPageList();
    },
    async handelAdd() {
      if (!this.activeItem.corpId) {
        return;
      }
      this.dialogFormData.corporateId = this.activeItem.corpId;
      this.dialogFormData.corporateName = this.activeItem.corpName;
      this.dialogFormData.uploadUserName = this.loginInfo.realName;
      this.dialogFormData.uploadUserId = this.loginInfo.userId;
      this.dialogFormData.uploadDate = this.dateFormat(new Date());
      this.showDialog = true;
      this.dialogReadonly = false;
    },
    async handelInspect(row) {
      this.showDialog = true;
      this.dialogReadonly = true;
      this.dialogFormData = structuredClone(row);
      this.dialogFormData.uploadDate = this.dateFormat(this.dialogFormData.uploadDate);
      this.dialogFormData.fileList = ([this.dialogFormData.fileInfo] || []).map(
        (item) => ({
          url: item.requestRelativeUrl,
          name: item.fileName,
          requestRelativeUri: item.requestRelativeUrl,
          attId: item.fileId,
        })
      );
    },
    async handelEdit(row) {
      this.showDialog = true;
      this.dialogReadonly = false;
      this.dialogFormData = structuredClone(row);
      this.dialogFormData.uploadDate = this.dateFormat(this.dialogFormData.uploadDate);
      this.dialogFormData.fileList = ([this.dialogFormData.fileInfo] || []).map(
        (item) => ({
          url: item.requestRelativeUrl,
          name: item.fileName,
          requestRelativeUri: item.requestRelativeUrl,
          attId: item.fileId,
        })
      );
    },
    beforeDelete() {
      return this.$confirm("是否要删除这条数据 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
    },
    // 删除数据
    async deleteStandardInfo(row) {
      try {
        await this.beforeDelete();
        const { data, success, message } = await deleteStandardInfo(row.id);
        if (!success) {
          this.$message.error("标准体系信息删除失败：" + message);
          return false;
        }
        this.$message.success("标准体系信息删除成功!");
        this.searchData.pageNum = 1;
        this.getStandardInfoPageList();
        return true;
      } catch (error) {
        console.error(error);
        if (error !== "cancel") {
          this.$message.error("标准体系信息删除失败");
        }
        return false;
      }
    },
    handleRemove(file) {
      this.dialogFormData.fileList = this.dialogFormData.fileList.filter(
        (item) => item.attId !== file.attId
      );
    },
    handelExport() {
      if (!this.activeItem.corpId) {
        return;
      }
      const query = new URLSearchParams(this.searchData);
      window.open(`/api/measure/standardInfo/export?${query}`, "_blank");
    },
    handlePreview(file) {
      window.open(`/api/file/getFileForApp?fileInfoId=${file.attId}`, "_blank");
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload(file) {
      const isRightSize = file.size / 1024 / 1024 < 500;
      if (!isRightSize) {
        this.$message.error("文件大小超过 500MB");
      }
      return isRightSize;
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
      if (this.dialogFormData.id) {
        // 编辑
        this.updateStandardInfo();
      } else {
        this.createStandardInfo();
      }
    },
    async createStandardInfo() {
      try {
        const { data, success, message } = await createStandardInfo({
          ...this.dialogFormData,
          attId: this.dialogFormData.fileList.map((item) => item.attId).join(),
        });

        if (!success) {
          this.$message.error("创建标准体系信息失败：" + message);
          return false;
        }
        this.$message.success("创建标准体系信息成功");
        this.handelDialogClose();
        this.searchData.pageNum = 1;
        this.getStandardInfoPageList();
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("创建标准体系信息失败");
        return false;
      }
    },
    async updateStandardInfo() {
      try {
        const { data, success, message } = await updateStandardInfo({
          ...this.dialogFormData,
          attId: this.dialogFormData.fileList.map((item) => item.attId).join(),
        });

        if (!success) {
          this.$message.error("修改标准体系信息失败：" + message);
          return false;
        }
        this.$message.success("修改标准体系信息成功");
        this.handelDialogClose();
        this.getStandardInfoPageList();
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("修改标准体系信息失败");
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-standard-system {
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
