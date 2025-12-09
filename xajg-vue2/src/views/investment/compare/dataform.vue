<template>
  <el-dialog
    :title="title"
    custom-class="wbench-el-dialog"
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同名称:" prop="name">
              <el-input  v-model="formData.name" placeholder="请输入"
                         :disabled="readonly" maxlength="50" show-word-limit
                        style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号:" prop="code">
              <el-input  v-model="formData.code" placeholder="请输入"
                        :disabled="readonly" maxlength="50" show-word-limit
                        style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程部位:" prop="pbsCode">
              <pbsSelect v-model="formData.pbsCode" :readonly="readonly"></pbsSelect>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签约日期:" prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                type="datetime"
                format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期:" prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="datetime"
                format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同类型:" prop="type">
              <el-select class="w-100pre" @visible-change="$visibleChange($event, 'el-popper')" v-model="formData.type" placeholder="请选择">
                <el-option
                  v-for="item in contractTypeList"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付方式:" prop="paymentMethod">
              <el-select class="w-100pre" @visible-change="$visibleChange($event, 'el-popper')" v-model="formData.paymentMethod" placeholder="请选择">
                <el-option
                  v-for="item in paymentMethodList"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同金额:" prop="amount">
              <el-input  v-model="formData.amount" placeholder="请输入" :disabled="readonly" maxlength="18" show-word-limit>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同内容:" prop="contentText">
              <el-input type="textarea" v-model="formData.contentText" placeholder="请输入"
                        :autosize="{ minRows: 3, maxRows: 6 }" :disabled="readonly" maxlength="500" show-word-limit
                        style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="甲方单位:" prop="partA">
              <el-input  v-model="formData.partA" placeholder="请输入" :disabled="readonly" maxlength="50" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="乙方单位:" prop="partB">
              <el-input  v-model="formData.partB" placeholder="请输入" :disabled="readonly" maxlength="50" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="丙方单位:" prop="partC">
              <el-input  v-model="formData.partC" placeholder="请输入" :disabled="readonly" maxlength="50" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同附件:" prop="attachment">
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
          <el-col :span="12">
            <el-form-item label="分部经办人" prop="personInCharge ">
              <user
                v-model="formData.personInCharge"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分部负责人" prop="constructionLeader">
              <user
                v-model="formData.constructionLeader"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填写部门" prop="unitName">
              <el-input v-model="formData.unitName"  disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填写日期" prop="initiationDate">
              <el-date-picker
                v-model="formData.initiationDate"
                disabled
                type="date"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
          <div style="width: 50%; color: #000">合同清单明细</div>
          <div style="width: 50%; text-align: right">
            <el-button type="primary" icon="el-icon-download" @click="downloadTemplate()" :disabled="readonly">
              模板下载
            </el-button>
            <el-button type="primary" icon="el-icon-import" @click="triggerFileInput()" :disabled="readonly">
              导入清单
            </el-button>
            <el-button type="primary" icon="el-icon-plus" @click="addDetailBtn()" :disabled="readonly">
              添加
            </el-button>
          </div>
        </el-row>
        <el-divider></el-divider>

        <el-row class="table">
          <el-table ref="multipleTable" border :data="tableData" style="max-height: 50vh; overflow: auto"
                    @selection-change="handleSelectionChange">
            <el-table-column label="序号" type="index" width="80" align="center" />
            <el-table-column label="系统编码" prop="code" align="center"
                             width="150">
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.code" placeholder="请输入"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="清单编号" prop="orderNo" align="center"
                             width="150">
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.orderNo" placeholder="请输入"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="name" align="center"
                             width="150">
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.name" placeholder="请输入"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="unit" align="center"
                             width="150">
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.unit" placeholder="请输入"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="quantity" align="center"
                             width="150">
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.quantity" placeholder="请输入"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="单价（元）" prop="price" align="center"
                             width="150">
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.price" placeholder="请输入"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="合价（元）" prop="totalPrice" align="center"
                             width="150">
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.totalPrice" placeholder="请输入"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteDetailBtn(scope.$index, tableData)"
                  type="text"
                  size="small"
                  :disabled="readonly"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer" v-if="type != 'view'">
      <el-button  type="primary" @click="childEvtHandle">
        确 定
      </el-button>
    </div>
    <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />
  </el-dialog>
</template>

<script>
import { save, update, BelongTo } from "./api";
import { dateFormat } from "@/utils";
import { FormMixin } from "@/mixins/FormMixin";
import { getDictItemList } from "@/api/dict";
import Staff from "@/components/Staff";
import * as XLSX from 'xlsx'
export default {
  name: "dataform",
  mixins: [FormMixin],
  components:{Staff},
  data() {
    return {
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },
      pbsName: "",
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null
      },

      formDataRules: {
        name: [
          { required: true, message: '请输入合同名称', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入合同编号', trigger: 'blur' },
        ],
        pbsCode: [
          { required: true, message: '请选择工程部位', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择签约日期', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择合同类型', trigger: 'change' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入合同金额', trigger: 'blur' },
        ],
        partA: [
          { required: true, message: '请输入甲方单位', trigger: 'blur' },
        ],
        partB: [
          { required: true, message: '请输入乙方单位', trigger: 'blur' },
        ],
        attachment: [
          { required: true, message: '请上传合同附件', trigger: 'change' }
        ],
        constructionLeader: [
          { required: true, message: '请选择分部负责人', trigger: 'change' }
        ],
      },
      tableData: [],
      statusList: [],
      uploadFileList: [],
      multipleSelection: [],
      contractTypeList: [],
      paymentMethodList: [],
      downloadPath:"/static/template/合同清单导入模板.xlsx",
    };
  },
  created() {
    this.getDictItemList()
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    },
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
    }
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
          this.formData.detailVos = this.tableData
          const fields = {
            ...this.formData
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
    /**获取字典 */
    async getDictItemList() {
      const contractType = await getDictItemList("CONTRACT_TYPE");
      const paymentMethod = await getDictItemList("PAYMENT_METHOD");
      this.contractTypeList = contractType.data;
      this.paymentMethodList = paymentMethod.data;
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
    async deleteDetailBtn(index,row) {
      await this.$confirm(`确认删除数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
      });
      // 删除选中的数据
      this.tableData.splice(index, 1);
    },
    downloadTemplate(){
      console.log("下载模板")
      let fileName = '合同清单导入模板.xlsx'
      var link = document.createElement('a')
      link.href = this.downloadPath
      link.download = fileName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    triggerFileInput() {
      this.$nextTick(() => {
        this.$refs.fileInput.click()
      })
    },
    handleFileUpload(event) {
      console.log('开始读取文件')
      const files = event.target.files
      console.log(files.length)
      if (files.length === 0) return
      const file = files[0]
      const reader = new FileReader()
      const fieldMap = {
        code: '系统编码',
        orderNo: '清单编号',
        name: '名称',
        unit: '单位',
        quantity: '工程量',
        price: '单价(元)',
        totalPrice: '合价(元)',
      }

      reader.onload = (e) => {
        let that = this
        const data = new Uint8Array(e.target.result)
        console.log(XLSX)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet) //加上{header:1}会把第一行作为表头
        let newArr = []
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
          })
        })
        let dataToAdd = []
        for (let index = 0; index < newArr.length; index++) {
          const element = newArr[index]
          let targetIndex = this.tableData.findIndex((i) => i.code === element.code)
          if (targetIndex > -1) {
            // 更新
            Object.assign(this.tableData[targetIndex], element)
          } else {
            // 增加
            dataToAdd.push(element)
          }
        }
        if (dataToAdd.length > 0) {
          that.tableData = that.tableData.concat(dataToAdd)
        }
        this.calcTotal()
        this.$refs.fileInput.value = '' // 清空input方便下次继续上传
      }
      reader.readAsArrayBuffer(file)
    },
    calcTotal() {
      //统计末端节点的金额
      let total = 0
      for (let index = 0; index < this.tableData.length; index++) {
        const item1 = this.tableData[index]
        if (!item1.code) {
          total += item1.totalPrice
          continue
        }
        let ok = true //检查item1 是否是某个节点的父级
        for (let index1 = 0; index1 < this.tableData.length; index1++) {
          const item2 = this.tableData[index1]
          if (!item2.code) continue
          if (item2.code.toString().indexOf(item1.code.toString() + '.') === 0) {
            ok = false
            break
          }
        }
        if (ok) {
          //ok 表示item1是叶子结点
          total += item1.totalPrice
        }
      }
      if (isNaN(total)) {
        this.$message.warn('合同总价内容必须是数字且不能为空')
      }
      total = total.toFixed(2)
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
          if (newData.detailVos){
            this.tableData = newData.detailVos
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
