<template>
  <div class="w-100pre h-100pre">
    <el-dialog
      title="发文"
      :visible.sync="dialogShow"
      @closed="closed"
      width="20%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div class="page-leave">
        <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="formDataRules"
          :inline="true"
          label-width="auto"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="收文人" prop="sendUser" align="center">
                <user
                  v-model="formData.sendUser"
                  :multiple="true"
                  :readonly="false"
                ></user>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="工程部位" prop="pbsCode">
                <pbs-select v-model="formData.pbsCode"></pbs-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="发文日期:" size="mini" prop="sendDate">
                <el-date-picker
                  style="width: 100%"
                  v-model="formData.sendDate"
                  type="date"
                  class="w-100pre"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer flex justify-end">
        <span>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { send } from "./api";
export default {
  data() {
    return {
      dialogShow: false,
      formData: {},
      formDataRules: {
        sendDate: [
          {
            required: true,
            trigger: "change",
            message: "请选择日期",
          },
        ],
        sendUser: [
          {
            required: true,
            trigger: "change",
            message: "请选择人员",
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    closed() {
      this.formData = {};
      this.dialogShow = false;
    },
    add(row) {
      console.log("add", row);
      this.formData.id = row.id;
    },
    submit() {
      console.log("submit");
      // 添加表单校验
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) return;
        this.save();
      });
    },
    async save() {
      try {
        const params = { ...this.formData };
        console.log("params", params);
        const res = await send(params);
        console.log("业主发文", res);
        const { success, data } = res;
        if (!success) {
          this.$message.error("发送失败");
          return;
        }
        this.dialogShow = false;
      } catch (error) {
        console.error("An error occurred:", error);
        // Handle specific errors if needed
        if (error instanceof NetworkError) {
          this.$message.error("网络错误");
        } else {
          this.$message.error("发生了意外错误");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 252px !important;
}
</style>
