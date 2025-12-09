<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      :page="pageParams"
      @query="getTableData"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item label="合同名称:">
            <el-input
              v-model="pageParams.entity.contractName"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="合同编号:">
            <el-input
              v-model="pageParams.entity.contractCode"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="发起单位:">
            <el-select v-model="pageParams.entity.unit">
              <el-option
                v-for="item in unitOptions"
                :key="item.corpId"
                :label="item.corpName"
                :value="item.corpId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发起人:">
            <el-input
              v-model="pageParams.entity.createUsername"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="发起日期:">
            <el-date-picker
              v-model="pageParams.entity.createData"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-form>
      </template>
      <!-- 新增按钮 -->
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelShowDialog(null, 'mine')"
        >
          新增
        </el-button>
      </template>
      <!-- 数据表格 -->
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            fixed="left"
            width="54"
            align="center"
          />
          <el-table-column
            label="合同名称"
            prop="contractName"
            align="left"
            :min-width="$calculateWidth(190)"
          >
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                class="text-ellipsis-clamp"
                @click="
                  handelShowDialog(
                    row,
                    'fine',
                    row.procMatterTaskDone ||
                      row.matterTaskTodo ||
                      row.procMatterRun,
                    'view'
                  )
                "
              >
                {{ row.contractName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="合同编号"
            prop="contractCode"
            align="left"
            :min-width="$calculateWidth(190)"
          />
          <el-table-column
            label="发起单位"
            prop="unit"
            align="left"
            :min-width="$calculateWidth(190)"
          />
          <el-table-column
            label="发起人"
            prop="createUsername"
            align="center"
            :width="$calculateWidth(120)"
          />
          <el-table-column
            label="发起日期"
            prop="signStatus"
            align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              {{ dateFormat(row.createDate, 'YYYY-MM-DD') }}
            </template>
          </el-table-column>
          <el-table-column
            label="当前节点"
            prop="flowName"
            align="center"
            :width="$calculateWidth(180)"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.flowName" placement="top" effect="dark">
                <div class="text-ellipsis-clamp">{{ row.flowName }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="流程状态"
            prop="flowStatus"
            align="center"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="scope">
              <flow-status
                :row="scope.row"
                :flowName="scope.row.flowName"
              ></flow-status>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template #default="{ row }">
              <flow-button
                :row="row"
                :flowName="row.flowName"
                @click="handelShowDialog"
                @delete="deletedata"
              ></flow-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    ></flow-dialog>
  </div>
</template>

<script>
import { page, remove, unitAllList } from './api'
import { FlowListMixin } from '@/mixins/FlowListMixin'
import TableLayout from '@/components/ContentLayout/Table'
import enums from '@/config/enums'
import { dateFormat } from '@/utils'
import moment from 'moment'

export default {
  name: 'investGeneralPay',
  mixins: [FlowListMixin],
  components: { TableLayout },
  data() {
    return {
      sectionOptions: [],
      unitOptions: [],
      pageParams: {
        orderProperties: [
          {
            property: 'createDate',
            asc: false
          }
        ],
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
        entity: {
          params: {}
        }
      },
      tableData: [],
      /**流程状态 */
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
      notFirst: false
    }
  },
  created() {
    this.getFlowStatus()
    this.getUnitList()
  },

  methods: {
    dateFormat,
    moment,
    async getUnitList() {
      const { data, success } = await unitAllList()
      if (success) {
        this.unitOptions = data
          .filter((x) => x.corpPid)
          .sort((a, b) => {
            return a.corpSort - b.corpSort
          })
      }
    },
    getCodeName(row, type) {
      let name = row[type] || row.designSupply?.[type] || ''
      return name
    },
    getText(options, value) {
      let a = []
      if (value) {
        value = value.split(',')
        a = value.map((x) => {
          let item = options.find((y) => y.id == x)
          if (item) {
            return item.name
          }
        })
      }
      return a.toString()
    },

    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage
    },

    reset() {
      this.pageParams = {
        orderProperties: [
          {
            property: 'createDate',
            asc: false
          }
        ],
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
        entity: {
          params: {}
        }
      }
      this.getTableData()
    },
    getTableData(pageInfo) {
      const pageParams = Object.assign(this.pageParams, pageInfo)
      if (pageParams.entity.createData?.length > 0) {
        pageParams.entity.startCreateDate = pageParams.entity.createData[0]
        pageParams.entity.endCreateDate = pageParams.entity.createData[1]
        delete pageParams.createData
      }
      pageParams.entity.type = 2
      page(pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records
          this.pageParams.total = res.data.total
          if (this.$route.query.id && !this.notFirst) {
            this.notFirst = true
            const row = this.tableData.find(
              (item) => item.id === this.$route.query.id
            )
            this.handelShowDialog(
              row,
              'fine',
              row.procMatterTaskDone || row.matterTaskTodo || row.procMatterRun,
              'view'
            )
          }
        }
      })
    },
    /**获取流程状态字典 */
    getFlowStatus() {
      let data = []
      let options = enums.FLOW_STATUS_ENUM
      for (const key in options) {
        data.push({
          id: options[key].value,
          dictCode: options[key].value,
          dictName: options[key].name
        })
      }
      this.flowStatusOptions = data
    },
    deletedata(row) {
      if (!row.id) {
        return
      }
      remove({
        id: row.id
      }).then((res) => {
        if (res.success) {
          this.getTableData()
        } else {
          this.$message.error('数据删除异常，' + res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
