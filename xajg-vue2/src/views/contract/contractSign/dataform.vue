<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogShow"
    :destroy-on-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :oprateRow="oprateRow"
    append-to-body
    width="50%"
    v-draggable
    @closed="closedHandle"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="baseInfo">
        <div class="tab-content">
          <el-row>
            <el-form
              ref="dataFormRef"
              :model="formData"
              :rules="formDataRules"
              label-width="100px"
              :disabled="readonly"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="合同名称:" prop="name">
                    <el-input
                      v-model="formData.name"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                      style="width: 100%"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同编号:" prop="code">
                    <el-input
                      v-model="formData.code"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                      style="width: 100%"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同金额:" prop="amount">
                    <el-input
                      v-model="formData.amount"
                      placeholder="请输入"
                      :disabled="true"
                      maxlength="18"
                      show-word-limit
                    >
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="税率:" prop="taxationRate">
                    <el-input
                      v-model="formData.taxationRate"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="18"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="签约单位:" prop="contractedUnit">
                    <el-input
                      v-model="formData.contractedUnit"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="签约日期:" prop="contractedDate">
                    <el-date-picker
                      v-model="formData.contractedDate"
                      type="date"
                      format="yyyy-MM-dd"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同类型:" prop="type">
                    <el-select
                      class="w-100pre"
                      @visible-change="$visibleChange($event, 'el-popper')"
                      v-model="formData.type"
                      placeholder="请选择"
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
                  <el-form-item label="合同期限:" prop="deadline">
                    <el-input
                      v-model="formData.deadline"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="采购方式:" prop="procurementMode">
                    <el-select
                      class="w-100pre"
                      @visible-change="$visibleChange($event, 'el-popper')"
                      v-model="formData.procurementMode"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in procurementMethodList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="签约人:" prop="parties">
                    <el-input
                      v-model="formData.parties"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="项目经理/总监理工程师:"
                    prop="projectManagement"
                  >
                    <el-input
                      v-model="formData.projectManagement"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开户行:" prop="openingBank">
                    <el-input
                      v-model="formData.openingBank"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="银行账号:" prop="cardNumber">
                    <el-input
                      v-model="formData.cardNumber"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="税号:" prop="taxationNumber">
                    <el-input
                      v-model="formData.taxationNumber"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="丙方单位 （如有）:" prop="partyC">
                    <el-input
                      v-model="formData.partyC"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="丙方开户行:" prop="partyCOpeningBank">
                    <el-input
                      v-model="formData.partyCOpeningBank"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="丙方银行账号:" prop="partyCCardNumber">
                    <el-input
                      v-model="formData.partyCCardNumber"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="丙方税号:" prop="partyCTaxationNumber">
                    <el-input
                      v-model="formData.partyCTaxationNumber"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="履约责任处室:" prop="responsibleParty">
                    <el-select
                      class="w-100pre"
                      @visible-change="$visibleChange($event, 'el-popper')"
                      v-model="formData.responsibleParty"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in departList"
                        :key="item.departId"
                        :label="item.departName"
                        :value="item.departId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同负责人:" prop="contractManager">
                    <user
                      v-model="formData.contractManager"
                      :readonly="readonly"
                    />
                    <!-- <el-input
                      v-model="formData.contractManager"
                      placeholder="请输入"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    >
                    </el-input> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同状态:" prop="status">
                    <el-select
                      class="w-100pre"
                      @visible-change="$visibleChange($event, 'el-popper')"
                      v-model="formData.status"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in contractStatusList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开始日期:" prop="startDate">
                    <el-date-picker
                      v-model="formData.startDate"
                      type="date"
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
                      type="date"
                      format="yyyy-MM-dd"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
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
                <el-col :span="24">
                  <el-form-item label="备注:" prop="contentText">
                    <el-input
                      type="textarea"
                      v-model="formData.contentText"
                      placeholder="请输入"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                      :disabled="readonly"
                      maxlength="500"
                      show-word-limit
                      style="width: 100%"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="填写单位" prop="unitName">
                    <el-input v-model="formData.unitName" disabled />
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
            </el-form>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合同清单明细" name="contractDetail">
        <div class="tab-content">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            "
          >
            <div style="width: 50%; color: #000">合同清单明细</div>
            <div style="width: 50%; text-align: right; height: 100%">
              <el-button
                type="primary"
                @click="downloadTemplate()"
                :disabled="readonly"
              >
                模板下载
              </el-button>
              <el-button
                type="primary"
                @click="triggerFileInput()"
                :disabled="readonly"
              >
                导入清单
              </el-button>
              <el-button
                type="primary"
                @click="addDetailBtn()"
                :disabled="readonly"
              >
                添加
              </el-button>
            </div>
          </div>

          <div style="flex: 1; height: 92%">
            <el-form :rules="tableRules" style="height: 100%">
              <el-table
                ref="multipleTable"
                border
                :data="tableData"
                style="width: 100%; height: 100%; overflow: auto"
                @selection-change="handleSelectionChange"
                :height="tableBodyHeight"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  width="80"
                  align="center"
                />
                <el-table-column
                  label="系统编码"
                  prop="code"
                  align="center"
                  width="150"
                >
                  <template slot-scope="{ row }">
                    <el-form-item>
                      <el-input v-model="row.code" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="清单编号"
                  prop="orderNo"
                  align="center"
                  width="150"
                >
                  <template slot-scope="{ row }">
                    <el-form-item>
                      <el-input v-model="row.orderNo" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="名称"
                  prop="name"
                  align="center"
                  width="150"
                >
                  <template slot-scope="{ row }">
                    <el-form-item>
                      <el-input v-model="row.name" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="单位"
                  prop="unit"
                  align="center"
                  width="150"
                >
                  <template slot-scope="{ row }">
                    <el-form-item>
                      <el-input v-model="row.unit" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="数量"
                  prop="quantity"
                  align="center"
                  width="150"
                >
                  <template slot-scope="{ row, $index }">
                    <el-form-item>
                      <el-input-number
                        v-model="row.quantity"
                        :controls="false"
                        style="width: 100%"
                        :min="0"
                        @change="handleChange($index)"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="单价（元）"
                  prop="price"
                  align="center"
                  width="150"
                >
                  <template slot-scope="{ row, $index }">
                    <el-form-item>
                      <el-input-number
                        v-model="row.price"
                        style="width: 100%"
                        :controls="false"
                        :min="0"
                        @change="handleChange($index)"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="合价（元）"
                  prop="totalPrice"
                  align="center"
                  width="150"
                >
                  <template slot-scope="{ row }">
                    <el-form-item>
                      <el-input v-model="row.totalPrice" disabled />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="
                        deleteDetailBtn(scope.$index, tableData)
                      "
                      type="text"
                      size="small"
                      :disabled="readonly"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">
        {{ oprateRow.isView ? '关闭' : '取消' }}
      </el-button>
      <el-button
        type="primary"
        @click="childEvtHandle"
        v-if="!oprateRow.isView"
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
import { save, update, BelongTo, getDepartList } from './api'
import { dateFormat } from '@/utils'
import { FormMixin } from '@/mixins/FormMixin'
import { getDictItemList } from '@/api/dict'
import Staff from '@/components/Staff'
import store from '@/store'
import * as XLSX from 'xlsx'
export default {
  name: 'dataform',
  mixins: [FormMixin],
  components: { Staff },
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
      tableRules: {
        code: [{ required: true, message: '请输入系统编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        price: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        totalPrice: [{ required: true, message: '请输入合价', trigger: 'blur' }]
        // code: "系统编码",
        // orderNo: "清单编号",
        // name: "名称",
        // unit: "单位",
        // quantity: "工程量",
        // price: "单价(元)",
        // totalPrice: "合价(元)",
      },
      formDataRules: {
        name: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        contractedDate: [
          { required: true, message: '请选择签约日期', trigger: 'change' }
        ],
        taxationRate: [
          { required: true, message: '请输入税率', trigger: 'change' }
        ],
        deadline: [
          { required: true, message: '请输入合同期限', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择合同类型', trigger: 'change' }
        ],
        procurementMode: [
          { required: true, message: '请选择采购方式', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入合同金额', trigger: 'blur' }
        ],
        contractedUnit: [
          { required: true, message: '请输入签约单位', trigger: 'blur' }
        ],
        attachment: [
          { required: true, message: '请上传合同附件', trigger: 'change' }
        ]
      },
      tableData: [],
      statusList: [],
      uploadFileList: [],
      multipleSelection: [],
      contractTypeList: [],
      procurementMethodList: [],
      contractStatusList: [],
      downloadPath: '/static/template/合同清单导入模板.xlsx',
      activeTab: 'baseInfo',
      tableBodyHeight: '0px',
      corpId: store.getters.loginInfo.corpId,
      departList: []
    }
  },
  created() {
    this.getDictItemList()
    this.getDepartList()
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
    oprateRow: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    async getDepartList() {
      try {
        const { success, message, data } = await getDepartList(this.corpId)
        if (!success) {
          return this.$message.error('获取部门列表失败：' + message)
        }
        this.departList = data
        console.log('departListdepartList', this.departList)
        if (data.length === 0) return
      } catch (error) {
        this.$message.error('获取部门列表失败')
      }
    },

    /**
     * @description 修改单价金额
     */
    handleChange(index) {
      this.$set(
        this.tableData[index],
        'totalPrice',
        (this.tableData[index].price || 0) *
          (this.tableData[index].quantity || 0)
      )
      this.$set(
        this.formData,
        'amount',
        this.tableData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.totalPrice,
          0
        )
      )
    },
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
          console.log(fields, '传参')
          if (this.type === 'add') {
            save(fields)
              .then((res) => {
                const { success, message } = res
                if (!success) {
                  return this.$message.error('保存数据失败：' + message)
                } else {
                  this.$message.success('保存数据成功')
                  this.$emit('ok')
                }
                this.closedHandle()
              })
              .catch((err) => {
                console.error(err)
                this.$message.error(err.message)
              })
          } else {
            update(fields)
              .then((res) => {
                const { success, message } = res
                if (!success) {
                  return this.$message.error('更新数据失败：' + message)
                } else {
                  this.$message.success('更新数据成功')
                  this.$emit('ok')
                }
                this.closedHandle()
              })
              .catch((err) => {
                console.error(err)
                this.$message.error(err.message)
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    timeFormat(time, type) {
      return dateFormat(time, type || 'YYYY-MM-DD HH:mm:ss')
    },
    /**获取字典 */
    async getDictItemList() {
      const contractType = await getDictItemList('CONTRACT_TYPE')
      const procurementMethod = await getDictItemList('procurement_method')
      const contractStatus = await getDictItemList('contract_status')
      this.contractTypeList = contractType.data
      this.procurementMethodList = procurementMethod.data
      this.contractStatusList = contractStatus.data
    },
    handleFileChange(value) {
      if (value) {
        this.$refs.dataFormRef?.clearValidate('attachment')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addDetailBtn() {
      this.tableData.push({})
    },
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
    downloadTemplate() {
      console.log('下载模板')
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
    },
    calculateTableHeight() {
      this.$nextTick(() => {
        // 获取tab-content元素
        const tabContent = document.querySelector('.table-tab-content')
        if (tabContent) {
          // 获取表头高度
          const tableHeader = tabContent.querySelector(
            '.el-table__header-wrapper'
          )
          const headerHeight = tableHeader ? tableHeader.offsetHeight : 40

          // 获取表格上方工具栏高度
          const toolbarDiv = tabContent.querySelector(
            '.table-tab-content > div:first-child'
          )
          const toolbarHeight = toolbarDiv ? toolbarDiv.offsetHeight : 60

          // 设置表格body高度
          this.tableBodyHeight = `calc(55vh - ${
            headerHeight + toolbarHeight
          }px)`
        }
      })
    }
  },
  mounted() {
    this.calculateTableHeight()
    window.addEventListener('resize', this.calculateTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateTableHeight)
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log('visible', newValue)
        if (newValue) {
          const newData = { ...this.oprateRow.data }
          this.formData = newData
          // 检查并赋值
          if (!this.formData.personInCharge) {
            this.$set(this.formData, 'personInCharge', this.userInfo.userId)
          }
          if (!this.formData.unitName) {
            this.$set(this.formData, 'unitName', this.userInfo.corpName)
          }
          if (!this.formData.initiationDate) {
            this.$set(this.formData, 'initiationDate', new Date())
          }
          if (newData.detailVos) {
            this.tableData = newData.detailVos
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
      .tab-content {
        height: 100%;
      }
    }
  }
}
.tab-content {
  height: 55vh; /* 增加标签页高度 */
  overflow: hidden;
}
.table-tab-content {
  padding: 0;
  display: flex;
  flex-direction: column;
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

/deep/ .el-table__body-wrapper {
  overflow-y: auto;
}

.el-form {
  height: 100%;
}
.el-form .el-form-item {
  margin-bottom: 0;
}
</style>
