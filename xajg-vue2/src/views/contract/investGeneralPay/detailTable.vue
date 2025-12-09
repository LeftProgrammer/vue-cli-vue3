<template>
  <el-dialog
    v-draggable
    :fullscreen="true"
    :title="title"
    :visible.sync="dialogShow"
    :destroy-on-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="60%"
    @closed="closedHandle"
  >
    <!-- <div style="text-align: right; margin-bottom: 16px">
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
      <el-button type="primary" @click="addDetailBtn()" :disabled="readonly">
        添加
      </el-button>
    </div> -->

    <div style="height: calc(100% - 32px - 16px - 32px - 16px)">
      <el-table
        ref="multipleTable"
        border
        :data="tableData"
        row-key="id"
        style="width: 100%; height: 100%; overflow: auto"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column
          label="清单编号"
          prop="orderNo"
          align="center"
          width="150"
        >
          <!-- <template slot-scope="{ row }">
            <el-input
              v-model="row.orderNo"
              :disabled="readonly"
              placeholder="请输入"
            />
          </template> -->
        </el-table-column>
        <el-table-column
          label="名称"
          prop="name"
          align="center"
          min-width="150"
        >
          <!-- <template slot-scope="{ row }">
            <el-input
              v-model="row.name"
              :disabled="readonly"
              placeholder="请输入"
            />
          </template> -->
        </el-table-column>
        <el-table-column
          v-if="tableType == 'change'"
          label="单位"
          prop="unit"
          align="center"
          min-width="150"
        >
          <!-- <template slot-scope="{ row }">
            <el-input
              v-model="row.unit"
              placeholder="请输入"
              :disabled="readonly"
            />
          </template> -->
        </el-table-column>
        <el-table-column
          v-if="tableType == 'change'"
          label="数量"
          prop="quantity"
          align="center"
          width="150"
        >
          <!-- <template slot-scope="{ row, $index }">
            <el-input-number
              v-model="row.quantity"
              :controls="false"
              style="width: 100%"
              :disabled="readonly"
              :step-strictly="true"
              @change="handleChange($index)"
            />
          </template> -->
        </el-table-column>
        <el-table-column
          v-if="tableType == 'change'"
          label="单价（元）"
          prop="price"
          align="center"
          width="150"
        >
          <!-- <template slot-scope="{ row, $index }">
            <el-input-number
              v-model="row.price"
              style="width: 100%"
              :controls="false"
              :disabled="readonly"
              :min="0"
              @change="handleChange($index)"
            />
          </template> -->
        </el-table-column>
        <el-table-column
          v-if="tableType == 'change'"
          label="合价（元）"
          prop="totalPrice"
          align="center"
          width="150"
        >
          <!-- <template slot-scope="{ row }">
            <el-input v-model="row.totalPrice" disabled />
          </template> -->
        </el-table-column>
        <el-table-column
          v-if="tableType == 'inventory'"
          label="合同价（元）"
          prop="totalPrice"
          align="center"
          width="150"
        >
          <template slot-scope="{ row }">
            <el-input v-model="row.totalPrice" disabled />
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableType == 'inventory'"
          label="上期末累计应结算金额（元）"
          prop="lastPrice"
          align="center"
          width="150"
        >
          <template slot-scope="{ row, $index }">
            <el-input-number
              v-model="row.lastPrice"
              style="width: 100%"
              :controls="false"
              :disabled="readonly"
              :min="0"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableType == 'inventory'"
          label="本期应结算金额（元）"
          prop="thisPrice"
          align="center"
          width="150"
        >
          <template slot-scope="{ row, $index }">
            <el-input-number
              v-model="row.thisPrice"
              style="width: 100%"
              :controls="false"
              :disabled="readonly"
              :min="0"
              @change="handleChange($index)"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableType == 'inventory'"
          label="本期末累计应结算金额（元）"
          prop="endPrice"
          align="center"
          width="150"
        >
          <template slot-scope="{ row, $index }">
            <el-input-number
              v-model="row.endPrice"
              style="width: 100%"
              :controls="false"
              :disabled="readonly"
              :min="0"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="概算编码"
          prop="estimateCode"
          align="center"
          min-width="150"
        >
          <!-- <template slot-scope="{ row }">
            <el-input
              v-model="row.estimateCode"
              :disabled="readonly"
              placeholder="请输入"
            />
          </template> -->
        </el-table-column>
        <!-- <el-table-column label="操作" width="200" align="center">
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
        </el-table-column> -->
      </el-table>
    </div>
    <div
      style="
        text-align: right;
        height: 32px;
        line-height: 32px;
        margin-top: 16px;
        padding-right: 20%;
      "
    >
      {{ tableType == 'inventory' ? '工程量清单项目小计' : '变更小计' }}：{{
        tableTotalMoney
      }}元
    </div>
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
import * as XLSX from 'xlsx'
import moment from 'moment'
import { getContractDetail } from './api'
export default {
  name: 'dataform',
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
  data() {
    return {
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null
      },

      tableData: [],
      uploadFileList: [],
      multipleSelection: [],
      downloadPath: '/static/template/合同清单导入模板.xlsx',
      departList: [],
      tableTotalMoney: 0,
      tableType: ''
    }
  },
  computed: {
    readonly() {
      return this.oprateRow.type == 'view'
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          this.tableType = this.oprateRow.tableType
          if (this.oprateRow.data.length == 0 && this.oprateRow.contractId) {
            getContractDetail({
              type: this.tableType == 'change' ? '2' : '1',
              contractId: this.oprateRow.contractId
            }).then((res) => {
              const data = res.data
              this.tableData = data.filter((x, i) => {
                x.id = x.id || `timestamp${new Date().getTime()}${i}`
                return x
              })
              this.$nextTick(() => {
                for (let i = 0; i < this.tableData.length; i++) {
                  const row = this.tableData[i]
                  this.$refs.multipleTable.toggleRowSelection(row)
                }
                this.calcTotal()
              })
            })
          } else {
            this.tableData = this.oprateRow.data.filter((x, i) => {
              x.id = x.id || `timestamp${new Date().getTime()}${i}`
              return x
            })
            this.$nextTick(() => {
              for (let i = 0; i < this.tableData.length; i++) {
                const row = this.tableData[i]
                this.$refs.multipleTable.toggleRowSelection(row)
              }
              this.calcTotal()
            })
          }
        }
        this.dialogShow = newValue
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.calcTotal()
    },
    /**
     * @description 修改单价金额
     */
    handleChange(index) {
      if (this.tableType == 'change') {
        this.$set(
          this.tableData[index],
          'totalPrice',
          (this.tableData[index].price || 0) *
            (this.tableData[index].quantity || 0)
        )
        this.calcTotal()
      } else {
        this.calcTotal()
      }
    },
    closedHandle() {
      this.dialogShow = false
      this.$emit('closed')
    },
    childEvtHandle() {
      // 做业务数据的保存,修改。
      if (this.type === 'view') {
        this.dialogShow = false
        return
      }
      const data = this.multipleSelection.map((x) => {
        if (x.id.includes('timestamp')) delete x.id
        return x
      })
      this.$emit('ok', data, this.tableType)
      this.closedHandle()
    },
    // 判断清单编号方法-------------------------
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
    },

    contractManagerChange(id, data) {
      this.$set(this.formData, 'contractManagerName', data.realName || '')
    },

    handleFileChange(value) {
      if (value) {
        this.$refs.dataFormRef?.clearValidate('attachment')
      }
    },
    addDetailBtn() {
      const element = { id: `timestamp${new Date().getTime()}` }
      this.tableData.push(element)
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
        quantity: '数量',
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
          jsonData.forEach((item, index) => {
            newArr.push({
              code: item[fieldMap.code],
              orderNo: item[fieldMap.orderNo],
              name: item[fieldMap.name],
              unit: item[fieldMap.unit],
              quantity: item[fieldMap.quantity],
              price: item[fieldMap.price],
              thisPrice: item[fieldMap.totalPrice],
              id: `timestamp${moment().valueOf()}${index}` //唯一标识
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
      this.tableTotalMoney = 0
      const field = this.tableType == 'change' ? 'totalPrice' : 'thisPrice'
      let total = 0
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const item1 = this.multipleSelection[index]
        if (!item1.code) {
          total += Number(item1[field] || 0)
          continue
        }
        let ok = true //检查item1 是否是某个节点的父级
        for (let index1 = 0; index1 < this.multipleSelection.length; index1++) {
          const item2 = this.multipleSelection[index1]
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
          total += item1[field] || 0
        }
      }
      if (isNaN(total)) {
        this.$message.warn('合同总价内容必须是数字且不能为空')
      }
      total = total.toFixed(2)
      this.$set(this.formData, 'amount', total)
      this.tableTotalMoney = this.multipleSelection.reduce(
        (sum, item) => sum + Number(item[field] || 0),
        0
      )
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
