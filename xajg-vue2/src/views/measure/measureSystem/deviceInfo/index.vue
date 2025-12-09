<template>
  <div class="page-device-info">
    <TreeTableLayout
      :page="searchData"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
      title="设备列表"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="设备名称">
            <el-input
              v-model="searchData.equipmentName"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="设备型号">
            <el-input
              v-model="searchData.equipmentType"
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
                prop="equipmentName"
                show-overflow-tooltip
                label="设备名称"
                align="center"
              />
              <el-table-column
                prop="equipmentType"
                show-overflow-tooltip
                label="设备型号"
                align="center"
              />
              <el-table-column
                prop="corporateName"
                show-overflow-tooltip
                label="所属单位"
                align="center"
              />
              <el-table-column
                prop="checkDateStr"
                label="检定日期"
                align="center"
              />
              <el-table-column prop="indateStr" label="有效期至" align="center">
                <template #default="{ row }">
                  <div :class="expire(row.indate)">
                    {{ row.indateStr }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="checkResult"
                label="检定结论"
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
                      @click="deleteEquipmentInfo(row)"
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
      title="测量设备"
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
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input
                v-model.trim="dialogFormData.equipmentName"
                :disabled="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备型号" prop="equipmentType">
              <el-input
                v-model.trim="dialogFormData.equipmentType"
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
            <el-form-item label="出厂编号" prop="factoryId">
              <el-input
                v-model="dialogFormData.factoryId"
                placeholder="请输入"
                :disabled="dialogReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标称精度" prop="accuracy">
              <el-input
                v-model="dialogFormData.accuracy"
                :disabled="dialogReadonly"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检定日期" prop="checkDate">
              <el-date-picker
                v-model="dialogFormData.checkDate"
                type="date"
                style="width: 100%"
                :disabled="dialogReadonly"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="检定单位" prop="checkCroporate">
              <el-input
                v-model="dialogFormData.checkCroporate"
                :disabled="dialogReadonly"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检定结论" prop="checkResult">
              <el-select
                v-model="dialogFormData.checkResult"
                clearable
                placeholder="请选择"
                style="width: 100%"
                :disabled="dialogReadonly"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检定证书标号" prop="checkCertId">
              <el-input
                v-model="dialogFormData.checkCertId"
                :disabled="dialogReadonly"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期至" prop="indate">
              <el-date-picker
                v-model="dialogFormData.indate"
                type="date"
                style="width: 100%"
                :disabled="dialogReadonly"
              />
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
  getEquipmentInfoPageList,
  deleteEquipmentInfo,
  createEquipmentInfo,
  updateEquipmentInfo,
} from "@/api/measure";
export default {
  name: "DeviceInfo",
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
        equipmentName: "",
        equipmentType: "",
      },
      departList: [],
      tableData: [],
      activeItem: {},
      showDialog: false,
      dialogReadonly: false,
      dialogFormData: {
        accuracy: "",
        attId: "",
        checkCertId: "",
        checkCroporate: "",
        checkDate: "",
        checkResult: "合格",
        corporateId: "",
        corporateName: "",
        equipmentName: "",
        equipmentType: "",
        factoryId: "",
        indate: "",
        fileList: [],
      },
      dialogFormRules: {
        equipmentName: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "blur",
          },
          { max: 50, message: "长度最大 50 个字符", trigger: "blur" },
        ],
        equipmentType: [
          {
            required: true,
            message: "请输入设备型号",
            trigger: "blur",
          },
          { max: 50, message: "长度最大 50 个字符", trigger: "blur" },
        ],
        factoryId: { max: 50, message: "长度最大 50 个字符", trigger: "blur" },
        accuracy: { max: 50, message: "长度最大 50 个字符", trigger: "blur" },
        checkDate: {
          required: true,
          message: "请选择检定日期",
          trigger: "blur",
        },
        checkCroporate: {
          max: 50,
          message: "长度最大 50 个字符",
          trigger: "blur",
        },
        checkResult: {
          required: true,
          message: "请输入联系方式",
          trigger: "blur",
        },
        checkCertId: {
          max: 50,
          message: "长度最大 50 个字符",
          trigger: "blur",
        },
        indate: {
          required: true,
          message: "请选择有效期至",
          trigger: "blur",
        },
      },
      options: [
        {
          value: "合格",
          label: "合格",
        },
        {
          value: "不合格",
          label: "不合格",
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
      this.getEquipmentInfoPageList();
    },
    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.searchData = metaData.searchData;
      this.searchData.corporateId = this.activeItem.corpId;
      this.getEquipmentInfoPageList();
    },
    async handelListItemClick(data, node, own) {
      this.activeItem = data;
      this.searchData.pageNum = 1;
      this.searchData.corporateId = data.corpId;
      this.getEquipmentInfoPageList();
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
    async getEquipmentInfoPageList() {
      this.tableData = [];
      try {
        const { data, success, message } = await getEquipmentInfoPageList(
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
    expire(timestamp) {
      const current = new Date().getTime();
      const expireDay = Math.floor((timestamp - current) / 1000 / 60 / 60 / 24);

      if (expireDay <= 0) {
        return "expire-error";
      }
      if (expireDay > 0 && expireDay <= 30) {
        console.log(expireDay);
        return "expire-warning";
      }
    },
    handelPageSizeChange(page) {
      this.searchData.pageNum = 1;
      this.searchData.pageSize = page.pageSize;
      this.getEquipmentInfoPageList();
    },
    handelCurrentChange(page) {
      this.searchData.pageNum = page.current;
      this.getEquipmentInfoPageList();
    },
    async handelInspect(row) {
      this.showDialog = true;
      this.dialogReadonly = true;
      this.dialogFormData = structuredClone(row);
      this.dialogFormData.fileList = (
        this.dialogFormData.fileInfoList || []
      ).map((item) => ({
        url: item.requestRelativeUrl,
        name: item.fileName,
        requestRelativeUri: item.requestRelativeUrl,
        attId: item.fileId,
      }));
    },
    async handelEdit(row) {
      this.showDialog = true;
      this.dialogReadonly = false;
      this.dialogFormData = structuredClone(row);
      this.dialogFormData.fileList = (
        this.dialogFormData.fileInfoList || []
      ).map((item) => ({
        url: item.requestRelativeUrl,
        name: item.fileName,
        requestRelativeUri: item.requestRelativeUrl,
        attId: item.fileId,
      }));
    },
    beforeDelete() {
      return this.$confirm("是否要删除这条数据 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
    },
    // 删除数据
    async deleteEquipmentInfo(row) {
      try {
        await this.beforeDelete();
        const { data, success, message } = await deleteEquipmentInfo(row.id);
        if (!success) {
          this.$message.error("设备信息删除失败：" + message);
          return false;
        }
        this.$message.success("设备信息删除成功!");
        this.searchData.pageNum = 1;
        this.getEquipmentInfoPageList();
        return true;
      } catch (error) {
        console.error(error);
        if (error !== "cancel") {
          this.$message.error("设备信息删除失败");
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
      window.open(`/api/measure/equipmentInfo/export?${query}`, "_blank");
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
        this.updateEquipmentInfo();
      } else {
        this.createEquipmentInfo();
      }
    },
    async createEquipmentInfo() {
      try {
        const { data, success, message } = await createEquipmentInfo({
          ...this.dialogFormData,
          attId: this.dialogFormData.fileList.map((item) => item.attId).join(),
        });

        if (!success) {
          this.$message.error("创建设备信息失败：" + message);
          return false;
        }
        this.$message.success("创建设备信息成功");
        this.handelDialogClose();
        this.searchData.pageNum = 1;
        this.getEquipmentInfoPageList();
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("创建设备信息失败");
        return false;
      }
    },
    async updateEquipmentInfo() {
      try {
        const { data, success, message } = await updateEquipmentInfo({
          ...this.dialogFormData,
          attId: this.dialogFormData.fileList.map((item) => item.attId).join(),
        });

        if (!success) {
          this.$message.error("修改设备信息失败：" + message);
          return false;
        }
        this.$message.success("修改设备信息成功");
        this.handelDialogClose();
        this.getEquipmentInfoPageList();
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("修改设备信息失败");
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-device-info {
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
  .expire-error {
    color: #f56c6c;
  }
  .expire-warning {
    color: #e6a23c;
  }
}
</style>
