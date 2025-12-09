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
          label-width="120px"
          :disabled="readonly"
        >
          <el-row>
            <el-col :span="11">
              <el-form-item label="资料名称" prop="name">
                <el-input
                  v-model="formData.name"
                  placeholder="请输入内容"
                  show-word-limit
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  maxlength="100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="类型" prop="type">
                <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="formData.type" placeholder="请选择">
                  <el-option
                    v-for="item in DitSpeciality"
                    :key="item.dictId"
                    :label="item.dictName"
                    :value="item.dictId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="封面图片" prop="coverImg">
                <uploadFile
                  :readonly="readonly"
                  v-model="formData.coverImg"
                  :limit="1"
                  :listType="'picture-card'"
                  accept=".png,.jpg,.jpeg,.jpeg"
                ></uploadFile>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="资料上传" prop="uploadFile" ref="uploadFile">
                <uploadFile
                  :readonly="readonly"
                  v-model="formData.uploadFile"
                  :limit="1"
                >
                </uploadFile>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="上传人" prop="createUsername">
                <el-input
                  disabled
                  v-model="formData.createUsername"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <!-- departName -->
              <el-form-item label="上传单位" prop="unitId">
                <el-select @visible-change="$visibleChange($event, 'el-popper')"
                  class="w-100pre"
                  v-model="formData.unitId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in belongUnit"
                    :key="item.corpId"
                    :label="item.corpName"
                    :value="item.corpId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="上传日期" prop="upDate">
                <el-date-picker
                  disabled
                  v-model="formData.upDate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
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
    <el-dialog :visible.sync="imgShow">
      <img width="100%" :src="imgUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { save, update, list, BelongTo } from "./api";
import { dateFormat } from "@/utils";
import { getDictItemList } from "@/api/dict";
import { mapGetters } from "vuex";
import { FormMixin } from "@/mixins/FormMixin";
export default {
  name: "dataform",
  mixins: [FormMixin],
  data() {
    return {
      cover: "",
      baseUrl: "",
      // readonly: false,
      imgShow: false,
      imgUrl: "",
      component: "MonthlyPlan",
      uploadFileList1: [],
      uploadFileList3: [],
      dialogPlanVisible: false,
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },
      DitSpeciality: [],
      pbsName: "",
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
        unitId: null,
        name: "",
        uploadFile: ""
      },
      formDataRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        uploadFile: [
          { required: true, message: "请上传文件", trigger: "change" }
        ]
      },

      tableData: [],
      /**部门选择 */
      deptDialog: {
        selection: [],
        show: false,

        /**业务数据 */
        data: {},
        /**业务字段 */
        fields: []
      },
      deptTypes: [],

      /**组织机构选择 */
      deptShow: false,

      belongUnitSouce: [], //备份 源所属机构
      belongUnit: [] //过滤出重复的单位
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"])
  },
  async created() {
    this.baseUrl = window.location.origin;
    this.jcxmDictItem("pxzllx");
  },
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
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    //获取监测项目字典
    async jcxmDictItem(code) {
      const { data } = await getDictItemList(code);
      this.DitSpeciality = data;
    },

    // 获取当前人的所属机构
    async getBelongTo(row) {
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: row.createUser || userInfo.userId
      };
      try {
        const res = await BelongTo(params);
        const { data, success } = res;

        if (!success) {
          this.$message.error("获取当前人的所属机构错误");
          // 源数据
          this.belongUnit = [];
          return;
        }

        if (Array.isArray(data) && data?.length > 0) {
          this.belongUnitSouce = data;
          // 从源数据中过滤出重复的单位
          this.belongUnit = data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.corpId === item.corpId)
          );
          console.log("this.belongUnitSouce", this.belongUnitSouce, row);
          // 从源数据中过滤出默认单位
          if (row?.unitId) {
            // await this.unitChangeHandle(row.unit);
          } else {
            let defaultUnit = this.belongUnitSouce.find((x) => x.defaultOrg);
            if (defaultUnit) {
              this.$set(this.formData, "unitId", defaultUnit.corpId);
            } else {
              this.formData.unitId = "";
              this.$refs.dataFormRef.clearValidate("contractId");
            }
          }
        } else {
          this.belongUnit = [];
        }
      } catch (error) {
        console.error("Error while fetching BelongTo:", error);
      }
    },

    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    /**确认 */
    childEvtHandle() {
      //做业务数据的保存,修改。
      this.$refs["dataFormRef"].validate((valid) => {
        if (
          this.formData.uploadFile &&
          this.formData.name &&
          this.formData.type
        ) {
          this.$refs.dataFormRef.clearValidate();
        }
        if (valid) {
          if (this.type == "view") {
            this.dialogShow = false;
            return;
          }
          let fields = { ...this.formData };
          if (this.type == "add") {
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
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    // 初始化
    init() {
      if (this.type === "edit" || this.type === "view") {
        this.cover = this.baseUrl + this.formData.coverImg;
        list(this.treeNode.corpId).then((res) => {
          if (res.success) {
            res.data.forEach((item) => {
              if (this.formData.deptId == item.departId) {
                this.$set(this.formData, "departName", item.departName);
              }
            });
          }
        });
        let upDate = dateFormat(this.formData.upDate, "YYYY-MM-DD");
        this.$set(this.formData, "upDate", upDate);
        this.uploadFileList1 = JSON.parse(this.formData.uploadFile) || [];
        this.uploadFileList3 = JSON.parse(this.formData.coverImg) || [];
      } else {
        let upDate = dateFormat(new Date().getTime(), "YYYY-MM-DD");
        this.$set(this.formData, "upDate", upDate);
        let userInfo = this.$getStorage("userInfo");
        this.formData.deptId = userInfo.departId;
        this.formData.departName = userInfo.departName;
        this.formData.createUsername = userInfo.realName;
        this.formData.upDate = this.$dateFormat();
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
        this.getBelongTo(newData);
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
</style>
