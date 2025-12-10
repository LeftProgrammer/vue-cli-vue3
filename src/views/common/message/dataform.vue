<template>
  <el-dialog
    v-model="dialogShow"
    title="信息"
    width="40%"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    @closed="closedHandle"
  >
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
        :disabled="readonly"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="消息标题:" prop="noticeTitle">
              <el-input v-model="formData.noticeTitle" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="消息内容:" prop="noticeSchema">
              <el-input v-model="formData.noticeSchema" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发布人:" prop="sendUserRealName">
              <el-input v-model="formData.sendUserRealName" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发布时间:" prop="noticeDate">
              <el-date-picker
                v-model="formData.noticeDate"
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="x"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </el-dialog>
</template>

<script>
import { FormMixin } from "@/mixins/FormMixin";

export default {
  name: "MessageDataform",
  mixins: [FormMixin],
  data() {
    return {
      dialogShow: false,
      formData: {
        id: null,
      },
      formDataRules: {},
      tableData: [],
    };
  },
  methods: {
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed", this.formData);
    },
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          this.formData = { ...this.data };
          this.tableData = this.data && this.data.subDetail ? this.data.subDetail : [];
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;
}

.page-leave .table :deep(.el-table__row .cell button) {
  padding: 0 !important;
}

.page-leave .pagination {
  padding: 0 20px;
}

.subTabeHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-col .el-input {
  width: 60%;
}

.lengthening .el-select {
  width: 93%;
}

.lengthening .el-select .el-input {
  width: 100%;
}

:deep(.el-col .el-input) {
  width: 100%;
}
</style>
