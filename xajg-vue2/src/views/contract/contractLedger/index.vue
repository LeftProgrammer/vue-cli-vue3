<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      :default-open-search="false"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="getTableData"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="合同名称:">
            <el-input v-model="query.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="合同编号:">
            <el-input v-model="query.code" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="合同类型:">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              v-model="query.type"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in contractTypeList"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="签约日期:" size="mini">
            <el-date-picker
              v-model="startDateAndEndDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              class="w-100pre"
            />
          </el-form-item>
          <el-form-item label="合同状态:">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              v-model="query.status"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="采购方式:">
            <el-select
              v-model="query.procurementMode"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in procurementMethodList"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="签约单位:">
            <el-input v-model="query.contractedUnit" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="履约责任处:">
            <el-select
              v-model="query.responsibleParty"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in departList"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="金额范围:">
            <el-select v-model="query.amountType" placeholder="请选择">
              <el-option label="绝对值" value="1" />
              <el-option label="自然数" value="2" />
            </el-select>
            <el-input v-model="query.amount1" placeholder="请输入">
              <template slot="append">以上</template>
            </el-input>
            <el-select v-model="query.symbol" placeholder="请选择">
              <el-option label="且" value="1" />
              <el-option label="或" value="2" />
            </el-select>
            <el-input v-model="query.amount2" placeholder="请输入">
              <template slot="append">以下</template>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button icon="el-icon-plus" type="primary" @click="addHandle()">
          新增
        </el-button>
        <el-popover
          placement="bottom"
          width="210"
          trigger="click"
          popper-class="popover-tableCol"
        >
          <div class="all">
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
              全选
            </el-checkbox>
          </div>
          <draggable
            v-model="tableColumnList"
            class="checkboxList"
            :options="{ group: 'items' }"
          >
            <div v-for="(item, index) in tableColumnList" :key="index">
              <el-checkbox
                v-model="item.checked"
                :name="item.value"
                :label="item.name"
                @change="(val) => handleCheckedChange(item, val)"
              />
            </div>
          </draggable>
          <el-button slot="reference" style="margin: 0 10px">
            显示字段
          </el-button>
        </el-popover>
        <el-button @click="exportFile()">
          <svg-icon icon-class="export" class="icon" />导出选中
        </el-button>
      </template>
      <template slot="table">
        <el-table
          v-if="!tableLoading"
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            fixed="left"
            align="center"
          />
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            width="54"
            align="center"
            fixed="left"
          />
          <el-table-column
            v-for="(item, index) in tableColumnList.filter((x) => x.checked)"
            :key="index"
            :label="item.name"
            :prop="item.value"
            sortable
            :align="item.align"
            :min-width="item.minWidth || '180'"
          >
            <!-- :min-width="item.minWidth" -->
            <template slot-scope="{ row }">
              <el-link
                v-if="item.slot == 'name'"
                type="primary"
                @click="view(row)"
              >
                {{ row.name }}
              </el-link>
              <span v-else-if="item.slot == 'contractedDateStr'">
                {{
                  row.contractedDate
                    ? timeFormat(row.contractedDate, 'YYYY-MM-DD')
                    : ''
                }}
              </span>
              <span v-else-if="item.slot == 'startDateStr'">
                {{
                  row.startDate ? timeFormat(row.startDate, 'YYYY-MM-DD') : ''
                }}
              </span>
              <span v-else-if="item.slot == 'endDateStr'">
                {{ row.endDate ? timeFormat(row.endDate, 'YYYY-MM-DD') : '' }}
              </span>
              <span v-else-if="item.slot == 'actualStartDateStr'">
                {{
                  row.actualStartDate
                    ? timeFormat(row.actualStartDate, 'YYYY-MM-DD')
                    : ''
                }}
              </span>
              <span v-else-if="item.slot == 'actualEndDateStr'">
                {{
                  row.actualEndDate
                    ? timeFormat(row.actualEndDate, 'YYYY-MM-DD')
                    : ''
                }}
              </span>
              <span v-else-if="item.slot == 'isChangeStr'">
                {{ row.isChange == 1 ? '是' : '否' }}
              </span>
              <span v-else-if="item.slot == 'initiationDateStr'">
                {{
                  row.initiationDate
                    ? timeFormat(row.initiationDate, 'YYYY-MM-DD')
                    : ''
                }}
              </span>
              <span v-else-if="item.slot == 'type'">
                {{ $DictionaryParsing(contractTypeList, row.type) }}
              </span>
              <span v-else-if="item.slot == 'pricingMethod'">
                {{ $DictionaryParsing(pricingMethodList, row.pricingMethod) }}
              </span>
              <span v-else-if="item.slot == 'procurementMode'">
                {{
                  $DictionaryParsing(procurementMethodList, row.procurementMode)
                }}
              </span>
              <span v-else-if="item.slot == 'responsibleParty'">
                {{ $DictionaryParsing(departList, row.responsibleParty) }}
              </span>
              <span v-else-if="item.slot == 'status'">
                {{ $DictionaryParsing(contractStatusList, row.status) }}
              </span>
              <div
                v-else-if="item.slot == 'attachment'"
                v-for="item1 in row.attachment
                  ? JSON.parse(row.attachment)
                  : []"
                :key="item1.url"
              >
                {{ item1.name }}
              </div>
              <span v-else>
                {{ row[item.value] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            prop="name"
            width="180"
            align="center"
          >
            <template #default="{ row }">
              <list-button
                :data="row"
                @delete="deleteHandle"
                @edit="edit"
                @redeploy="redeploy"
                :btns="[
                  {
                    title: '编辑',
                    method: 'edit',
                    disabled: row.editUser != userId
                  },
                  { title: '删除', method: 'delete' },
                  {
                    title: '转派',
                    method: 'redeploy',
                    disabled: userId != '1'
                  }
                ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <dataform
      :type="type"
      :title="title"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :oprateRow="oprateRow"
      :readonly="oprateRow.isView"
      @closed="closedDialog"
      @ok="getTableData"
    >
    </dataform>
    <el-dialog title="转派" :visible.sync="redeployData.visible" width="30%">
      <el-form
        ref="redeployForm"
        :rules="{
          editUser: [{ required: true, message: '请选择用户', trigger: 'blur' }]
        }"
        :model="redeployData"
      >
        <el-form-item label="用户" prop="editUser">
          <user v-model="redeployData.editUser" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="redeployData.visible = false">取 消</el-button>
        <el-button type="primary" @click="redeployOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { remove, page, update } from './api'
import { dateFormat } from '@/utils'
import { ListMixin } from '@/mixins/ListMixin'
import TableLayout from '@/components/ContentLayout/Table'
import ListButton from '@/components/ListButton'
import dataform from './dataform'
import { getDictItemList } from '@/api/dict'
import draggable from 'vuedraggable'
export default {
  name: 'contractSign',
  mixins: [ListMixin],
  components: {
    TableLayout,
    ListButton,
    dataform,
    draggable
  },
  data() {
    return {
      startDateAndEndDate: [],
      type: '',
      title: '',
      DitSpeciality: [],
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0
      },
      oprateRow: {},
      options: [],
      tableData: [],
      query: {
        params: {}
      },
      dictList: [],
      readonly: false,
      deptShow: false,
      url: { list: '' },
      userId: '',
      contractTypeList: [],
      statusList: [],
      pricingMethodList: [],
      procurementMethodList: [],
      procurementModeList: [],
      departList: [],
      contractStatusList: [],
      multipleSelection: [],
      isIndeterminate: false,
      tableColumnList: [
        {
          name: '合同名称',
          value: 'name',
          checked: true,
          align: 'left',
          width: '180',
          slot: 'name',
          minWidth: '180'
        },
        { name: '合同编号', value: 'code', checked: true, align: 'left' },
        { name: '合同金额', value: 'amount', checked: true, align: 'left' },
        { name: '税率', value: 'taxationRate', checked: true, align: 'left' },
        {
          name: '签约单位',
          value: 'contractedUnit',
          checked: true,
          align: 'left'
        },
        {
          name: '签约日期',
          value: 'contractedDateStr',
          slot: 'contractedDateStr',
          checked: true
        },
        { name: '合同类型', value: 'type', checked: true, slot: 'type' },
        {
          name: '计价方式',
          value: 'pricingMethod',
          checked: true,
          slot: 'pricingMethod'
        },
        { name: '合同期限', value: 'deadline', checked: true, align: 'left' },
        {
          name: '采购方式',
          value: 'procurementMode',
          checked: true,
          slot: 'procurementMode'
        },
        {
          name: '支付方式',
          value: 'paymentMethod',
          checked: true,
          slot: 'paymentMethod',
          align: 'left'
        },
        { name: '甲方签约人', value: 'parties', checked: true, align: 'left' },
        {
          name: '乙方签约人',
          value: 'secondParties',
          checked: true,
          align: 'left'
        },
        {
          name: '其他签约人',
          value: 'otherParties',
          checked: true,
          align: 'left'
        },
        {
          name: '投标时项目负责人',
          value: 'projectManagement',
          checked: true,
          align: 'left'
        },
        {
          name: '是否变更',
          value: 'isChangeStr',
          slot: 'isChangeStr',
          checked: true
        },
        {
          name: '变更内容',
          value: 'changeDetail',
          checked: true,
          align: 'left'
        },
        { name: '乙方单位', value: 'partyB', checked: true, align: 'left' },
        {
          name: '乙方单位账号名称',
          value: 'partyBName',
          checked: true,
          align: 'left'
        },
        {
          name: '乙方税号',
          value: 'partyBTaxationNumber',
          checked: true,
          align: 'left'
        },
        {
          name: '乙方单位开户行',
          value: 'partyBOpeningBank',
          checked: true,
          align: 'left'
        },
        {
          name: '乙方银行账号',
          value: 'partyBCardNumber',
          checked: true,
          align: 'left'
        },
        {
          name: '乙方银行联行号',
          value: 'partyBCardAssociatesNumber',
          checked: true,
          align: 'left'
        },
        { name: '丙方单位', value: 'partyC', checked: true, align: 'left' },
        {
          name: '丙方账号名称',
          value: 'partyCName',
          checked: true,
          align: 'left'
        },
        {
          name: '丙方税号',
          value: 'partyCTaxationNumber',
          checked: true,
          align: 'left'
        },
        {
          name: '丙方单位开户行',
          value: 'partyCOpeningBank',
          checked: true,
          align: 'left'
        },
        {
          name: '丙方银行账号',
          value: 'partyCCardNumber',
          checked: true,
          align: 'left'
        },
        {
          name: '丙方银行联行号',
          value: 'partyCCardAssociatesNumber',
          checked: true,
          align: 'left'
        },
        {
          name: '履约责任处室',
          value: 'responsibleParty',
          checked: true,
          slot: 'responsibleParty'
        },
        { name: '履约负责人', value: 'contractManagerName', checked: true },
        { name: '合同状态', value: 'status', checked: true, slot: 'status' },
        {
          name: '合同计划开工日期',
          value: 'startDateStr',
          checked: true,
          slot: 'startDateStr'
        },
        {
          name: '合同计划完工日期',
          value: 'endDateStr',
          checked: true,
          slot: 'endDateStr'
        },
        {
          name: '合同实际开工日期',
          value: 'actualStartDateStr',
          checked: true,
          slot: 'actualStartDateStr'
        },
        {
          name: '合同实际完工日期',
          value: 'actualEndDateStr',
          checked: true,
          slot: 'actualEndDateStr'
        },
        { name: '排序', value: 'sort', checked: true },
        {
          name: '累计应结算金额',
          value: 'cumulativeSettlement',
          checked: true
        },
        { name: '累计扣留金额', value: 'cumulativeDetention', checked: true },
        { name: '累计扣除金额', value: 'cumulativeDivision', checked: true },
        {
          name: '累计实际支付金额',
          value: 'cumulativeActualPayment',
          checked: true
        },
        {
          name: '累计实际支付农民工工资',
          minWidth: 220,
          value: 'cumulativePaymentOfFarmers',
          checked: true
        },
        {
          name: '累计实际支付安全生产经费',
          value: 'cumulativeSafetyProductionExpense',
          minWidth: 220,
          checked: true
        },

        // {
        //   name: '合同附件',
        //   value: 'attachment',
        //   checked: true,
        //   align: 'left',
        //   slot: 'attachment'
        // },
        { name: '备注', value: 'remark', checked: true, align: 'left' },
        { name: '录入处室', value: 'unitName', checked: true, align: 'left' },
        { name: '录入人', value: 'createUsername', checked: true },
        {
          name: '录入日期',
          value: 'initiationDateStr',
          slot: 'initiationDateStr',
          checked: true
        }
      ],
      tableLoading: false,
      redeployData: {
        visible: false
      }
    }
  },
  computed: {
    checkAll() {
      return this.tableColumnList.findIndex((x) => !x.checked) == -1
    }
  },
  created() {
    this.getTableData()
    this.userId = this.$getStorage('userInfo').userId
    this.getDictItemList()
  },
  methods: {
    closedDialog() {
      this.oprateRow.dialogShow = false
    },
    getNumber(e) {
      if (e) {
        return (e - 0).toFixed(2)
      }
    },
    edit(row) {
      this.type = 'edit'
      this.oprateRow.dialogShow = true
      this.oprateRow.data = row
      this.title = '编辑'
      console.log(row)
    },
    view(row) {
      this.oprateRow.data = row
      this.oprateRow.dialogShow = true
      this.oprateRow.isView = true
      this.type = 'view'
      this.title = '详情'
    },
    /**
     * @description 转派
     */
    redeploy(row) {
      this.redeployData.visible = true
      this.redeployData.id = row.id
      this.redeployData.code = row.code
    },
    redeployOk() {
      this.$refs.redeployForm.validate((valid) => {
        if (valid) {
          update({
            id: this.redeployData.id,
            code: this.redeployData.code,
            editUser: this.redeployData.editUser
          }).then(() => {
            this.redeployData = { visible: false }
            this.getTableData()
          })
        }
      })
    },
    reset() {
      this.query = {}
      this.startDateAndEndDate = []
      this.pageParams.current = 1
      this.pageParams.pageSize = 20
      this.getTableData()
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageParams.current = val.current
      this.getTableData()
    },
    // 查询表格数据
    getTableData() {
      if (this.startDateAndEndDate && this.startDateAndEndDate.length > 0) {
        this.query.startDate = this.startDateAndEndDate[0]
        this.query.endDate = this.startDateAndEndDate[1]
      }
      this.pageParams.entity = this.query
      const params = JSON.parse(JSON.stringify(this.pageParams))
      page(params).then((data) => {
        this.tableData = data.data.records
        this.pageParams.total = data.data.total
      })
    },
    doLayout() {
      this.tableLoading = true
      setTimeout(() => {
        this.tableLoading = false
      }, 300)
      this.$refs.multipleTable.doLayout()
    },
    handleCheckAllChange(val) {
      this.tableColumnList.forEach((x) => {
        x.checked = val
      })
      this.doLayout()
    },
    handleCheckedChange(value, item) {
      this.doLayout()
    },
    /* 新增 */
    addHandle() {
      this.type = 'add'
      this.title = '新增'
      console.log('addHandle')
      this.oprateRow.data = {}
      this.oprateRow.dialogShow = true
      this.oprateRow.isView = false
    },
    /** 删除*/
    deleteHandle(row) {
      remove({
        id: row.id
      }).then((res) => {
        if (!res.success) {
          return this.$message.error('删除失败：' + res.message)
        }
        this.$message.success('删除成功')
        this.getTableData()
      })
    },

    timeFormat(time, type) {
      if (!time) {
        return ''
      }
      return dateFormat(time, type || 'YYYY-MM-DD HH:mm:ss')
    },
    async handelDeleteRow(row) {
      try {
        await this.$confirm(`确认删除该条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        })
        this.deletedata(row.id)
      } catch (e) {
        console.error(e)
      }
    },

    /**获取字典 */
    async getDictItemList() {
      const { data } = await getDictItemList('CONTRACT_TYPE')
      const paymentMethod = await getDictItemList('jjfs')
      const status = await getDictItemList('contract_status')
      const procurementMethod = await getDictItemList('procurement_method')
      const depart = await getDictItemList('yzdwzzjg')
      const contractStatus = await getDictItemList('contract_status')
      this.departList = depart.data
      this.procurementMethodList = procurementMethod.data
      this.contractTypeList = data
      this.statusList = status.data
      this.pricingMethodList = paymentMethod.data
      this.contractStatusList = contractStatus.data
    },

    getGender(agentCard) {
      if (!agentCard) {
        return ''
      }
      const idCardRegex =
        /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (!idCardRegex.test(agentCard)) {
        return ''
      }
      try {
        const gender = parseInt(agentCard.slice(16, 17)) % 2 === 0 ? '女' : '男'
        return gender
      } catch (error) {
        return ''
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    exportFile() {
      if (this.multipleSelection.length === 0) return
      const fields = this.tableColumnList.filter((x) => x.checked)
      if (fields.length === 0) {
        this.$message.error('请选择要导出的字段')
        return
      }
      const params = {
        ids: this.multipleSelection.map((x) => x.id),
        fields: fields.map((x) => x.value),
        headers: fields.map((x) => x.name)
      }
      this.download(
        '/api/contract/sign/export',
        params,
        params.ids.length > 1
          ? '合同登记.zip'
          : `${this.multipleSelection[0].name}.xlsx`
      )
    }
  }
}
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;
}

.el-col .el-input {
  width: 60%;
}
/deep/.el-range-editor--small .el-range-input {
  font-size: 12px;
}
.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}
</style>
<style  lang="scss">
// /deep/.el-range-editor--medium .el-range-input {
//   font-size: 12px;
// }
.popover-tableCol {
  .all {
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 4px;
    margin-bottom: 4px;
  }
  .checkboxList {
    max-height: 300px;
    overflow: auto;
  }
}
</style>
