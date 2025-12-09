<template>
  <div class="page-person-info">
    <TreeTableLayout
      :page="searchData"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
      title="人员列表"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="姓名">
            <el-input
              v-model="searchData.userName"
              clearable
              placeholder="请输入"
            />
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
                prop="userName"
                show-overflow-tooltip
                label="姓名"
                align="left"
              />
              <el-table-column
                prop="job"
                show-overflow-tooltip
                label="职务"
                align="left"
              />
              <el-table-column
                prop="jobTitle"
                show-overflow-tooltip
                label="职称"
                align="left"
              />
              <el-table-column
                prop="corporateName"
                label="所属单位"
                align="left"
              />
              <el-table-column prop="phone" label="联系方式" align="left" />
              <el-table-column prop="holdCert" label="是否持证" align="left" />
              <el-table-column prop="onGuard" label="是否在岗" align="left" />
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
                    <el-button
                      type="text"
                      @click="handelEdit(row)"
                      v-if="loginInfo.corpId === activeItem.corpId"
                      >编辑</el-button
                    >
                    <el-button
                      type="text"
                      @click="deletePersonInfo(row)"
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
      title="测量人员"
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
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName">
              <el-input
                v-model.trim="dialogFormData.userName"
                :disabled="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input
                v-model.trim="dialogFormData.phone"
                :disabled="dialogReadonly"
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
            <el-form-item label="出生年月" prop="birthday">
              <el-date-picker
                v-model="dialogFormData.birthday"
                type="month"
                style="width: 100%"
                :disabled="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务" prop="job">
              <el-select
                v-model="dialogFormData.job"
                clearable
                placeholder="请选择"
                style="width: 100%"
                filterable
                allow-create
                default-first-option
                :disabled="dialogReadonly"
              >
                <el-option
                  v-for="item in jobOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="职称" prop="jobTitle">
              <el-input
                v-model="dialogFormData.jobTitle"
                placeholder="请输入"
                :disabled="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历" prop="edu">
              <el-input
                v-model="dialogFormData.edu"
                :disabled="dialogReadonly"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作年限" prop="workYear">
              <el-input
                v-model.number="dialogFormData.workYear"
                :disabled="dialogReadonly"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工种" prop="workType">
              <el-input
                v-model="dialogFormData.workType"
                :disabled="dialogReadonly"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否在岗" prop="onGuard">
              <el-select
                v-model="dialogFormData.onGuard"
                clearable
                placeholder="请选择"
                style="width: 100%"
                :disabled="dialogReadonly"
              >
                <el-option
                  v-for="item in yesOrNotOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否持证" prop="holdCert">
              <el-select
                v-model="dialogFormData.holdCert"
                clearable
                placeholder="请选择"
                style="width: 100%"
                :disabled="dialogReadonly"
              >
                <el-option
                  v-for="item in yesOrNotOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件">
              <el-upload
                action="/api/file/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handelUploadSuccess"
                :file-list="dialogFormData.fileList"
                :disabled="dialogReadonly"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-if="dialogFormData.holdCert === '是'">
        <div class="enclosure">
          <span>证书列表</span>
          <div v-if="!dialogReadonly">
            <el-button size="small" type="primary" @click="handelAddCertificate"
              >新增</el-button
            >
          </div>
        </div>
        <el-table :data="dialogFormData.certList" border max-height="280px">
          <el-table-column label="证书名称" align="center">
            <template #default="{ row }">
              <el-input
                v-model="row.certName"
                :disabled="dialogReadonly"
                maxlength="50"
              />
            </template>
          </el-table-column>
          <el-table-column label="发证机关" align="center">
            <template #default="{ row }">
              <el-input
                v-model="row.certOffice"
                :disabled="dialogReadonly"
                maxlength="50"
              />
            </template>
          </el-table-column>
          <el-table-column label="发证日期" align="center" width="160">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.certDate"
                type="date"
                style="width: 100%"
                :disabled="dialogReadonly"
              />
            </template>
          </el-table-column>
          <el-table-column label="证书编号" align="center">
            <template #default="{ row }">
              <el-input
                v-model="row.certNum"
                :disabled="dialogReadonly"
                maxlength="50"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="!dialogReadonly">
            <template #default="{ row, $index }">
              <div class="table-btn">
                <el-button type="text" @click="deleteCertificate(row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>

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
  getPersonInfoPageList,
  deletePersonInfo,
  createPersonInfo,
  updatePersonInfo,
} from "@/api/measure";
export default {
  name: "PersonInfo",
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
        userName: "",
        corporateId: "",
      },
      departList: [],
      tableData: [],
      activeItem: {},
      showDialog: false,
      dialogReadonly: false,
      dialogFormData: {
        userName: "",
        phonephone: "",
        corporateName: "",
        corporateId: "",
        birthday: "",
        job: "",
        jobTitle: "",
        edu: "",
        workYear: 1,
        workType: "",
        onGuard: "是",
        phone: "",
        holdCert: "",
        attId: "",
        certList: [],
        fileList: [],
      },
      dialogFormRules: {
        userName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
          { max: 10, message: "长度最大 10 个字符", trigger: "blur" },
        ],
        phone: [
          {
            required: true,
            message: "请输入联系方式",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]{4,11}$/,
            message: "联系方式格式不正确",
            trigger: "blur",
          },
        ],
        corporateName: {
          required: true,
          message: "请选择所属单位",
          trigger: "blur",
        },
        job: {
          required: true,
          message: "请选择职务",
          trigger: "blur",
        },
        onGuard: {
          required: true,
          message: "请选择是否在岗",
          trigger: "blur",
        },
        holdCert: {
          required: true,
          message: "请选择是否持证",
          trigger: "blur",
        },
      },
      jobOptions: [
        {
          value: "队长",
          label: "队长",
        },
        {
          value: "副队长",
          label: "副队长",
        },
        {
          value: "测量员",
          label: "测量员",
        },
      ],
      yesOrNotOptions: [
        {
          value: "是",
          label: "是",
        },
        {
          value: "否",
          label: "否",
        },
      ],
    };
  },
  async mounted() {
    const res = await this.getCorporateList();
    if (Array.isArray(res) && res.length > 0) {
      this.handelListItemClick(res[0]);
    }
  },
  methods: {
    dateFormat,
    handelSearchButtonClick() {
      this.searchData.pageNum = 1;
      this.getPersonInfoPageList();
    },
    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.searchData = metaData.searchData;
      this.searchData.corporateId = this.activeItem.corpId;
      this.getPersonInfoPageList();
    },
    async handelListItemClick(data) {
      this.activeItem = data;
      this.searchData.pageNum = 1;
      this.searchData.corporateId = data.corpId;
      this.getPersonInfoPageList();
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
    async getPersonInfoPageList() {
      this.tableData = [];
      try {
        const { data, success, message } = await getPersonInfoPageList(
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
      this.getPersonInfoPageList();
    },
    handelCurrentChange(page) {
      this.searchData.pageNum = page.current;
      this.getPersonInfoPageList();
    },
    async handelInspect(row) {
      this.dialogFormData = structuredClone(row);
      this.dialogFormData.fileList = (
        this.dialogFormData.fileInfoList || []
      ).map((item) => ({
        url: item.requestRelativeUrl,
        name: item.fileName,
        requestRelativeUri: item.requestRelativeUrl,
        attId: item.fileId,
      }));
      this.showDialog = true;
      this.dialogReadonly = true;
    },
    async handelEdit(row) {
      this.dialogFormData = structuredClone(row);
      this.dialogFormData.fileList = (
        this.dialogFormData.fileInfoList || []
      ).map((item) => ({
        url: item.requestRelativeUrl,
        name: item.fileName,
        requestRelativeUri: item.requestRelativeUrl,
        attId: item.fileId,
      }));
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
    async deletePersonInfo(row) {
      try {
        await this.beforeDelete();
        const { data, success, message } = await deletePersonInfo(row.id);
        if (!success) {
          this.$message.error("人员信息删除失败：" + message);
          return false;
        }
        this.$message.success("人员信息删除成功!");
        this.searchData.pageNum = 1;
        this.getPersonInfoPageList();
        return true;
      } catch (error) {
        console.error(error);
        if (error !== "cancel") {
          this.$message.error("人员信息删除失败");
        }
        return false;
      }
    },
    async handelAdd() {
      if (!this.activeItem.corpId) {
        return;
      }
      this.dialogFormData.corporateId = this.activeItem.corpId;
      this.dialogFormData.corporateName = this.activeItem.corpName;
      this.showDialog = true;
      this.dialogReadonly = false;
    },
    handelExport() {
      if (!this.activeItem.corpId) {
        return;
      }
      const query = new URLSearchParams(this.searchData);
      window.open(`/api/measure/personInfo/export?${query}`, "_blank");
    },
    handelAddCertificate() {
      this.dialogFormData.certList.push({
        certName: "",
        certOffice: "",
        certDate: "",
        certNum: "",
      });
    },
    deleteCertificate(row) {
      this.$confirm(`确定删除？`)
        .then(() => {
          this.dialogFormData.certList = this.dialogFormData.certList.filter(
            (item) => item !== row
          );
        })
        .catch(() => {});
    },
    handleRemove(file) {
      this.dialogFormData.fileList = this.dialogFormData.fileList.filter(
        (item) => item.attId !== file.attId
      );
    },
    handlePreview(file) {
      window.open(`/api/file/getFileForApp?fileInfoId=${file.attId}`, "_blank");
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
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
        this.updatePersonInfo();
      } else {
        this.createPersonInfo();
      }
    },
    async createPersonInfo() {
      try {
        const { data, success, message } = await createPersonInfo({
          ...this.dialogFormData,
          attId: this.dialogFormData.fileList.map((item) => item.attId).join(),
        });

        if (!success) {
          this.$message.error("创建人员信息失败：" + message);
          return false;
        }
        this.$message.success("创建人员信息成功");
        this.handelDialogClose();
        this.searchData.pageNum = 1;
        this.getPersonInfoPageList();
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("创建人员信息失败");
        return false;
      }
    },
    async updatePersonInfo() {
      try {
        const { data, success, message } = await updatePersonInfo({
          ...this.dialogFormData,
          attId: this.dialogFormData.fileList.map((item) => item.attId).join(),
        });

        if (!success) {
          this.$message.error("修改人员信息失败：" + message);
          return false;
        }
        this.$message.success("修改人员信息成功");
        this.handelDialogClose();
        this.getPersonInfoPageList();
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("修改人员信息失败");
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-person-info {
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
