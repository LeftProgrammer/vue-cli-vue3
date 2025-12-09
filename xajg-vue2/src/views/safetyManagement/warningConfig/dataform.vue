<template>
  <el-dialog
    :title="title"
    custom-class="wbench-el-dialog"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="25%"
    @closed="closedHandle"
    v-draggable
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
            <el-form-item label="预警项目：" prop="monitorProject">
              <el-select class="w-100pre"
                         v-model="formData.monitorProject"
                         placeholder="请选择"
                         @change="handleChange"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="预警指标：" prop="warningItem">
              <el-select class="w-100pre"
                         v-model="formData.warningItem"
                         placeholder="请选择"
              >
                <el-option
                  v-for="item in childTypeOptions"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-form-item label="阈值：" prop="thresholdLowerLimit">
              <el-input-number
                v-model="formData.thresholdLowerLimit"
                size="medium"
                controls-position="right"
                placeholder="请输入下限值"
                style="width: 152px"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label-width="'50px'" label="至" prop="thresholdUpperLimit">
              <el-input-number
                v-model="formData.thresholdUpperLimit"
                size="medium"
                controls-position="right"
                placeholder="请输入上限值"
                style="width: 152px"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="启用状态：" prop="status">
              <el-select class="w-100pre"
                         v-model="formData.status"
                         placeholder="请选择"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer" v-if="type != 'view'">
      <el-button :loading="addLoading"  type="primary" @click="childEvtHandle">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save, update } from "./api";
import { dateFormat } from "@/utils";
import { FormMixin } from "@/mixins/FormMixin";
import { getDictItemList, buildTree } from "@/api/dict";

export default {
  name: "dataform",
  mixins: [FormMixin],
  data() {
    return {
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },
      /**弹窗显示 */
      dialogShow: false,
      addLoading: false,
      typeDictMap: [],
      typeOptions: [],
      childTypeOptions: [],
      statusOptions: [{
        name:'禁用',
        value:'0',
      },{
        name:'启用',
        value:'1',
      }],
      formData: {
        id: null
      },
      formDataRules: {
        monitorProject: [ { required: true, message: "请选择监测项目", trigger: "change" } ],
        warningItem: [{ required: true, message: "请选择预警指标", trigger: "change" }],
        status: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  },
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
  created() {
    this.getDict();
  },
  methods: {
    handleChange(val) {
      this.childTypeOptions = this.typeOptions.filter(x => x.dictCode === val)[0].children;
    },
    async getDict(){
      let res = await getDictItemList("zxjclx");
      console.log(res)
      this.typeDictMap = res.data;
      this.typeOptions = buildTree(res.data, "-");
    },
    // limitInput(value, name) {
    //   this.formData[name] =
    //     ("" + value) // 第一步：转成字符串
    //       .replace(/[^\d^\.^\-]+/g, "") // 第二步：把不是数字，不是小数点的过滤掉
    //       .replace(/^0+(\d)/, "$1") // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
    //       .replace(/^\./, "0.") // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
    //       .match(/^\d*(\.?\d{0,2})/g)[0] || ""; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
    // },
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
          if(!fields.thresholdLowerLimit){
            fields.thresholdLowerLimit = '';
          }
          if(!fields.thresholdUpperLimit){
            fields.thresholdUpperLimit = '';
          }
          // let qeq=this.type save  update"
          this.addLoading = true;
          if (this.type === "add") {
            save(fields)
              .then((res) => {
                const { success, message } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  this.$message.success("新增成功");
                  this.$emit("ok");
                }
                this.closedHandle();
                this.addLoading = false;
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("新增失败");
                this.addLoading = false;
              });
          } else {
            update(fields)
              .then((res) => {
                const { success, message } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  this.$message.success("编辑成功");
                  this.$emit("ok");
                }
                this.closedHandle();
                this.addLoading = false;
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("更新失败");
                this.addLoading = false;
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
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log("visible", newValue);
        if (newValue) {
          const newData = { ...this.data };
          this.formData = newData;
          if(!this.formData.thresholdLowerLimit){
            this.formData.thresholdLowerLimit = undefined
          }
          if(!this.formData.thresholdUpperLimit){
            this.formData.thresholdUpperLimit = undefined
          }
          if (this.formData.monitorProject) {
            let timer = setInterval(() => {
              if (this.typeOptions.length > 0) {
                this.handleChange(this.formData.monitorProject);
                clearInterval(timer);
              }
            }, 50)
          }
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true
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
