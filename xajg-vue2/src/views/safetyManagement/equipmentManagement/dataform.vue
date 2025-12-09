<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="50%"
    v-draggable
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
        <div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备编号:" prop="code">
                <el-input
                  v-model="formData.code"
                  placeholder="请输入"
                  :autosize="{ minRows: 1, maxRows: 6 }"
                  :disabled="readonly"
                  maxlength="50"
                  show-word-limit
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称:" prop="name">
                <el-input
                  v-model="formData.name"
                  placeholder="请输入"
                  :autosize="{ minRows: 1, maxRows: 6 }"
                  :disabled="readonly"
                  maxlength="50"
                  show-word-limit
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类型:" prop="type">
                <el-select
                  v-model="formData.type"
                  placeholder="请选择"
                  style="width: 100%"
                  :disabled="readonly"
                >
                  <el-option label="特种设备" value="special"></el-option>
                  <el-option label="非特种设备" value="general"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="规格型号:" prop="specification">
                <el-input
                  v-model="formData.specification"
                  placeholder="请输入"
                  :autosize="{ minRows: 1, maxRows: 6 }"
                  :disabled="readonly"
                  maxlength="50"
                  show-word-limit
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属单位:" prop="unit">
                <el-select v-model="formData.unit" style="width: 100%">
                  <el-option
                    v-for="item in unitOptions"
                    :key="item.corpId"
                    :label="item.corpName"
                    :value="item.corpId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="进场日期:"
                prop="workStartDate"
                v-if="readonly"
              >
                <el-date-picker
                  v-model="formData.workStartDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="退场时间:"
                prop="workEndDate"
                v-if="readonly"
              >
                <el-date-picker
                  v-model="formData.workEndDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="退场时间:"
                prop="workEndDate"
                v-if="readonly"
              >
                <el-date-picker
                  v-model="formData.workEndDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="进退场状态:"
                prop="outgoingStatus"
                v-if="readonly"
              >
                <el-select
                  class="w-100pre"
                  @visible-change="$visibleChange($event, 'el-popper')"
                  v-model="formData.outgoingStatus"
                  placeholder="请选择"
                >
                  <el-option label="未进场" :value="ENTRY_EXIT_TYPES.DEFAULT">
                  </el-option>
                  <el-option label="已进场" :value="ENTRY_EXIT_TYPES.ENTRY">
                  </el-option>
                  <el-option label="已离场" :value="ENTRY_EXIT_TYPES.EXIT">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="完好状态:" prop="status" v-if="readonly">
                <el-select
                  class="w-100pre"
                  @visible-change="$visibleChange($event, 'el-popper')"
                  v-model="formData.status"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最近维保日期:" prop="maintenanceDate">
                <el-date-picker
                  v-model="formData.maintenanceDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维保周期（天）:" prop="maintenanceDays">
                <el-input
                  v-model="formData.maintenanceDays"
                  placeholder="请输入"
                  :disabled="readonly"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作人员:" prop="operateStaff">
                <staff
                  v-model="formData.operateStaff"
                  :multiple="false"
                  :readonly="readonly"
                  @change="selectedStaff"
                ></staff>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式:" prop="phone">
                <el-input
                  v-model="formData.phone"
                  placeholder="请输入"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附件:" prop="attachment">
                <uploadFile
                  :readonly="readonly"
                  v-model="formData.attachment"
                  :limit="1"
                  :multiline="false"
                  @change="handleFileChange"
                  :maxSize="20"
                >
                </uploadFile>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer" v-if="type != 'view'">
      <el-button type="primary" @click="childEvtHandle"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save, update, BelongTo } from "./api";
import { dateFormat } from "@/utils";
import { FormMixin } from "@/mixins/FormMixin";
import { getDictItemList } from "@/api/dict";
import Staff from "@/components/Staff";
const ENTRY_EXIT_TYPES = {
  DEFAULT: 0,
  ENTRY: 1, // 进场
  EXIT: 2, // 退场
};
export default {
  name: "dataform",
  mixins: [FormMixin],
  components: { Staff },
  data() {
    return {
      ENTRY_EXIT_TYPES,
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },
      pbsName: "",
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
      },

      formDataRules: {
        type: [
          { required: true, message: "设备类型不能为空", trigger: "change" },
        ],
        code: [
          { required: true, message: "设备编号不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        specification: [
          { required: true, message: "规格型号不能为空", trigger: "blur" },
        ],
        sectionId: [
          { required: true, message: "标段名称不能为空", trigger: "change" },
        ],
        workStartDate: [
          { required: true, message: "进场时间不能为空", trigger: "change" },
        ],
        status: [
          { required: true, message: "完好状态不能为空", trigger: "change" },
        ],
        attachment: [
          { required: true, message: "请上传附件", trigger: "change" },
        ],
      },
      tableData: [],
      statusList: [],
      uploadFileList: [],
      multipleSelection: [],
    };
  },
  created() {
    this.getBelongTo();
    this.getDictItemList();
  },
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    unitOptions: {
      type: Array,
      default: () => [],
    },
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
          // view   false  return
          if (this.type === "view") {
            this.dialogShow = false;
            return;
          }
          const fields = {
            ...this.formData,
          };
          console.log(fields, "传参");
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
    },

    // 获取当前人的所属机构
    async getBelongTo() {
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: userInfo.userId,
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
          // 从源数据中过滤出重复的单位
          this.belongUnit = data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.corpId === item.corpId)
          );
          console.log("this.belongUnitSouce", this.belongUnit);
        } else {
          this.belongUnit = [];
        }
      } catch (error) {
        console.error("Error while fetching BelongTo:", error);
      }
    },

    /**获取字典 */
    async getDictItemList() {
      const statusObj = await getDictItemList("GOOD_CONDITION");
      this.statusList = statusObj.data;
    },
    handleFileChange(value) {
      if (value) {
        this.$refs.dataFormRef?.clearValidate("attachment");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectedStaff(value, item) {
      console.log(".......", value, item);
      if (item?.phone) {
        this.formData.phone = item.phone;
      }
    },
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log("visible", newValue);
        if (newValue) {
          const newData = { ...this.data };
          this.formData = newData;
          // if (!this.formData?.type) {
          //   this.formData.type = "special";
          // }
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

::v-deep .el-table__row {
  .el-form-item__content {
    margin-left: 0px !important;
  }
}

/deep/ .el-form-item__content {
  // min-width: auto !important;
  line-height: 34px !important;
}
</style>
