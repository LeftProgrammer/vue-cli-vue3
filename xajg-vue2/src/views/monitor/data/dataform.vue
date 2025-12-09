<template>
  <div>
    <el-dialog
      :title="title"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="50%"
      @closed="closedHandle"
      v-draggable
    >
      <el-row>
        <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="formDataRules"
          label-width="140px"
          :disabled="readonly"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="监测点编码" prop="code">
                <el-input
                  placeholder="请输入"
                  v-model="formData.code"
                  show-word-limit
                  maxlength="50"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="监测点名称" prop="name">
                <el-input
                  placeholder="请输入"
                  v-model="formData.name"
                  show-word-limit
                  maxlength="50"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="监测项目" prop="pointType">
                <dict code="zxjclx" v-model="formData.pointType"></dict>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="监测点经纬度" prop="latLon">
                <el-input
                  placeholder="请输入"
                  v-model="formData.latLon"
                  show-word-limit
                  maxlength="50"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备安装单位" prop="installUnit">
                <el-input
                  placeholder="请输入"
                  v-model="formData.installUnit"
                  show-word-limit
                  maxlength="50"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备安装日期" prop="installDate">
                <el-date-picker
                  v-model="formData.installDate"
                  type="date"
                  placeholder="请选择"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备（维护）负责人">
                <el-input
                  placeholder="请选择"
                  v-model="formData.maintainUser"
                  show-word-limit
                  maxlength="50"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人联系电话">
                <el-input
                  placeholder="请输入"
                  v-model="formData.maintainTel"
                  show-word-limit
                  maxlength="50"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="关联位置">
                <relate-place
                  v-model="formData.pointPlace"
                  :readonly="readonly"
                  title="点击左键标记监测点位置"
                ></relate-place>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关联第三方监测平台编码">
                <el-input placeholder="请输入" v-model="formData.fromSource">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="childEvtHandle" v-if="type != 'view'">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { save, update } from "./api";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import ContentLayout from "@/components/ContentLayout/Table";
import { FormMixin } from "@/mixins/FormMixin";
import BimEngine from "@/components/BimEngine/index";
import Dict from "@/components/Dict";
import RelatePlace from "@/components/RelatePlace";
export default {
  name: "dataform",
  mixins: [FormMixin],
  components: {
    ContentLayout,
    BimEngine,
    Dict,
    RelatePlace
  },
  data() {
    return {
      isFullscreen: false,
      point: "",
      pointPosition: { show: false, left: 0, top: 0 },
      monitorFlag: 1,
      pointShow: false,
      dialogPlanVisible: false,
      pbsName: "",
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
        regionType: ""
      },
      formDataRules: {
        code: [{ required: true, message: "请输入", trigger: "blur" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        pointType: [{ required: true, message: "请选择", trigger: "change" }]
      },
      DitSpeciality: [],
      ssqyList: [],
      jklxList: []
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"])
  },
  async created() {},
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => {}
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
  methods: {
    sure() {
      this.surePoint();
      this.$nextTick(() => {
        this.dialogPlanVisible = false;
      });
    },
    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    /**确认 */
    childEvtHandle() {
      //做业务数据的保存,修改。

      // view   false  return
      if (this.type == "view") {
        this.dialogShow = false;
        return;
      }
      let fields = { ...this.formData };
      // fields.point = fields.point.split(',')
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          if (this.type == "add") {
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
      // let qeq=this.type save  update"
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    getpos(e) {
      console.log(e, "父组件获取");
      this.point = e.join(",");
      this.pointShow = true;
    },
    surePoint() {
      this.formData.point = this.point;
      this.pointShow = false;
      this.dialogPlanVisible = false;
    },
    cancelPoint() {
      this.point = "";
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          let newData = { ...this.data };

          if (typeof newData.type == "string") {
            newData.type = JSON.parse(newData.type);
          }
          this.formData = newData;
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
.map {
  width: 100%; /* 确保图片填满容器 */
  height: 100%; /* 确保图片填满容器 */
  object-fit: cover;
}

.tips {
  font-size: 18px;
  color: #ffffff;
  position: absolute;
  top: 10px;
  left: 10px;
}

.openFull {
  width: 40px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.point {
  position: absolute;
  width: 40px;
}

/deep/ .el-dialog .el-dialog__body {
  height: 90%;
}

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

.el-select {
  width: 100%;
}

/deep/.el-input-group__append {
  color: #0096ff;
  border: 1px solid #0096ff;
  cursor: pointer;
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

.bim-content {
  border: 1px solid #eee;
  height: 60vh;
  margin: 0px 10px 10px 10px;
  border-right: 1px solid #eee;
}
</style>
