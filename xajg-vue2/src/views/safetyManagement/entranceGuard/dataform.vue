<template>
  <el-dialog
    v-draggable
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="1000px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      :disabled="readonly"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备编码" required>
            <el-input v-model="formData.deviceSn" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" required>
            <el-input v-model="formData.deviceName" disabled />
          </el-form-item>
        </el-col>
        <!-- <el-form-item label="设备状态">
        <el-tag :type="formData.deviceStatus === 1 ? 'success' : 'info'">
          {{ formData.deviceStatus === 1 ? '在线' : '离线' }}
        </el-tag>
      </el-form-item> -->
        <el-col :span="12">
          <el-form-item label="所属单位" prop="belongUnit">
            <el-cascader
              v-model="formData.belongUnit"
              clearable
              style="width: 100%"
              :props="unitTreeProps"
              :show-all-levels="false"
              :options="unitTree"
              placeholder="请选择所属单位"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装位置" prop="installLocation">
            <el-input
              v-model="formData.installLocation"
              placeholder="请输入安装位置"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </el-col>

        <!-- <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注"
          maxlength="200"
          show-word-limit
        />
      </el-form-item> -->
        <!-- <el-form-item v-if="formData.lastSyncTime" label="最后同步时间">
        <span>{{ formData.lastSyncTime }}</span>
      </el-form-item> -->
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        v-if="!readonly"
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save } from "./api";

export default {
  name: "EntranceGuardForm",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: "edit",
    },
    unitTree: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      formData: {
        id: "",
        deviceSn: "",
        deviceName: "",
        deviceStatus: null,
        belongUnit: "",
        installLocation: "",
        remark: "",
        lastSyncTime: "",
      },
      unitTreeProps: {
        expandTrigger: "hover",
        children: "children",
        emitPath: false,
        label: "corpName",
        value: "corpId",
      },
      rules: {
        belongUnit: [
          { required: true, message: "请选择所属单位", trigger: "change" },
        ],
        installLocation: [
          { required: true, message: "请输入安装位置", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    dialogTitle() {
      const titles = {
        view: "详情",
        edit: "编辑",
      };
      return titles[this.type] || "门禁设备";
    },
    readonly() {
      return this.type === "view";
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.dialogVisible = val;
        if (val) {
          this.initFormData();
        }
      },
    },
  },
  methods: {
    initFormData() {
      if (this.data && this.data.id) {
        this.formData = {
          id: this.data.id,
          deviceSn: this.data.deviceSn || "",
          deviceName: this.data.deviceName || "",
          deviceStatus: this.data.deviceStatus,
          belongUnit: this.data.belongUnit || "",
          installLocation: this.data.installLocation || "",
          remark: this.data.remark || "",
          lastSyncTime: this.data.lastSyncTime || "",
        };
      } else {
        this.resetForm();
      }
    },
    resetForm() {
      this.formData = {
        id: "",
        deviceSn: "",
        deviceName: "",
        deviceStatus: null,
        belongUnit: "",
        installLocation: "",
        remark: "",
        lastSyncTime: "",
      };
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate();
      });
    },
    handleClose() {
      this.resetForm();
      this.$emit("update:visible", false);
      this.$emit("closed");
    },
    async handleSubmit() {
      try {
        await this.$refs.formRef.validate();
        this.loading = true;
        const params = {
          id: this.formData.id,
          belongUnit: this.formData.belongUnit,
          installLocation: this.formData.installLocation,
          remark: this.formData.remark,
        };
        const res = await save(params);
        if (res.success || res.code === 200) {
          this.$message.success("保存成功");
          this.$emit("ok");
          this.handleClose();
        } else {
          this.$message.error(res.message || "保存失败");
        }
      } catch (error) {
        console.error("表单验证失败或提交错误:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}
</style>
