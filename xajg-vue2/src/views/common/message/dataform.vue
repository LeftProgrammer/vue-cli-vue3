<template>
  <!--查看消息-->
  <el-dialog
    v-draggable
    title="信息"
    custom-class="wbench-el-dialog"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="40%"
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
            <el-form-item label="消息标题:" prop="code">
              <el-input
                v-model="formData.noticeTitle"
                placeholder="请输入"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="消息内容:" prop="noticeSchema">
              <el-input
                v-model="formData.noticeSchema"
                placeholder="请输入"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发布人:" prop="sendUserRealName">
              <el-input
                v-model="formData.sendUserRealName"
                placeholder="请输入"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发布时间:" prop="readTime">
              <el-date-picker
                v-model="formData.noticeDate"
                type="date"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              >
              </el-date-picker>
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
  name: "dataform",
  mixins: [FormMixin],
  data() {
    return {
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
      },
      formDataRules: {},
      tableData: [],
    };
  },
  methods: {
    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed", this.formData);
    },
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log("visible", newValue);
        if (newValue) {
          this.formData = { ...this.data };
          this.tableData = this.data.subDetail || [];
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

  .table {
    /deep/ .el-table__row .cell button {
      padding: 0 !important;
    }
  }

  .pagination {
    padding: 0 20px;
  }
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

  .el-input {
    width: 100%;
  }
}

::v-deep {
  .el-col .el-input {
    width: 100%;
  }
}
</style>
