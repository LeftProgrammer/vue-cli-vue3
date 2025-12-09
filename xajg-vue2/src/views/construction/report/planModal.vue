<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="40%"
      v-draggable
      @closed="closedHandle"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="编码" prop="code">
              <el-input
                v-model="formData.code"
                placeholder="请输入"
                width="100%"
                maxlength="50"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入"
                width="100%"
                maxlength="50"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始" prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                clearable
                value-format="yyyy-MM-dd"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="计划结束" prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                disabled
                clearable
                value-format="yyyy-MM-dd"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际开始" prop="actualStartDate">
              <el-date-picker
                v-model="formData.actualStartDate"
                type="date"
                clearable
                value-format="yyyy-MM-dd"
                style="width: 100%"
                :picker-options="{
                  disabledDate: (date) => disabledDate(date, 'actualStartDate')
                }"
                :disabled="type=='view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际结束" prop="actualEndDate">
              <el-date-picker
                v-model="formData.actualEndDate"
                type="date"
                clearable
                value-format="yyyy-MM-dd"
                style="width: 100%"
                :picker-options="{
                  disabledDate: (date) => disabledDate(date, 'actualEndDate')
                }"
                :disabled="type=='view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="累计完成量" prop="actualNum">
              <el-input-number
                v-model="formData.actualNum"
                style="width: 100%"
                controls-position="right"
                :precision="3"
                :controls-rounding="false"
                :step="0.1"
                :disabled="type=='view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成量" prop="planNum">
              <el-input-number
                v-model="formData.planNum"
                style="width: 100%"
                controls-position="right"
                :precision="3"
                :controls-rounding="false"
                :step="0.1"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closedHandle"> 取消 </el-button>
        <el-button v-if="type!='view'" type="primary" @click="sure"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { subSave, subUpdate } from "./api";
import { FormMixin } from "@/mixins/FormMixin";
import moment from "moment";
export default {
  name: "dataform",
  mixins: [FormMixin],
  props: {
    baseId: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogShow: false,
      formData: {},
      formDataRules: {
        // code: [{ required: true, message: "请输入", trigger: "blur" }],
        // name: [{ required: true, message: "请输入", trigger: "blur" }],
        // startDate: [{ required: true, message: "请选择", trigger: "change" }],
        // endDate: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  },
  computed: {
    title() {
      return this.type == "report" ? "填报" : "查看";
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        this.dialogShow = newValue;
        this.$nextTick(() => {
          if (this.type != "add") {
            this.formData = this.data;
          } else this.pid = this.data.id || "0";
        });
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 确认按钮
    sure() {
      if (this.data.isView) {
        this.closedHandle();
        return;
      }
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          this.formData.baseId = this.baseId;
          if (!this.formData.id) {
            subSave(this.formData).then((res) => {
              if (res.success) {
                this.$message.success("添加成功");
                this.closedHandle();
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            subUpdate(this.formData).then((res) => {
              if (res.success) {
                this.$message.success("修改成功");
                this.closedHandle();
              } else {
                this.$message.error(res.message);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    closedHandle() {
      this.$emit("sureson");
      this.dialogShow = false;
    },
    disabledDate(date, filed) {
      if (filed == "actualStartDate" && this.formData.actualEndDate) {
        return date > moment(this.formData.actualEndDate).endOf("day");
      } else if (filed == "actualEndDate" && this.formData.actualStartDate) {
        return date < moment(this.formData.actualStartDate).endOf("day");
      }
    }
  }
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
/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}
</style>
