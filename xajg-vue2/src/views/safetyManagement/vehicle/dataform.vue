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
            <el-form-item label="车牌号:" prop="code">
              <el-input
                v-model="formData.code"
                placeholder="请输入"
                :disabled="readonly"
                maxlength="20"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程部位:" prop="pbsCode">
              <pbsSelect
                v-model="formData.pbsCode"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆类型:" prop="type">
              <el-select
                v-model="formData.type"
                class="w-100pre"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="(value, key) in vehicleTypeEnum"
                  :key="value"
                  :label="vehicleTypeNameMap[value]"
                  :value="value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属单位:" prop="unit">
              <el-cascader
                v-model="formData.unit"
                :props="unitTreeProps"
                :show-all-levels="false"
                :options="unitTree"
                :disabled="readonly"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="司机姓名:" prop="driverName">
              <el-input
                v-model="formData.driverName"
                placeholder="请输入"
                :disabled="readonly"
                maxlength="50"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话:" prop="contactPhone">
              <el-input
                v-model="formData.contactPhone"
                placeholder="请输入"
                :disabled="readonly"
                maxlength="20"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入场日期:" prop="enterDate">
              <el-date-picker
                v-model="formData.enterDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退场日期:" prop="leaveDate">
              <el-date-picker
                v-model="formData.leaveDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="照片:" prop="image">
              <uploadFile
                v-model="formData.image"
                :readonly="readonly"
                :limit="10"
                :max-size="20"
                accept=".jpg,.jpeg,.png,.gif,.bmp"
                @change="handleFileChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">{{
        type === "view" ? "关闭" : "取消"
      }}</el-button>
      <el-button v-if="type != 'view'" type="primary" @click="childEvtHandle">
        确定
      </el-button>
    </div>
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      @change="handleFileUpload"
    >
  </el-dialog>
</template>

<script>
import { save, update, unitAllList } from "./api";
import { dateFormat } from "@/utils";
import { FormMixin } from "@/mixins/FormMixin";
import { getDictItemList } from "@/api/dict";
import Staff from "@/components/Staff";
import * as XLSX from "xlsx";
import { VEHICLE_TYPE, VEHICLE_TYPE_NAME } from "./constants";

export default {
  name: "Dataform",
  components: { Staff },
  mixins: [FormMixin],
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
  data() {
    return {
      unitTree: [], // 单位树形结构
      unitTreeProps: {
        expandTrigger: "hover",
        children: "children",
        emitPath: false,
        label: "corpName",
        value: "corpId",
      },

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
        code: [{ required: true, message: "请输入车牌号", trigger: "blur" }],
        pbsCode: [
          { required: true, message: "请选择工程部位", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择车辆类型", trigger: "change" },
        ],
        unit: [{ required: true, message: "请输入所属单位", trigger: "blur" }],
        driverName: [
          { required: true, message: "请输入司机姓名", trigger: "blur" },
        ],
        contactPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        enterDate: [
          { required: true, message: "请选择入场时间", trigger: "change" },
        ],
        image: [
          { required: true, message: "请上传车辆照片", trigger: "change" },
        ],
      },
      statusList: [],
      uploadFileList: [],
      multipleSelection: [],
      vehicleTypeEnum: VEHICLE_TYPE,
      vehicleTypeNameMap: VEHICLE_TYPE_NAME,
    };
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
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
  created() {
    this.getUnitAll();
  },
  created() {
    this.getUnitAll();
  },
  methods: {
    /**
     * 将扁平数组转换成树形结构
     * @param {Array} data 扁平数组数据
     * @returns {Array} 树形结构数组
     */
    buildUnitTree(data) {
      if (!Array.isArray(data)) {
        return [];
      }

      // 创建一个映射表，用于快速查找节点
      const map = {};
      data.forEach((item) => {
        map[item.corpId] = { ...item, children: [] };
      });

      // 构建树形结构
      const treeData = [];

      data.forEach((item) => {
        const currentNode = map[item.corpId];

        // 如果有父节点且父节点存在于映射表中，则添加到父节点的children中
        if (item.corpPid && map[item.corpPid]) {
          map[item.corpPid].children.push(currentNode);
        } else {
          // 没有父节点或父节点不在数据中，则作为根节点
          treeData.push(currentNode);
        }
      });
      // 遍历树形结构，删除没有子节点的节点的children字段
      treeData.forEach((node) => {
        const removeEmptyChildren = (node) => {
          if (node.children && node.children.length === 0) {
            delete node.children; // 删除没有子节点的children字段
          }
          node.children?.forEach(removeEmptyChildren); // 递归处理子节点
        };
        removeEmptyChildren(node);
      });
      return treeData;
    },
    async getUnitAll() {
      try {
        const result = await unitAllList();
        const { data, success } = result;
        if (!success) {
          this.unitListAll = [];
          this.$message.error("获取单位列表失败");
          return;
        }
        let unitList = data.sort((a, b) => {
          return a.corpSort - b.corpSort;
        });
        this.belongUnit = unitList;
        // 构建单位树形结构
        this.unitTree = this.buildUnitTree(unitList);
        console.log("unitTree", this.unitTree);
        return unitList;
      } catch (err) {
        console.log("err", err);
      }
    },
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

    handleFileChange(value) {
      if (value) {
        this.$refs.dataFormRef?.clearValidate("image");
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
    timeFormat(time, type) {
      if (!time) {
        return "";
      }
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    handleFileUpload(event) {
      console.log("开始读取文件");
      const files = event.target.files;
      console.log(files.length);
      if (files.length === 0) return;
      const file = files[0];
      const reader = new FileReader();
      const fieldMap = {
        code: "车牌号",
        type: "车辆类型",
        unit: "所属单位",
        driverName: "司机姓名",
        contactPhone: "联系电话",
        enterDate: "入场时间",
        leaveDate: "退场时间",
        image: "车辆照片",
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
              type: item[fieldMap.type],
              unit: item[fieldMap.unit],
              driverName: item[fieldMap.driverName],
              contactPhone: item[fieldMap.contactPhone],
              enterDate: item[fieldMap.enterDate],
              leaveDate: item[fieldMap.leaveDate],
              image: item[fieldMap.image],
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
