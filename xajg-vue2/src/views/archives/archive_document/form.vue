<template>
  <el-dialog
    v-if="visible"
    v-draggable
    :visible.sync="dialogVisible"
    :title="title"
    width="680px"
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
    >
      <el-row :gutter="20">
        <!-- 第1行：所属案卷、顺序号 -->
        <el-col :span="12">
          <el-form-item label="所属案卷" prop="volumeId">
            <el-select
              v-model="formData.volumeId"
              placeholder="请选择"
              style="width: 100%"
              disabled
            >
              <el-option :label="volumeTitle" :value="volumeId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="顺序号" prop="sortNo">
            <el-input v-model="formData.sortNo" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <!-- 第2行：文件题名、文件编号 -->
        <el-col :span="12">
          <el-form-item label="文件题名" prop="documentTitle">
            <el-input v-model="formData.documentTitle" placeholder="请输入" maxlength="500" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件编号">
            <el-input v-model="formData.documentCode" placeholder="请输入" maxlength="100" show-word-limit />
          </el-form-item>
        </el-col>
        <!-- 第3行：密级、页号 -->
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
        <el-col :span="12">
          <el-form-item label="页号">
            <el-input v-model="formData.pageNo" placeholder="请输入" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <!-- 第4行：责任者、日期 -->
        <el-col :span="12">
          <el-form-item label="责任者" prop="responsible">
            <el-input v-model="formData.responsible" placeholder="请输入" maxlength="100" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日期" prop="documentDate">
            <el-date-picker
              v-model="formData.documentDate"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <!-- 第5行：保管期限 -->
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
        <el-col :span="12" />
        <!-- 第6行：附件 -->
        <el-col :span="24">
          <el-form-item label="附件">
            <el-input
              v-model="formData.attachment"
              type="textarea"
              :rows="3"
              placeholder="请输入"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <!-- 第7行：备注 -->
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ isView ? "关闭" : "取消" }}</el-button>
      <el-button
        v-if="!isView"
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { defineComponent } from "vue";
import {
  getDocumentDetail,
  saveDocument,
  updateDocument,
} from "@/api/archivesManage";
import enums from "@/config/enums";

export default defineComponent({
  name: "DocumentForm",
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
    // 文件ID（编辑/查看时传入）
    documentId: {
      type: [String, Number],
      default: "",
    },
    // 案卷ID（新增时传入）
    volumeId: {
      type: [String, Number],
      default: "",
    },
    // 案卷题名（显示用）
    volumeTitle: {
      type: String,
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
        volumeId: [
          { required: true, message: "请选择所属案卷", trigger: "change" },
        ],
        sortNo: [{ required: true, message: "请输入顺序号", trigger: "blur" }],
        documentTitle: [
          { required: true, message: "请输入文件题名", trigger: "blur" },
        ],
        securityLevel: [
          { required: true, message: "请选择密级", trigger: "change" },
        ],
        responsible: [
          { required: true, message: "请输入责任者", trigger: "blur" },
        ],
        documentDate: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        retentionPeriod: [
          { required: true, message: "请选择保管期限", trigger: "change" },
        ],
      },
      // 密级
      securityLevelList: enums.SECURITY_LEVEL_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
      // 保管期限
      retentionPeriodList: enums.RETENTION_PERIOD_ENUM.map((item) => ({
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
        if (this.documentId) {
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
        volumeId: this.volumeId,
        sortNo: "",
        documentTitle: "",
        documentCode: "",
        securityLevel: "",
        pageNo: "",
        responsible: "",
        documentDate: "",
        retentionPeriod: "",
        attachment: "",
        remark: "",
      };
    },
    // 获取详情
    async getDetail() {
      this.detailLoading = true;
      try {
        const { success, data, message } = await getDocumentDetail(
          this.documentId
        );
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
    // 提交表单
    handleSubmit() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return;
        this.submitLoading = true;
        try {
          const api = this.formData.id ? updateDocument : saveDocument;
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
/deep/ .el-dialog__body {
  max-height: 65vh !important;
}
</style>
