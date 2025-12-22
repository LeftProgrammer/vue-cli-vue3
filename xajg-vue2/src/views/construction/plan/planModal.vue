<template>
  <div>
    <el-dialog
      v-draggable
      :title="title"
      :visible.sync="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="40%"
      @closed="closedHandle"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
        :disabled="readonly"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="编号" prop="code">
              <el-input
                v-model="formData.code"
                placeholder="请输入"
                width="100%"
                maxlength="50"
                show-word-limit
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
                show-word-limit
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
                :picker-options="{
                  disabledDate: (date) => disabledDate(date, 'startDate')
                }"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="计划结束" prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                clearable
                value-format="yyyy-MM-dd"
                style="width: 100%"
                :picker-options="{
                  disabledDate: (date) => disabledDate(date, 'endDate')
                }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务类型" prop="taskType">
              <el-select
                v-model="formData.taskType"
                class="w-100pre"
                placeholder="请选择"
                clearable
                :disabled="readonly"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in taskTypes"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程部位" prop="pbsCode">
              <pbs-select v-model="formData.pbsCode" :disabled="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权重" prop="weight">
              <el-input-number
                v-model="formData.weight"
                controls-position="right"
                style="width: 100%"
                :precision="3"
                :controls-rounding="false"
                :step="0.1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成量" prop="planNum">
              <el-input-number
                v-model="formData.planNum"
                controls-position="right"
                style="width: 100%"
                :precision="3"
                :controls-rounding="false"
                :step="0.1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量单位" prop="units">
              <el-input v-model="formData.units" placeholder="请输入" width="100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="!readonly" type="primary" @click="sure"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { subSave, subUpdate } from "./api";
import { FormMixin } from "@/mixins/FormMixin";
import moment from "moment";
import { getDictItemList } from "@/api/dict";
export default {
  name: "Dataform",
  components: {},
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
        code: [{ required: true, message: "请输入", trigger: "blur" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        startDate: [{ required: true, message: "请选择", trigger: "change" }],
        endDate: [{ required: true, message: "请选择", trigger: "change" }]
      },
      taskTypes: []
    };
  },
  computed: {
    readonly() {
      return this.type == "view";
    },
    title() {
      return this.type == "add" ? "新增" : this.type == "edit" ? "编辑" : "查看";
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        this.dialogShow = newValue;
        this.$nextTick(() => {
          if (this.type != "add") this.formData = this.data;
          else this.pid = this.data.id || "0";
        });
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getTaskType();
  },
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
          if (this.type == "add") this.formData.pid = this.pid;
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
      if (filed == "startDate" && this.formData.endDate) {
        return date > moment(this.formData.endDate).endOf("day");
      } else if (filed == "endDate" && this.formData.startDate) {
        return date < moment(this.formData.startDate).endOf("day");
      }
    },
    /**获取字典 */
    async getTaskType() {
      const { data } = await getDictItemList("task_type");
      this.taskTypes = data;
      console.log("taskTypes", data);
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
