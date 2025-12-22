<template>
  <el-dialog
    v-draggable
    :title="title"
    :visible.sync="visible"
    :destroy-on-close="true"
    append-to-body
    width="60%"
    :close-on-click-modal="false"
    @closed="visible = false"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="场景ID" prop="modelId">
            <el-input
              v-model="formData.modelId"
              placeholder="请输入场景ID"
              :disabled="type === 'view'"
              maxlength="255"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="场景编码" prop="modelCode">
            <el-input
              v-model="formData.modelCode"
              placeholder="请输入场景编码"
              :disabled="type === 'view'"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="场景名称" prop="modelName">
            <el-input
              v-model="formData.modelName"
              placeholder="请输入场景名称"
              :disabled="type === 'view'"
              maxlength="255"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否合模" prop="isCombineid">
            <el-select
              v-model="formData.isCombineid"
              placeholder="请选择"
              :disabled="type === 'view'"
              style="width: 100%"
            >
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="主视角" prop="mainViewpoint">
            <el-input
              v-model="formData.mainViewpoint"
              placeholder="请输入主视角"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认视角" prop="defaultViewpoint">
            <el-input
              v-model="formData.defaultViewpoint"
              placeholder="请输入默认视角"
              disabled
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item
            label="配置参数"
            prop="argument"
            :disabled="type === 'view'"
          >
            <el-input
              v-model="formData.argument"
              type="textarea"
              placeholder="配置参数"
              :disabled="type === 'view'"
              :rows="4"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">{{
        type === "view" ? "关闭" : "取消"
      }}</el-button>
      <el-button
        v-if="type !== 'view'"
        type="primary"
        :loading="loading"
        @click="submitForm"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addModelConfig } from "./api";

export default {
  name: "ModelConfigForm",

  data() {
    return {
      title: "",
      visible: false,
      type: "",
      loading: false,
      formData: {
        id: "",
        modelId: "",
        modelName: "",
        argument: "",
        mainViewpoint: "",
        defaultViewpoint: "",
        isCombineid: "",
      },
      projectOptions: [], // 项目选项列表
      rules: {
        isCombineid: [
          { required: true, message: "请选择是否合模", trigger: "change" },
        ],
        modelId: [{ required: true, message: "请输入场景ID", trigger: "blur" }],
        modelName: [
          { required: true, message: "请输入场景名称", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},

  created() {},
  methods: {
    loadDialog(row, type) {
      this.type = type;
      if (type === "add") {
        this.title = "新增";
        // 新增时先清空表单
        this.formData = {
          id: "",
          modelId: "",
          modelName: "",
          argument: "",
          mainViewpoint: "",
          defaultViewpoint: "",
          isCombineid: "",
        };
      } else if (type === "edit") {
        this.title = "编辑";
        this.formData = { ...row };
      } else if (type === "view") {
        this.title = "详情";
        this.formData = { ...row };
      }
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate(); // 清除验证状态
      });
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          addModelConfig(this.formData)
            .then((res) => {
              if (res.success) {
                this.$message.success(
                  this.formData.id ? "修改成功" : "添加成功"
                );
                this.visible = false;
                this.$emit("success");
              } else {
                this.$message.error(
                  res.message || (this.formData.id ? "修改失败" : "添加失败")
                );
              }
            })
            .catch((error) => {
              console.error(this.formData.id ? "修改失败" : "添加失败", error);
              this.$message.error(this.formData.id ? "修改失败" : "添加失败");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false;
    },
    // 重置表单
    resetForm() {
      this.formData = {
        id: "",
        modelId: "",
        modelName: "",
        argument: "",
        mainViewpoint: "",
        defaultViewpoint: "",
      };
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
