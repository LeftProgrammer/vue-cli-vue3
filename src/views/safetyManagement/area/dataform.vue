<template>
  <div>
    <el-dialog
      v-model="dialogShow"
      :title="title"
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
        :disabled="data.isView"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="危险区域" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入"
                style="width: 100%"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="危险类别:" prop="type">
              <el-select
                v-model="formData.type"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option label="低风险区域" value="1"> </el-option>
                <el-option label="一般危险区域" value="2"> </el-option>
                <el-option label="较大风险区域" value="3"> </el-option>
                <el-option label="重大风险区域" value="4"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="范围:" prop="area">
              <BimPoint
                v-model="formData.area"
                type="cover"
                :coverState="formData.type"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用:" prop="enable">
              <el-switch
                v-model="formData.enable"
                active-color="#014ACB"
                inactive-color="#F53F3F"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogShow = false">{{
            data.isView ? "关闭" : "取消"
          }}</el-button>
          <el-button type="primary" @click="sure" v-if="!data.isView">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { save, update } from "./api";
import { FormMixin } from "@/mixins/FormMixin";
import BimPoint from "@/components/Bim/Point/index.vue";

export default {
  name: "SafetyAreaForm",
  components: {
    BimPoint,
  },
  mixins: [FormMixin],
  props: {
    view: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialogShow: false,
      formData: {
        name: null,
        params: {
          projectPbs: {
            name: "",
          },
        },
      },
      formDataRules: {
        area: [{ required: true, message: "请输入区域", trigger: "blur" }],
        type: [{ required: true, message: "请选择风险类型", trigger: "change" }],
      },
    };
  },
  computed: {},
  watch: {
    visible: {
      handler(newValue) {
        this.dialogShow = newValue;
        this.$nextTick(() => {
          const raw = (this.data && this.data.data) ? this.data.data : {};
          try {
            this.formData = JSON.parse(JSON.stringify(raw));
          } catch (e) {
            this.formData = { ...(raw || {}) };
          }
          this.formData.enable = this.formData.enable == 1;
        });
      },
      immediate: true,
      deep: true,
    },
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
          const params = Object.assign({}, this.formData);
          params.enable = params.enable ? 1 : 0;
          if (!params.id) {
            save(params).then((res) => {
              if (res.success) {
                this.$message.success("添加成功");
                this.closedHandle();
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            update(params).then((res) => {
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
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

  .table {
    :deep(.el-table__row .cell button) {
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

:deep {
  .el-col .el-input {
    width: 100%;
  }
}

:deep(.el-input-group__append) {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}
</style>
