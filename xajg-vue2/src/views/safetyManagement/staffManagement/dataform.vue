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
            <el-form-item label="姓名:" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入"
                width="100%"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄:" prop="age">
              <el-input
                v-model="formData.age"
                placeholder="请输入"
                width="100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证:" prop="agentCard">
              <el-input
                v-model="formData.agentCard"
                placeholder="请输入"
                width="100%"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯:" prop="place">
              <el-input
                v-model="formData.place"
                placeholder="请输入"
                width="100%"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话:" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="请输入"
                width="100%"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员类型:" prop="type">
              <el-select
                v-model="formData.type"
                class="w-100pre"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in staffTypeList"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族:" prop="race">
              <el-input
                v-model="formData.race"
                placeholder="请输入"
                width="100%"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属单位:" prop="unit">
              <el-select
                v-model="formData.unit"
                class="w-100pre"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in belongUnit"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="readonly"
              label="进场日期:"
              prop="workStartDate"
            >
              <el-date-picker
                v-model="formData.workStartDate"
                type="datetime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="readonly" label="退场日期:" prop="workEndDate">
              <el-date-picker
                v-model="formData.workEndDate"
                type="datetime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="readonly" label="状态:" prop="status">
              <el-select
                v-model="formData.status"
                class="w-100pre"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option label="未进场" :value="0" />
                <el-option label="已进场" :value="1" />
                <el-option label="已离场" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片:" prop="photo">
              <uploadFile
                v-model="formData.photo"
                :readonly="readonly"
                :limit="1"
                :multiline="false"
                @change="handleFileChange"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!--    证书明细表-->
        <!-- <el-row
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="width: 50%; color: #000">证书明细列表</div> -->
        <div class="mb-8">
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="readonly"
            @click="addDetailBtn()"
          >
            添加
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="readonly"
            @click="deleteDetailBtn()"
          >
            删除
          </el-button>
        </div>
        <!-- </el-row>
        <el-divider></el-divider> -->

        <el-row class="table">
          <el-table
            ref="multipleTable"
            border
            :data="tableData"
            style="max-height: 50vh; overflow: auto"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="序号"
              type="selection"
              width="80"
              align="center"
            />
            <el-table-column
              label="证书类型"
              prop="type"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-select
                    v-model="row.type"
                    class="w-100pre"
                    placeholder="请选择"
                    @visible-change="$visibleChange($event, 'el-popper')"
                  >
                    <el-option
                      v-for="item in certificateTypeList"
                      :key="item.dictCode"
                      :label="item.dictName"
                      :value="item.dictCode"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="证书名称"
              prop="name"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input
                    v-model="row.name"
                    type="textarea"
                    placeholder="请输入"
                    :autosize="{ minRows: 1, maxRows: 6 }"
                    :disabled="readonly"
                    maxlength="100"
                    show-word-limit
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="证书编号"
              prop="code"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input
                    v-model="row.code"
                    style="width: 100%"
                    placeholder="请输入"
                    :disabled="readonly"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="发证单位"
              prop="unit"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input
                    v-model="row.unit"
                    style="width: 100%"
                    placeholder="请输入"
                    :disabled="readonly"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="发证日期"
              prop="issuanceDate"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-date-picker
                  v-model="row.issuanceDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="到期日期"
              prop="expirationDate"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-date-picker
                  v-model="row.expirationDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="提醒天数"
              prop="noticeDays"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-input-number
                  v-model="row.noticeDays"
                  style="width: 100%"
                  placeholder="请输入"
                  :disabled="readonly"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="证书附件"
              prop="uploadFile"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <uploadFile
                  v-model="row.uploadFile"
                  :readonly="readonly"
                  :limit="2"
                  :multiline="false"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{
        type == "view" ? "关闭" : "取消"
      }}</el-button>
      <el-button v-if="type != 'view'" type="primary" @click="childEvtHandle">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save, update, BelongTo, batchImport } from "./api";
import { dateFormat } from "@/utils";
import { FormMixin } from "@/mixins/FormMixin";
import { getDictItemList } from "@/api/dict";
export default {
  name: "Dataform",
  mixins: [FormMixin],
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false,
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
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },
      DitSpeciality: [],
      pbsName: "",
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
      },

      formDataRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        agentCard: [
          { required: true, message: "请输入身份证", trigger: "blur" },
          {
            pattern:
              /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "请输入正确的身份证号码",
            trigger: "blur",
          },
        ],
        place: [{ required: true, message: "请输入籍贯", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入电话", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "请选择人员类型", trigger: "change" },
        ],
        race: [{ required: true, message: "请输入民族", trigger: "blur" }],
        unit: [
          { required: true, message: "请选择所属单位", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },

      tableData: [],
      deptTypes: [],
      belongUnit: [],
      staffTypeList: [],
      statusList: [],
      uploadFileList: [],
      certificateTypeList: [],
      multipleSelection: [],
    };
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log("visible", newValue);
        if (newValue) {
          const newData = { ...this.data };
          this.formData = newData;
          // this.formData.status = this.formData.status == "1";
          if (newData.detailVos) {
            this.tableData = newData.detailVos;
          }
          if (this.type !== "add") {
            // this.formData.monitorDate = this.timeFormat(this.formData.monitorDate, 'YYYY-MM-DD HH:mm:ss')
          }
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getBelongTo();
    this.getDictItemList();
  },
  methods: {
    // getPbsName(val) {
    //   let text = "*";
    //   console.log("getPbsName", val);
    //   let a = val?.split("&&&")[1];
    //   if (a) {
    //     text = a;
    //   }
    //   return text;
    // },
    /** 选择PBS */
    limitInput(value, name) {
      this.formData[name] =
        ("" + value) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, "") // 第二步：把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, "$1") // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, "0.") // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(/^\d*(\.?\d{0,2})/g)[0] || ""; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
    },
    showPbs() {
      this.pbsDialog.show = true;
    },
    pbsSelectedHandle(pbs) {
      console.log("pbs", pbs);
      this.formData.pbsCode = pbs.code;
      this.formData.pbsName = pbs.name;
      // this.pbsName = pbs.name;
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
          this.formData.detailVos = this.tableData;
          const fields = {
            ...this.formData,
          };
          console.log(fields, "传参");
          fields.status = fields.status ? "1" : "0";
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
      const staffType = await getDictItemList("STAFF_TYPE");
      this.staffTypeList = staffType.data;
      const status = await getDictItemList("USABLE");
      this.statusList = status.data;
      const certificateType = await getDictItemList("CERTIFICATE_TYPE");
      this.certificateTypeList = certificateType.data;
    },
    handleFileChange(value) {
      if (value) {
        this.$refs.dataFormRef?.clearValidate("photo");
      }
    },
    addDetailBtn() {
      this.tableData.push({});
    },
    async deleteDetailBtn() {
      await this.$confirm(`确认删除数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
      });
      // 删除选中的数据
      this.multipleSelection.forEach((selectedItem) => {
        const index = this.tableData.indexOf(selectedItem);
        if (index > -1) {
          this.tableData.splice(index, 1);
        }
      });
      // 清空选中的数据
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
