<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      :show-export-btn="true"
      title="原材料/中间产品进场保验单列表"
      @initExportParams="initExportParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="getTableData"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="流程名称:" size="mini">
            <el-input v-model="query.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="所属标段:" size="mini" prop="sectionId">
            <el-select
              v-model="query.sectionId"
              class="w-100pre"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in sectionOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="流程编号:" size="mini">
            <el-input v-model="query.code" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="流程状态:">
            <el-select
              ref="flowStateRef"
              v-model="query.flowStatus"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in flowStatusOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button type="primary" icon="el-icon-plus" @click="addHandle()">
          新增
        </el-button>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" border>
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            width="54"
            align="center"
          />
          <el-table-column
            label="流程名称"
            prop="name"
            align="left"
            header-align="center"
          >
            <template #default="{ row }">
              <el-link
                type="primary"
                @click="
                  edit(
                    row,
                    'fine',
                    row.procMatterTaskDone ||
                      row.matterTaskTodo ||
                      row.procMatterRun,
                    'view'
                  )
                "
              >{{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="所属标段"
            prop="sectionId"
            excel.handler="excelHandleCovert"
            excel.args="section"
            align="center"
            width="180"
          >
            <template slot-scope="{ row }">
              <div class="text-ellipsis">
                {{ getText(sectionOptions, getCodeName(row, 'sectionId')) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="流程编号"
            prop="code"
            header-align="center"
            align="left"
            width="180"
          />
          <el-table-column
            label="发起日期"
            prop="startDate"
            align="center"
            width="120"
            excel.dateFormat="yyyy-MM-dd"
          >
            <template slot-scope="{ row }">
              {{ row.startDate ? timeFormat(row.startDate, 'yyyy-MM-DD') : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="发起人"
            prop="createUser"
            align="center"
            width="120"
            excel.handler="excelHandleCovert"
            excel.args="user"
          >
            <template slot-scope="{ row }"> {{ row.createUsername }}</template>
          </el-table-column>
          <el-table-column
            label="流程状态"
            prop="flowStatus"
            align="center"
            width="120"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
          >
            <template slot-scope="{ row }">
              <flow-status :row="row" :flow-name="flowName" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" align="center">
            <template #default="{ row }">
              <div style="display: flex; align-items: center">
                <el-button
                  v-if="
                    (row.flowStatus == 1 || row.flowStatus == 2) &&
                      row.createUser == userId
                  "
                  type="text"
                  @click="editForm(row)"
                >编辑
                </el-button>
                <flow-button
                  :row="row"
                  :flow-name="flowName"
                  @click="edit"
                  @delete="deleteRow"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <flow-dialog
      :visible="flowShow"
      :flow-info="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    />
    <dataform1
      v-if="oprateRow.dialogShow"
      :title="'编辑'"
      :visible="oprateRow.dialogShow"
      :data="oprateRow"
      :readonly="false"
      @sureson="sureson"
    />
  </div>
</template>

<script>
import { remove, page } from './api'
import { dateFormat } from '@/utils'
import { FlowListMixin } from '@/mixins/FlowListMixin'
import TableLayout from '@/components/ContentLayout/TreeTable'
import enums from '@/config/enums'
import { getSectionByCorpId } from '@/api/measure'
import dataform1 from './dataform1.vue'

export default {
  name: 'IngressCheck',
  components: {
    TableLayout,
    dataform1
  },
  mixins: [FlowListMixin],
  data() {
    return {
      sectionOptions: [],
      startTimeAndEndTime: [],
      treeNode: {}, //点击树节点传递给子组件使用
      type: '',
      title: '监测点列表',
      DitSpeciality: [],
      defaultProps: {
        children: 'children',
        label: 'dictName'
      },
      pageParams: {
        size: 20,
        current: 1,
        total: 0
      },
      options: [],
      tableData: [],
      query: {
        type: null,
        params: {}
      },
      node: {},
      /**流程状态 */
      flowStatusOptions: [],
      oprateRow: {}
    }
  },
  computed: {
    exportParams() {
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query
        }
      }
      return params
    },
    userId() {
      return this.$getStorage('userInfo').userId
    }
  },
  created() {
    this.getCurrent()
    this.getTableData()
    this.getFlowStatus()
  },
  methods: {
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
    //翻译列表所属标段 id=>name
    sectionIdFormatter(row, column) {
      var value = ''
      for (var i = 0; i < this.sectionOptions.length; i++) {
        var item = this.sectionOptions[i]
        if (row.sectionId == item.id) {
          value = item.name
          break
        }
      }
      return value
    },
    /**获取施工标段 */
    async getSectionList(corporateId) {
      try {
        const { data, success, message } = await getSectionByCorpId({
          corpId: corporateId
        })

        if (!success) {
          this.$message.error('查询标段失败：' + message)
          return false
        }
        this.sectionOptions = data
        return data
      } catch (err) {
        console.error(err)
        this.$message.error('查询标段失败')
        return false
      }
    },
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = '/api/quality/check/export'
      exportParams.filename =
        '进场报验' +
        (this.query.dictNamePath ? '-' + this.query.dictNamePath : '')
      exportParams.params = this.exportParams
      exportParams.params.entity.columns = exportParams.columns
    },
    edit(row, status, task, type) {
      this.handelShowDialog(row, status, task)
    },
    deleteRow(row) {
      remove(row).then((res) => {
        if (res.success) {
          this.$message.success('删除数据成功')
          this.getTableData()
        } else {
          this.$message.error('删除数据失败' + res.message ? res.message : '')
        }
      })
    },
    reset() {
      this.query = {}
      this.query.current = 1
      this.query.pageSize = 20
      this.getTableData()
    },
    async getCurrent() {
      console.log('this.currentSection', this.$getStorage('userInfo'))
      this.current = this.$getStorage('userInfo')
      console.log('获取当前登陆人的单位', this.current)
      await this.getSectionList(this.current.corpId)
      if (this.sectionOptions.length === 0) {
        this.$message.error('查询标段失败')
      }
    },
    // 查询表格数据
    getTableData() {
      this.pageParams.entity = this.query
      const params = JSON.parse(JSON.stringify(this.pageParams))
      page(params).then((data) => {
        this.tableData = data.data.records
        this.pageParams.total = data.data.total
      })
    },
    /**新增 */
    addHandle() {
      this.handelShowDialog(null, 'mine')
    },

    timeFormat(time, type) {
      return dateFormat(time, type || 'YYYY-MM-DD HH:mm:ss')
    },

    handleSizeChange(val) {
      this.pageParams = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageParams = val
      this.getTableData()
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
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
    editForm(val) {
      this.oprateRow.dialogShow = true
      this.oprateRow.data = val
      this.oprateRow.isView = false
    },
    sureson() {
      this.oprateRow.dialogShow = false
      this.getTableData()
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .table-content .table .table-cnotent .el-table .el-table__body-wrapper {
  height: calc(100% - 80px) !important;
}

.page-list {
  width: 100%;
  height: 100%;
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
</style>
