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
    <el-form
      ref="dataFormRef"
      :model="formData"
      :rules="formDataRules"
      label-width="120px"
      :disabled="readonly"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属装备:" prop="equipmentId">
            <el-select
              class="w-100pre"
              @visible-change="$visibleChange($event, 'el-popper')"
              v-model="formData.equipmentId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in equipmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间" prop="actionTime">
            <el-date-picker
              v-model="formData.actionTime"
              type="datetime"
              style="width: 100%"
              placeholder="请选择时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="详细内容:" prop="detail">
          <el-input
            type="textarea"
            v-model="formData.detail"
            placeholder="请输入"
            :autosize="{ minRows: 3, maxRows: 6 }"
            :disabled="readonly"
            maxlength="5000"
            show-word-limit
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图片:" prop="image">
            <uploadFile
              :readonly="readonly"
              v-model="formData.image"
              :limit="1"
              :multiline="false"
              @change="handleFileChange"
              :maxSize="20"
              accept=".jpg,.jpeg,.png,.gif,.bmp"
            >
            </uploadFile>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">
        {{ type === "view" ? "关闭" : "取消" }}
      </el-button>
      <el-button v-if="type != 'view'" type="primary" @click="childEvtHandle">
        确定
      </el-button>
    </div>
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileUpload"
    />
  </el-dialog>
</template>

<script>
import { save, update, equipmentList } from "./api";
import { dateFormat } from "@/utils";
import { FormMixin } from "@/mixins/FormMixin";
import Staff from "@/components/Staff";
import * as XLSX from "xlsx";
export default {
  name: "dataform",
  mixins: [FormMixin],
  components: { Staff },
  data() {
    return {
      equipmentList: [],
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
        actionTime: [
          { required: true, message: "请选择时间", trigger: "change" },
        ],
        equipmentId: [
          { required: true, message: "请选择所属装备", trigger: "change" },
        ],
      },
      tableData: [],
      statusList: [],
      uploadFileList: [],
      multipleSelection: [],
      paymentMethodList: [],
      downloadPath: "/static/template/合同清单导入模板.xlsx",
    };
  },
  created() {
    this.getEquipmentList();
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    },
  },
  props: {
    /**显示弹窗 */
    readonly: {
      type: Boolean,
      default: false,
    },
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
          this.formData.detailVos = this.tableData;
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
                this.$message.error("网络连接失败,请稍后再试");
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
                this.$message.error("网络连接失败,请稍后再试");
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
    async getEquipmentList() {
      const res = await equipmentList();
      this.equipmentList = res.data;
    },

    handleFileChange(value) {
      if (value) {
        this.$refs.dataFormRef?.clearValidate("attachment");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addDetailBtn() {
      this.tableData.push({});
    },
    async deleteDetailBtn(index, row) {
      await this.$confirm(`确认删除数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
      });
      // 删除选中的数据
      this.tableData.splice(index, 1);
    },
    downloadTemplate() {
      console.log("下载模板");
      let fileName = "合同清单导入模板.xlsx";
      var link = document.createElement("a");
      link.href = this.downloadPath;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    triggerFileInput() {
      this.$nextTick(() => {
        this.$refs.fileInput.click();
      });
    },
    handleFileUpload(event) {
      console.log("开始读取文件");
      const files = event.target.files;
      console.log(files.length);
      if (files.length === 0) return;
      const file = files[0];
      const reader = new FileReader();
      const fieldMap = {
        code: "系统编码",
        orderNo: "清单编号",
        name: "名称",
        unit: "单位",
        quantity: "工程量",
        price: "单价(元)",
        totalPrice: "合价(元)",
      };

      reader.onload = (e) => {
        let that = this;
        const data = new Uint8Array(e.target.result);
        console.log(XLSX);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet); //加上{header:1}会把第一行作为表头
        let newArr = [];
        jsonData &&
          jsonData.length &&
          jsonData.forEach((item) => {
            newArr.push({
              code: item[fieldMap.code],
              orderNo: item[fieldMap.orderNo],
              name: item[fieldMap.name],
              unit: item[fieldMap.unit],
              quantity: item[fieldMap.quantity],
              price: item[fieldMap.price],
              totalPrice: item[fieldMap.totalPrice],
            });
          });
        let dataToAdd = [];
        for (let index = 0; index < newArr.length; index++) {
          const element = newArr[index];
          let targetIndex = this.tableData.findIndex(
            (i) => i.code === element.code
          );
          if (targetIndex > -1) {
            // 更新
            Object.assign(this.tableData[targetIndex], element);
          } else {
            // 增加
            dataToAdd.push(element);
          }
        }
        if (dataToAdd.length > 0) {
          that.tableData = that.tableData.concat(dataToAdd);
        }
        this.calcTotal();
        this.$refs.fileInput.value = ""; // 清空input方便下次继续上传
      };
      reader.readAsArrayBuffer(file);
    },
    calcTotal() {
      //统计末端节点的金额
      let total = 0;
      for (let index = 0; index < this.tableData.length; index++) {
        const item1 = this.tableData[index];
        if (!item1.code) {
          total += item1.totalPrice;
          continue;
        }
        let ok = true; //检查item1 是否是某个节点的父级
        for (let index1 = 0; index1 < this.tableData.length; index1++) {
          const item2 = this.tableData[index1];
          if (!item2.code) continue;
          if (
            item2.code.toString().indexOf(item1.code.toString() + ".") === 0
          ) {
            ok = false;
            break;
          }
        }
        if (ok) {
          //ok 表示item1是叶子结点
          total += item1.totalPrice;
        }
      }
      if (isNaN(total)) {
        this.$message.warn("合同总价内容必须是数字且不能为空");
      }
      total = total.toFixed(2);
      this.$set(this.formData, "amount", total);
    },
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log("visible", newValue);
        if (newValue) {
          const newData = { ...this.data };
          this.formData = newData;
          // 检查并赋值
          if (!this.formData.personInCharge) {
            this.$set(this.formData, "personInCharge", this.userInfo.userId);
          }
          if (!this.formData.unitName) {
            this.$set(this.formData, "unitName", this.userInfo.corpName);
          }
          if (!this.formData.initiationDate) {
            this.$set(this.formData, "initiationDate", new Date());
          }
          if (newData.detailVos) {
            this.tableData = newData.detailVos;
          }
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
