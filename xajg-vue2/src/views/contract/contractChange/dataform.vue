<template>
  <el-dialog
    v-draggable
    :oprateRow="oprateRow"
    :title="title"
    :visible.sync="dialogShow"
    :destroy-on-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :fullscreen="true"
    append-to-body
    @closed="closedHandle"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="baseInfo">
        <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="formDataRules"
          label-width="140px"
          :disabled="readonly"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同名称:">
                <el-select
                  v-model="formData.contractId"
                  clearable
                  filterable
                  placeholder="请选择"
                  style="width: 100%"
                  @change="contractIdChangeHandle"
                  @visible-change="$visibleChange($event, 'el-popper')"
                >
                  <el-option
                    v-for="item in htxxOptions"
                    :key="item.id"
                    :label="item.name + '（' + item.code + '）'"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号:" prop="contractCode">
                <el-input
                  v-model="formData.contractCode"
                  placeholder="请输入"
                  disabled
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="变更编码:" prop="code">
                <el-input
                  v-model="formData.code"
                  placeholder="请输入"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="变更类型:" prop="changeType">
                <el-select
                  v-model="formData.changeType"
                  class="w-100pre"
                  placeholder="请选择"
                  @visible-change="$visibleChange($event, 'el-popper')"
                >
                  <el-option
                    v-for="item in changeTypeList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工程部位:" prop="pbsCode">
                <el-input
                  v-model="formData.pbsCode"
                  placeholder="请输入"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签约日期:" prop="contractedDate">
                <el-date-picker
                  v-model="formData.contractedDate"
                  disabled
                  type="date"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束日期:" prop="endDate">
                <el-date-picker
                  v-model="formData.endDate"
                  type="date"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同类型:" prop="type">
                <el-select
                  v-model="formData.type"
                  class="w-100pre"
                  disabled
                  placeholder="请选择"
                  @visible-change="$visibleChange($event, 'el-popper')"
                >
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
                <el-input
                  v-model="formData.paymentMethod"
                  placeholder="请输入"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同金额:" prop="amount">
                <el-input
                  v-model="formData.amount"
                  placeholder="请输入"
                  disabled
                  maxlength="18"
                  show-word-limit
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="甲方单位:" prop="partyA">
                <el-input
                  v-model="formData.partyA"
                  placeholder="请输入"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="乙方单位:" prop="partyB">
                <el-input
                  v-model="formData.partyB"
                  placeholder="请输入"
                  disabled
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="丙方单位:" prop="partyC">
                <el-input
                  v-model="formData.partyC"
                  placeholder="请输入"
                  disabled
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同内容:" prop="contractDetail">
                <el-input
                  v-model="formData.contractDetail"
                  type="textarea"
                  placeholder="请输入"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="原合同内容:" prop="contractContent">
                <el-input
                  v-model="formData.contractContent"
                  type="textarea"
                  placeholder="请输入"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="变更后合同内容:"
                prop="changeContractContent"
              >
                <el-input
                  v-model="formData.changeContractContent"
                  type="textarea"
                  placeholder="请输入"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="变更缘由:" prop="changeContent">
                <el-input
                  v-model="formData.changeContent"
                  type="textarea"
                  placeholder="请输入"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="变更依据:" prop="changeBasis">
                <el-input
                  v-model="formData.changeBasis"
                  type="textarea"
                  placeholder="请输入"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="变更前金额:" prop="changeBeforeAmount">
                <el-input
                  v-model="formData.changeBeforeAmount"
                  placeholder="请输入"
                  maxlength="18"
                  show-word-limit
                  @change="calcChangeAmount()"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="变更后金额:" prop="changeAfterAmount">
                <el-input
                  v-model="formData.changeAfterAmount"
                  placeholder="请输入"
                  maxlength="18"
                  show-word-limit
                  @change="calcChangeAmount()"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="投资增减:">
                <el-select
                  v-model="formData.investmentImpact"
                  placeholder="请选择投资增减"
                  style="width: 100%"
                >
                  <el-option label="增加" value="increase" />
                  <el-option label="减少" value="decrease" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="变更金额:" prop="changeAmount">
                <el-input
                  v-model="formData.changeAmount"
                  placeholder="请输入"
                  maxlength="18"
                  disabled
                  show-word-limit
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序:" prop="sort">
                <el-input-number
                  v-model="formData.sort"
                  :step="1"
                  style="width: 100%"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="变更附件:" prop="attachment">
                <uploadFile
                  v-model="formData.attachment"
                  :readonly="readonly"
                  :limit="1"
                  :multiline="false"
                  :maxSize="20"
                  @change="handleFileChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="变更清单明细" name="contractDetail">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          "
        >
          <div style="width: 50%; color: #000">变更清单明细</div>
          <div style="width: 50%; text-align: right; height: 100%">
            <el-button
              type="primary"
              :disabled="readonly"
              @click="downloadTemplate()"
            >
              模板下载
            </el-button>
            <el-button
              type="primary"
              :disabled="readonly"
              @click="triggerFileInput()"
            >
              导入清单
            </el-button>
            <el-button
              type="primary"
              :disabled="readonly"
              @click="addDetailBtn()"
            >
              添加
            </el-button>
          </div>
        </div>

        <div style="height: calc(100% - 64px - 30px)">
          <el-table
            ref="multipleTable"
            border
            :data="tableData"
            style="width: 100%; height: 100%; overflow: auto"
          >
            <el-table-column
              label="序号"
              type="index"
              width="80"
              align="center"
            />
            <el-table-column
              label="清单编号"
              prop="orderNo"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.orderNo"
                  :disabled="readonly"
                  placeholder="请输入"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="名称"
              prop="name"
              align="center"
              min-width="150"
            >
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.name"
                  :disabled="readonly"
                  placeholder="请输入"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="单位"
              prop="unit"
              align="center"
              min-width="150"
            >
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.unit"
                  placeholder="请输入"
                  :disabled="readonly"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="数量"
              prop="quantity"
              align="center"
              width="150"
            >
              <template slot-scope="{ row, $index }">
                <el-input-number
                  v-model="row.quantity"
                  :controls="false"
                  style="width: 100%"
                  :disabled="readonly"
                  @change="handleChange($index)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="单价（元）"
              prop="price"
              align="center"
              width="150"
            >
              <template slot-scope="{ row, $index }">
                <el-input-number
                  v-model="row.price"
                  style="width: 100%"
                  :controls="false"
                  :disabled="readonly"
                  :min="0"
                  @change="handleChange($index)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="合价（元）"
              prop="totalPrice"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-input v-model="row.totalPrice" disabled />
              </template>
            </el-table-column>
            <el-table-column
              label="概算编码"
              prop="estimateCode"
              align="center"
              min-width="150"
            >
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.estimateCode"
                  :disabled="readonly"
                  placeholder="请输入"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  :disabled="readonly"
                  @click.native.prevent="
                    deleteDetailBtn(scope.$index, tableData)
                  "
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          style="
            text-align: right;
            height: 32px;
            line-height: 32px;
            margin-top: 15px;
            padding-right: 20%;
          "
        >
          总计：{{ tableTotalMoney }}元
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">
        {{ oprateRow.isView ? '关闭' : '取消' }}
      </el-button>
      <el-button
        v-if="!oprateRow.isView"
        type="primary"
        @click="childEvtHandle"
      >
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
import { save, update } from './api'
import { dateFormat } from '@/utils'
import { FormMixin } from '@/mixins/FormMixin'
import { getDictItemList } from '@/api/dict'
import * as XLSX from 'xlsx'
export default {
  name: 'dataform',
  mixins: [FormMixin],
  data() {
    return {
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },
      pbsName: '',
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null
      },
      formDataRules: {
        changeType: [
          { required: true, message: '请选择变更类型', trigger: 'change' }
        ],
        code: [
          { required: true, message: '变更编码不能为空', trigger: 'blur' }
        ],
        contractContent: [
          { required: true, message: '原合同内容不能为空', trigger: 'blur' }
        ],
        changeContent: [
          { required: true, message: '变更内容不能为空', trigger: 'blur' }
        ],
        changeContractContent: [
          {
            required: true,
            message: '变更后合同内容不能为空',
            trigger: 'blur'
          }
        ],
        changeBeforeAmount: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        changeAfterAmount: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        changeBasis: [
          { required: true, message: '变更依据不能为空', trigger: 'blur' }
        ],
        investmentImpact: [
          { required: true, message: '请选择投资影响', trigger: 'change' }
        ],
        changeAmount: [
          { required: true, message: '变更金额不能为空', trigger: 'blur' }
        ],
        attachment: [
          { required: true, message: '请上传变更附件', trigger: 'change' }
        ],
        constructionLeader: [
          { required: true, message: '分部负责人不能为空', trigger: 'change' }
        ]
      },
      tableData: [],
      statusList: [],
      activeTab: 'baseInfo',
      uploadFileList: [],
      multipleSelection: [],
      downloadPath: '/static/template/合同清单导入模板.xlsx',
      contractTypeList: [],
      paymentMethodList: [],
      changeTypeList: [],
      tableTotalMoney: 0
    }
  },
  created() {
    this.getDictItemList()
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage('userInfo')
    }
  },
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    htxxOptions: {
      type: Array,
      default: []
    },
    oprateRow: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    closedHandle() {
      this.dialogShow = false
      this.$emit('closed')
    },
    childEvtHandle() {
      // 做业务数据的保存,修改。
      this.$refs['dataFormRef'].validate((valid) => {
        if (valid) {
          // view   false  return
          if (this.type === 'view') {
            this.dialogShow = false
            return
          }
          this.formData.detailVos = this.tableData
          const fields = {
            ...this.formData
          }
          // if (
          //   this.tableData.length > 0 &&
          //   this.tableTotalMoney != this.formData.changeAfterAmount
          // ) {
          //   this.$message.info(
          //     `变更后合同金额为:${this.formData.changeAfterAmount},清单明细总价为:${this.tableTotalMoney}；数据不一致，请检查！`
          //   )
          //   return
          // }
          if (this.isLevelOrdered() !== 'ok') {
            this.$message.info(this.isLevelOrdered())
            return
          }
          if (this.type === 'add') {
            save(fields)
              .then((res) => {
                const { success, message } = res
                if (!success) {
                  return this.$message.error('保存失败：' + message)
                } else {
                  this.$emit('ok')
                }
                this.closedHandle()
              })
              .catch((err) => {
                console.error(err)
                this.$message.error('新增失败')
              })
          } else {
            update(fields)
              .then((res) => {
                const { success, message } = res
                if (!success) {
                  return this.$message.error('保存失败：' + message)
                } else {
                  this.$emit('ok')
                }
                this.closedHandle()
              })
              .catch((err) => {
                console.error(err)
                this.$message.error('更新失败')
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    /**获取字典 */
    async getDictItemList() {
      const contractType = await getDictItemList('CONTRACT_TYPE')
      const paymentMethod = await getDictItemList('PAYMENT_METHOD')
      const changeType = await getDictItemList('CHANGE_TYPE')
      this.contractTypeList = contractType.data
      this.paymentMethodList = paymentMethod.data
      this.changeTypeList = changeType.data
    },
    /**
     * @description 变更附件文件上传
     * @param value
     */
    handleFileChange(value) {
      if (value) {
        this.$refs.dataFormRef?.clearValidate('attachment')
      }
    },

    /**
     * @description 合同切换
     * @param val
     */
    contractIdChangeHandle(val) {
      if (val) {
        let contract = this.htxxOptions.find((x) => x.id === val)
        if (contract) {
          this.tableData = contract.detailVos || []
          this.tableTotalMoney = this.tableData.reduce(
            (sum, item) => sum + Number(item.totalPrice || 0),
            0
          )
          this.$set(this.formData, 'contractCode', contract.code)
          this.$set(this.formData, 'type', contract.type)
          this.$set(this.formData, 'paymentMethod', contract.paymentMethod)
          this.$set(this.formData, 'contractedDate', contract.contractedDate)
          this.$set(this.formData, 'amount', contract.amount)
          this.$set(this.formData, 'partA', contract.partA)
          this.$set(this.formData, 'partyB', contract.partyB)
          this.$set(this.formData, 'partyC', contract.partyC)
        }
      }
    },
    /**
     * @description 计算合同变更金额
     */
    calcChangeAmount() {
      this.$set(
        this.formData,
        'changeAmount',
        this.formData.changeAfterAmount - this.formData.changeBeforeAmount
      )
    },
    /**
     * @description 下载清单导入模版
     */
    downloadTemplate() {
      let fileName = '合同清单导入模板.xlsx'
      var link = document.createElement('a')
      link.href = this.downloadPath
      link.download = fileName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    /**
     * @description 触发导入清单文件上传
     */
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
        totalPrice: '合价(元)'
      }

      reader.onload = (e) => {
        let that = this
        const data = new Uint8Array(e.target.result)
        console.log(XLSX)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet) //加上{header:1}会把第一行作为表头
        console.log('表格原始数据', jsonData)
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
              totalPrice: item[fieldMap.totalPrice]
            })
          })
        console.log('表格处理后的数据', newArr)
        let dataToAdd = []
        for (let index = 0; index < newArr.length; index++) {
          const element = newArr[index]
          let targetIndex = this.tableData.findIndex(
            (i) => i.code === element.code
          )
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
        console.log('表格数据', that.tableData)
        that.calcTotal()
        console.log('合同总价', that.formData.amount)
        that.$refs.fileInput.value = '' // 清空input方便下次继续上传
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
          if (
            item2.code.toString().indexOf(item1.code.toString() + '.') === 0
          ) {
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
      this.$set(this.formData, 'amount', total)
      this.tableTotalMoney = this.tableData.reduce(
        (sum, item) => sum + Number(item.totalPrice || 0),
        0
      )
    },
    /**
     * @description 添加清单明细
     */
    addDetailBtn() {
      this.tableData.push({})
    },
    /**
     * @description 删除清单明细
     * @param index
     * @param row
     */
    async deleteDetailBtn(index, row) {
      await this.$confirm(`确认删除数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
      // 删除选中的数据
      this.tableData.splice(index, 1)
    },
    /**
     * @description 计算清单单项总价
     */
    handleChange(index) {
      this.$set(
        this.tableData[index],
        'totalPrice',
        (this.tableData[index].price || 0) *
          (this.tableData[index].quantity || 0)
      )
      this.tableTotalMoney = this.tableData.reduce(
        (sum, item) => sum + Number(item.totalPrice || 0),
        0
      )
    },

    /**
     * @description 判断清单编号方法
     */
    isLevelOrdered() {
      const list = this.tableData
      const seen = new Set() // 已出现的 level
      const nextNo = new Map() // Map<parent, expectedChildNo>

      for (let i = 0; i < list.length; i++) {
        const lv = String(list[i].orderNo)
        const parts = lv.split('.').map(Number)

        /* 1. 整体顺序检查 */
        if (i && compare(lv, list[i - 1].orderNo) <= 0)
          return '清单编号整体顺序错误'

        /* 2. 父级必须已出现（根节点除外） */
        const parent = parts.slice(0, -1).join('.')
        if (parts.length > 1 && !seen.has(parent)) return '清单编号父级节点缺失'

        /* 3. 子序号必须连续 */
        const key = parent || 'root' // 根节点用 'root' 统一
        const exp = nextNo.get(key) || 1 // 期望序号
        const cur = parts.at(-1)
        if (cur !== exp) return '清单编号子节点序号必须连续'

        /* 4. 更新状态 */
        seen.add(lv)
        nextNo.set(key, exp + 1)
      }
      return 'ok'
      /* 自然比较：点分数字 */
      function compare(a, b) {
        const pa = a.split('.').map(Number)
        const pb = b.split('.').map(Number)
        const len = Math.max(pa.length, pb.length)
        for (let i = 0; i < len; i++) {
          const na = pa[i] ?? 0
          const nb = pb[i] ?? 0
          if (na !== nb) return na - nb
        }
        return 0
      }
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          const newData = { ...this.oprateRow.data }
          this.formData = newData
          // 检查并赋值
          if (this.formData.contractId) {
            this.contractIdChangeHandle(this.formData.contractId)
          }
          if (newData.detailVos) {
            this.tableData = newData.detailVos
            this.tableTotalMoney = this.tableData.reduce(
              (sum, item) => sum + Number(item.totalPrice || 0),
              0
            )
          }
        }
        this.dialogShow = newValue
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-tabs) {
  height: 100%;
  .el-tabs__content {
    height: calc(100% - 55px);

    .el-tab-pane {
      height: 100%;
      overflow: auto;
      .el-table {
        .el-table__body-wrapper {
          height: calc(100% - 48px);
          overflow-y: auto;
        }
      }
    }
  }
}
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
