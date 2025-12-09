<template>
  <el-dialog
    v-draggable
    :title="title"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="25%"
    @closed="closedHandle"
  >
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="96px"
        :disabled="readonly"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="监测点：" prop="monitorPoint">
              <el-input
                v-model="formData.monitorPoint"
                placeholder="请输入"
                width="100%"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="更新时间：" prop="monitorDate">
              <el-date-picker
                v-model="formData.monitorDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="实时雨情：" prop="rianfall">
              <el-input
                v-model="formData.rianfall"
                placeholder="请输入"
                width="100%"
                @input="limitInput($event, 'rianfall')"
              >
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div v-if="type != 'view'" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="childEvtHandle">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save, update } from "./api";
import { dateFormat } from "@/utils";
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
    // /**已经选中pbs信息 */
    // data: {
    //   type: Object,
    //   default: {},
    // },
    // /**是否只读 */
    // readonly: {
    //   type: Boolean,
    //   default: false,
    // },
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
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null
      },
      formDataRules: {
        monitorDate: [
          { required: true, message: "请选择更新时间", trigger: "change" }
        ],
        rianfall: [{ required: true, message: "请输入", trigger: "blur" }],
        monitorPoint: [{ required: true, message: "请输入", trigger: "blur" }]
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
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    limitInput(value, name) {
      this.formData[name] =
        ("" + value) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, "") // 第二步：把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, "$1") // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, "0.") // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(/^\d*(\.?\d{0,2})/g)[0] || ""; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
    },
    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    /**确认 */
    childEvtHandle() {
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          //做业务数据的保存,修改。
          // view   false  return
          if (this.type === "view") {
            this.dialogShow = false;
            return;
          }
          const fields = {
            ...this.formData
          };
          // let qeq=this.type save  update"
          if (this.type === "add") {
            save(fields)
              .then((res) => {
                const { success, message } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  // this.$message.success("新增成功");
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
                  // this.$message.success("新增成功");
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

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  // padding: 15px;

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
<style scoped lang="scss">
.el-form {
  .el-row {
    margin-bottom: 8px;
  }
}
</style>
