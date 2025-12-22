<template>
  <el-dialog
    v-draggable
    :title="title"
    :visible.sync="visible"
    :destroy-on-close="true"
    append-to-body
    width="800px"
    :close-on-click-modal="false"
    @closed="visible = false"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="测点编码" prop="code">
            <el-input
              v-model="formData.code"
              placeholder="请输入测点编码"
              :disabled="type === 'view'"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="测点名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入测点名称"
              :disabled="type === 'view'"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            label="安装位置"
            prop="location"
          >
            <bimPoint
              v-model="formData.location"
              :readonly="type === 'view'"
              :disabled="type === 'view'"
              type="point"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="备注"
            prop="argument"
            :disabled="type === 'view'"
          >
            <el-input
              v-model="formData.remark"
              type="textarea"
              placeholder="请输入备注"
              :disabled="type === 'view'"
              :rows="3"
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">{{
        type === "view" ? "关闭" : "取消"
      }}
      </el-button>
      <el-button
        v-if="type !== 'view'"
        type="primary"
        :loading="loading"
        @click="submitForm"
      >确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addDustPoint } from "./api";
import bimPoint from "@/components/Bim/Point/index";

export default {
  name: "ModelConfigForm",

  components: { bimPoint },

  data() {
    return {
      title: "",
      visible: false,
      type: "",
      loading: false,
      formData: {
        id: "",
        name: "",
        code: "",
        location: "",
        remark: ""
      },
      projectOptions: [], // 项目选项列表
      rules: {
        name: [
          { required: true, message: "请输入测点名称", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入测点编码", trigger: "blur" }],
      },
    };
  },
  computed: {},

  created() {
  },
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
          addDustPoint(this.formData)
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
