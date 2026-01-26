<template>
  <el-dialog
    v-if="visible"
    v-draggable
    :visible.sync="dialogVisible"
    :title="title"
    width="850px"
    :close-on-click-modal="false"
    :append-to-body="appendToBody"
    @closed="handleDialogClosed"
  >
    <el-form
      ref="formRef"
      v-loading="detailLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      :disabled="isView"
      class="volume-form"
    >
      <el-row :gutter="20">
        <!-- 第1行：案卷档号、案卷题名 -->
        <el-col :span="12">
          <el-form-item label="案卷档号" prop="volumeCode">
            <el-input v-model="formData.volumeCode" placeholder="请输入" maxlength="100" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案卷题名" prop="volumeTitle">
            <el-input v-model="formData.volumeTitle" placeholder="请输入" maxlength="500" show-word-limit />
          </el-form-item>
        </el-col>
        <!-- 第2行：顺序号、案卷类别 -->
        <el-col :span="12">
          <el-form-item label="顺序号" prop="sortNo">
            <el-input v-model="formData.sortNo" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="案卷类别" prop="volumeCategory">
            <el-select
              v-model="formData.volumeCategory"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in volumeCategoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col> -->
        <!-- 第3行：保管期限、密级 -->
        <el-col :span="12">
          <el-form-item label="保管期限" prop="retentionPeriod">
            <el-select
              v-model="formData.retentionPeriod"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in retentionPeriodList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密级" prop="securityLevel">
            <el-select
              v-model="formData.securityLevel"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in securityLevelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 第4行：起始日期、终止日期 -->
        <el-col :span="12">
          <el-form-item label="起始日期" prop="startDate">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="终止日期" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <!-- 第5行：总件数、总页数 -->
        <el-col :span="12">
          <el-form-item label="总件数">
            <el-input-number
              v-model="formData.totalFiles"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总页数">
            <el-input-number
              v-model="formData.totalPages"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <!-- 第6行：存放位置、套数 -->
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="存放位置">
            <el-input
              v-model="formData.storageLocation"
              placeholder="请输入"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="套数">
            <el-input-number
              v-model="formData.copies"
              :min="1"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <!-- 第7行：立卷单位、立卷人 -->
        <el-col :span="12">
          <el-form-item label="立卷单位" prop="filingUnitId">
            <el-input
              v-model="formData.filingUnitName"
              placeholder="请选择立卷单位"
              readonly
              @click.native="handleSelectUnit"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSelectUnit"
              />
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组卷人" prop="filingPerson">
            <el-input v-model="formData.filingPerson" placeholder="请输入" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <!-- 第8行：立卷日期、检查人 -->
        <el-col :span="12">
          <el-form-item label="立卷日期" prop="filingDate">
            <el-date-picker
              v-model="formData.filingDate"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检查人">
            <el-input v-model="formData.checker" placeholder="请输入" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <!-- 第9行：检查日期、归档人 -->
        <el-col :span="12">
          <el-form-item label="检查日期">
            <el-date-picker
              v-model="formData.checkDate"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归档人">
            <el-input v-model="formData.archivist" placeholder="请输入" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <!-- 第10行：归档日期、互见号 -->
        <el-col :span="12">
          <el-form-item label="归档日期" prop="archiveDate">
            <el-date-picker
              v-model="formData.archiveDate"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="互见号">
            <el-input
              v-model="formData.crossReference"
              placeholder="请输入"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <!-- 第11行：状态 -->
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="formData.status"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{
        isView ? "关闭" : "取消"
      }}</el-button>
      <el-button
        v-if="!isView"
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
      >确定</el-button>
    </div>

    <!-- 立卷单位选择弹窗 -->
    <el-dialog
      v-draggable
      title="选择立卷单位"
      :visible.sync="unitDialogVisible"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <CorSelect v-if="unitDialogVisible" single @childEvt="handleUnitSelect" />
    </el-dialog>
  </el-dialog>
</template>

<script>
import { defineComponent } from "vue";
import {
  getVolumeDetail,
  saveVolume,
  updateVolume,
} from "@/api/archivesManage";
import CorSelect from "@/components/CorSelect/index";
import enums from "@/config/enums";

export default defineComponent({
  name: "VolumeForm",
  components: {
    CorSelect,
  },
  props: {
    // 是否显示弹窗
    visible: {
      type: Boolean,
      default: false,
    },
    // 弹窗标题
    title: {
      type: String,
      default: "",
    },
    // 是否查看模式
    isView: {
      type: Boolean,
      default: false,
    },
    // 案卷ID（编辑/查看时传入）
    volumeId: {
      type: [String, Number],
      default: "",
    },
    // 项目ID（新增时传入）
    projectId: {
      type: [String, Number],
      default: "",
    },
    // 是否追加到body
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      detailLoading: false,
      submitLoading: false,
      formData: {},
      formRules: {
        volumeCode: [
          { required: true, message: "请输入案卷档号", trigger: "blur" },
        ],
        volumeTitle: [
          { required: true, message: "请输入案卷题名", trigger: "blur" },
        ],
        sortNo: [{ required: true, message: "请输入顺序号", trigger: "blur" }],
        retentionPeriod: [
          { required: true, message: "请选择保管期限", trigger: "change" },
        ],
        securityLevel: [
          { required: true, message: "请选择密级", trigger: "change" },
        ],
        filingUnitId: [
          { required: true, message: "请选择立卷单位", trigger: "change" },
        ],
        filingPerson: [
          { required: true, message: "请输入立卷人", trigger: "blur" },
        ],
        filingDate: [
          { required: true, message: "请选择立卷日期", trigger: "change" },
        ],
        startDate: [
          { required: true, message: "请选择起始日期", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择终止日期", trigger: "change" },
        ],
        archiveDate: [
          { required: true, message: "请选择归档日期", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      unitDialogVisible: false,
      // 案卷类别
      volumeCategoryList: enums.VOLUME_CATEGORY_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
      // 保管期限
      retentionPeriodList: enums.RETENTION_PERIOD_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
      // 密级
      securityLevelList: enums.SECURITY_LEVEL_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
      // 状态
      statusList: enums.VOLUME_STATUS_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.volumeId) {
          // 编辑/查看模式，获取详情
          this.getDetail();
        } else {
          // 新增模式，初始化表单
          this.formData = this.initFormData();
        }
      }
    },
  },
  methods: {
    // 初始化表单数据
    initFormData() {
      return {
        projectId: this.projectId,
        volumeCode: "",
        volumeTitle: "",
        sortNo: "",
        volumeCategory: "",
        retentionPeriod: "",
        securityLevel: "",
        startDate: "",
        endDate: "",
        totalFiles: "",
        totalPages: "",
        storageLocation: "",
        filingUnitId: "",
        filingUnitName: "",
        copies: "",
        filingPerson: "",
        filingDate: "",
        checker: "",
        checkDate: "",
        archivist: "",
        archiveDate: "",
        crossReference: "",
        status: "",
        remark: "",
      };
    },
    // 获取详情
    async getDetail() {
      this.detailLoading = true;
      try {
        const { success, data, message } = await getVolumeDetail(this.volumeId);
        if (success) {
          this.formData = { ...data };
        } else {
          this.$message.error(message || "获取详情失败");
        }
      } catch (error) {
        console.error(error);
        this.$message.error("获取详情失败");
      } finally {
        this.detailLoading = false;
      }
    },
    // 选择立卷单位
    handleSelectUnit() {
      if (this.isView) return;
      this.unitDialogVisible = true;
    },
    // 立卷单位选择回调
    handleUnitSelect({ data }) {
      this.unitDialogVisible = false;
      if (data && data.length > 0) {
        this.formData.filingUnitId = data[0].corpId;
        this.formData.filingUnitName = data[0].corpName;
      }
    },
    // 提交表单
    handleSubmit() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return;
        this.submitLoading = true;
        try {
          const api = this.formData.id ? updateVolume : saveVolume;
          const { success, message } = await api(this.formData);
          if (success) {
            this.$message.success(this.formData.id ? "修改成功" : "新增成功");
            this.$emit("success");
            this.handleClose();
          } else {
            this.$message.error(message || "操作失败");
          }
        } catch (error) {
          console.error(error);
          this.$message.error("操作失败");
        } finally {
          this.submitLoading = false;
        }
      });
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false;
    },
    // 弹窗关闭回调
    handleDialogClosed() {
      this.$refs.formRef?.resetFields();
      this.$emit("closed");
    },
  },
});
</script>

<style lang="scss" scoped>
.volume-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}

/deep/ .el-dialog__body {
  max-height: 65vh !important;
}
</style>
