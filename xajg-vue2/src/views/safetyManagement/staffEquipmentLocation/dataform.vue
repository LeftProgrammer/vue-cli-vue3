<template>
  <el-dialog
    v-draggable
    :title="title"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="50%"
    @closed="closedHandle"
  >
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="120px"
        :disabled="readonly"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型:" prop="deviceType">
              <el-select
                v-model="formData.deviceType"
                class="w-100pre"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option label="人员" :value="SafeLocationTypeEnum.PERSON" />
                <el-option label="设备" :value="SafeLocationTypeEnum.EQUIPMENT" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="formData.deviceType === SafeLocationTypeEnum.PERSON ? '人员编码:' :
                (formData.type === SafeLocationTypeEnum.EQUIPMENT ? '设备编码:' : '人员/设备编号:')"
              prop="deviceType"
            >
              <el-input v-model="formData.deviceCode" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <!-- 将这些代码替换到对应位置 -->
          <el-col :span="12">
            <el-form-item label="经度:" prop="longitude">
              <el-input-number
                v-model="formData.longitude"
                :precision="6"
                :controls="false"
                :step="0.000001"
                placeholder="请输入经度"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度:" prop="latitude">
              <el-input-number
                v-model="formData.latitude"
                :precision="6"
                :controls="false"
                :step="0.000001"
                placeholder="请输入纬度"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高程:" prop="elevation">
              <el-input-number
                v-model="formData.elevation"
                :precision="2"
                :controls="false"
                :step="0.01"
                placeholder="请输入高程"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <el-select
                v-model="formData.status"
                class="w-100pre"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option label="正常" :value="1" />
                <el-option label="异常" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input
                v-model="formData.remark"
                placeholder="请输入"
                show-word-limit
                type="textarea"
                :rows="2"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{
        type == "view" ? "关闭" : "取消"
      }}
      </el-button>
      <el-button v-if="type != 'view'" type="primary" @click="childEvtHandle">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save, SafeLocationTypeEnum } from "./api";
import { FormMixin } from "@/mixins/FormMixin";

export default {
  name: "Dataform",
  mixins: [FormMixin],
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      SafeLocationTypeEnum: SafeLocationTypeEnum,
      dialogShow: false,
      formData: {
        id: null
      },

      formDataRules: {
        deviceType: [{ required: true, message: "请选择", trigger: "change" }],
        deviceCode: [{ required: true, message: "请输入", trigger: "blur" }],
        longitude: [{ required: true, message: "请输入", trigger: "blur" }],
        latitude: [{ required: true, message: "请输入", trigger: "blur" }],
        elevation: [{ required: true, message: "请输入", trigger: "blur" }],
        status: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log("visible", newValue);
        if (newValue) {
          const newData = { ...this.data };
          this.formData = newData;
          if (this.type !== "add") {
          }
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true
    }
  },
  created() {
  },
  methods: {
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    childEvtHandle() {
      // 做业务数据的保存,修改。
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          if (this.type === "view") {
            this.dialogShow = false;
            return;
          }
          const fields = {
            ...this.formData
          };
          if (this.type === "add") {
            save(fields)
              .then((res) => {
                const { success, message } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  this.$emit("ok");
                }
                this.closedHandle();
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("新增失败");
              });
          } else {
            update(fields)
              .then((res) => {
                const { success, message } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  this.$emit("ok");
                }
                this.closedHandle();
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("更新失败");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

  }
};
</script>

<style scoped lang="scss"></style>
