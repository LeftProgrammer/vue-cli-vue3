<template>
  <div>
    <el-dialog
      :title="title"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      v-draggable
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
          label-width="180px"
          :disabled="readonly"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="工程部位" prop="pbsName">
                <el-input
                  disabled
                  v-model="formData.pbsName"
                  type="text"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划开始日期" prop="upDate">
                <el-date-picker
                  v-model="formData.planStartDate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划结束日期" prop="upDate">
                <el-date-picker
                  v-model="formData.planEndDate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <p class="sub-title">设计工程量</p>
            </el-col>
          </el-row>
          <el-col :span="12" v-show="isShowFiled('DSKW')">
            <el-form-item label="洞身开挖(m)" prop="dskw">
              <el-input
                v-model="formData.dskw"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('DSKW')">
            <el-form-item label="洞身支护(m)" prop="dszh">
              <el-input
                v-model="formData.dszh"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('DSCC')">
            <el-form-item label="洞身衬砌(m)" prop="dscc">
              <el-input
                v-model="formData.dscc"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('DDWYJ')">
            <el-form-item label="多点位移计（套）" prop="ddwyj">
              <el-input
                v-model="formData.ddwyj"
                type="number"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12" v-show="isShowFiled('MGYLJ_T')">
            <el-form-item label="锚杆应力计(套)" prop="mgyljT">
              <el-input
                v-model="formData.mgyljT"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('TSFKW')">
            <el-form-item label="土石方开挖（m³）" prop="tsfkw">
              <el-input
                v-model="formData.tsfkw"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('BPZH_MG')">
            <el-form-item label="边坡支护-锚杆（根）" prop="bpzhMg">
              <el-input
                v-model="formData.bpzhMg"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('BPZH_MGS')">
            <el-form-item label="边坡支护-锚杆束（束）" prop="bpzhMgs">
              <el-input
                v-model="formData.bpzhMgs"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('BPZH_MS')">
            <el-form-item label="边坡支护-锚索（束)" prop="bpzhMs">
              <el-input
                v-model="formData.bpzhMs"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('LMDCJYJLM')">
            <el-form-item label="路面垫层及永久路面（m）" prop="lmdcjyjlm">
              <el-input
                v-model="formData.lmdcjyjlm"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('ECCC')">
            <el-form-item label="二次衬砌（m）" prop="eccc">
              <el-input
                v-model="formData.eccc"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('QBQW')">
            <el-form-item label="清表清危（m³）" prop="qbqw">
              <el-input
                v-model="formData.qbqw"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('ZDW')">
            <el-form-item label="主动网（m²）" prop="zdw">
              <el-input
                v-model="formData.zdw"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('BDW')">
            <el-form-item label="被动网（m）" prop="bdw">
              <el-input
                v-model="formData.bdw"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('MG')">
            <el-form-item label="锚杆（根）" prop="mg">
              <el-input
                v-model="formData.mg"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('MGS')">
            <el-form-item label="锚杆束（束）" prop="mgs">
              <el-input
                v-model="formData.mgs"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('MS')">
            <el-form-item label="锚索（束）" prop="ms">
              <el-input
                v-model="formData.ms"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('WXZ')">
            <el-form-item label="微芯桩（套）" prop="wxz">
              <el-input
                v-model="formData.wxz"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('GNSS')">
            <el-form-item label="GNSS（套）" prop="gnss">
              <el-input
                v-model="formData.gnss"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('MGYLJ_Z')">
            <el-form-item label="锚杆应力计（支）" prop="mgyljZ">
              <el-input
                v-model="formData.mgyljZ"
                type="number"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12" v-show="isShowFiled('MSCLJ')">
            <el-form-item label="锚索测力计（支）" prop="msclj">
              <el-input
                v-model="formData.msclj"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('ZJKW')">
            <el-form-item label="桩基开挖（m）" prop="zjkw">
              <el-input
                v-model="formData.zjkw"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('ZJJZ')">
            <el-form-item label="桩基浇筑（m）" prop="zjjz">
              <el-input
                v-model="formData.zjjz"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('QTJZ')">
            <el-form-item label="桥台浇筑（m³）" prop="qtjz">
              <el-input
                v-model="formData.qtjz"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('JJDJZ')">
            <el-form-item label="交界墩浇筑（m）" prop="jjdjz">
              <el-input
                v-model="formData.jjdjz"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('GJGZZ')">
            <el-form-item label="钢结构制作（吨）" prop="gjgzz">
              <el-input
                v-model="formData.gjgzz"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('GXBZ')">
            <el-form-item label="空心板制（块）" prop="gxbz">
              <el-input
                v-model="formData.gxbz"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('GZJZ')">
            <el-form-item label="拱座浇筑（m³）" prop="gzjz">
              <el-input
                v-model="formData.gzjz"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('TFKW')">
            <el-form-item label="土方开挖（m³）" prop="tfkw">
              <el-input
                v-model="formData.tfkw"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('ZJSG')">
            <el-form-item label="桩基施工（m）" prop="zjsg">
              <el-input
                v-model="formData.zjsg"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('ZTJGHNT')">
            <el-form-item label="主体结构混凝土（m³）" prop="ztjghnt">
              <el-input
                v-model="formData.ztjghnt"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('ECJGQZ')">
            <el-form-item label="二次结构砌筑（m³）" prop="ecjgqz">
              <el-input
                v-model="formData.ecjgqz"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('JGGC')">
            <el-form-item label="机电工程（%）" prop="jggc">
              <el-input
                v-model="formData.jggc"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('ZXGC')">
            <el-form-item label="装修工程（%）" prop="zxgc">
              <el-input
                v-model="formData.zxgc"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isShowFiled('YLGC')">
            <el-form-item label="园林工程（%）" prop="ylgc">
              <el-input
                v-model="formData.ylgc"
                type="number"
              />
            </el-form-item>
          </el-col>

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
import { save } from "./api";
import { dateFormat } from "@/utils";
import { FormMixin } from "@/mixins/FormMixin";
export default {
  name: "dataform",
  mixins: [FormMixin],
  data() {
    return {
      /**弹窗显示 */
      dialogShow: false,
      formData: {
      },
      formDataRules: {
        pbsName: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
    };
  },
  computed: {

  },
  async created() {
    console.log("树节点checkNode：", this.checkNode)

    this.init();
  },
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
    },
    data: {
      type: Object,
      default: () => {}
    },
    checkNode: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    isShowFiled(field){
      return this.checkNode?.quantityTarget?.split(",").includes(field);
    },

    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    /**确认 */
    childEvtHandle() {
      console.log(this.formData)
      //做业务数据的保存,修改。
      this.$refs["dataFormRef"].validate((valid) => {
        if (this.formData.name) {
          this.$refs.dataFormRef.clearValidate();
        }
        if (valid) {
          if (this.type == "view") {
            this.dialogShow = false;
            return;
          }
          let fields = { ...this.formData };
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
              this.$message.error("保存失败");
            });

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    // 初始化
    init() {
      if (this.data.name) {
        if(this.data.designQuantitiesDetail) {
          this.formData = {...this.data.designQuantitiesDetail}

          if (this.formData.planStartDate) {
            let planStartDate = dateFormat(this.formData.planStartDate, 'YYYY-MM-DD');
            this.$set(this.formData, 'planStartDate', planStartDate);
          }
          if (this.formData.planEndDate) {
            let planEndDate = dateFormat(this.formData.planEndDate, 'YYYY-MM-DD');
            this.$set(this.formData, 'planEndDate', planEndDate);
          }
        }
        this.formData.pbsName = this.data.name;
        this.formData.pbsCode = this.data.code;
      }
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        let newData = { ...this.data };
        if (newValue) {
          this.formData = newData;
          this.init();
        } else {
          this.formData = {};
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

.el-select {
  width: 100%;
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

/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/deep/.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  display: block;
}

/deep/.avatar-uploader .el-upload-list__item {
  height: 70px;
  width: 70px;
}

/deep/.avatar-uploader .el-upload--picture-card {
  height: 70px;
  width: 70px;
  line-height: 70px;
}
</style>
<style scoped lang="scss">
.el-form {
  .el-row {
    margin-bottom: 8px;
  }
}

.sub-title{
  font-weight: 1000;
  color: #282424;
  font-size: 15px;
  padding: 0 0 8px 8px;
  margin-bottom: 14px;
  border-bottom: 1px #ccc solid;
}

//.wbench-el-dialog{
//  overflow: unset !important;
//}
//
///deep/ .el-dialog__body{
//  overflow: auto !important;
//}
</style>
