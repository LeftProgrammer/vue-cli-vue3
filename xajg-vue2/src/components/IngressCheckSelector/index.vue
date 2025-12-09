<template>
  <el-dialog
    v-draggable :visible.sync="innerVisible" :title="title" :width="width" append-to-body
    :close-on-click-modal="false" class="ingress-check-selector-dialog" @opened="handleOpened"
    @closed="handleClosed"
  >
    <div class="filter-wrapper">
      <el-form :inline="true" :model="query">
        <el-form-item label="流程名称">
          <el-input v-model="query.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="流程编号">
          <el-input v-model="query.code" placeholder="请输入" clearable />
        </el-form-item>
        <!-- <el-form-item label="流程状态">
          <el-select v-model="query.flowStatus" placeholder="请选择" clearable>
            <el-option
              v-for="item in flowStatusOptions"
              :key="item.id"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="dataTable" v-loading="loading" :data="tableData" border max-height="360"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="center" :index="getIndex" />
      <el-table-column prop="name" label="流程名称" min-width="180" show-overflow-tooltip />
      <el-table-column label="所属标段" min-width="180" align="center">
        <template #default="{ row }">
          <div class="text-ellipsis">
            {{ getText(sectionList, getCodeName(row, 'sectionId')) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="流程编号" width="160" show-overflow-tooltip />
      <el-table-column prop="startDate" label="发起日期" width="140" align="center">
        <template #default="{ row }">
          {{ row.startDate ? timeFormat(row.startDate, "YYYY-MM-DD") : "" }}
        </template>
      </el-table-column>
      <el-table-column prop="createUsername" label="发起人" width="120" align="center" />
      <el-table-column prop="flowStatus" label="流程状态" width="120" align="center">
        <template #default="{ row }">
          <flow-status :row="row" :flow-name="flowName" />
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <el-pagination
        layout="total, sizes, prev, pager, next" :current-page="page.current" :page-size="page.size"
        :page-sizes="pageSizes" :total="page.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import { page } from '@/views/qualitySafetyManagement/ingressCheck/api'
    import enums from '@/config/enums'
    import { dateFormat } from '@/utils'
    import { getSectionByCorpId } from '@/api/measure'
    import { FlowListMixin } from '@/mixins/FlowListMixin'

    export default {
        name: 'IngressCheckSelector',
        mixins: [FlowListMixin],
        props: {
            visible: { type: Boolean, default: false },
            value: { type: Array, default: () => [] },
            title: { type: String, default: '选择进场报验单' },
            width: { type: String, default: '1200px' }
        },
        data() {
            return {
                innerVisible: false,
                loading: false,
                query: {
                    name: '',
                    code: '',
                    flowStatus: '',
                    sectionId: ''
                },
                tableData: [],
                selectedRows: [],
                page: {
                    current: 1,
                    size: 20,
                    total: 0
                },
                pageSizes: [10, 20, 30, 50],
                flowStatusOptions: [],
                sectionList: [],
                current: null
            }
        },
        watch: {
            visible: {
                immediate: true,
                handler(val) {
                    this.innerVisible = val
                    if (val) {
                        this.init()
                    }
                }
            }
        },
        created() {
            this.loadFlowStatus()
            this.getCurrent()
        },
        methods: {
            init() {
                this.page.current = 1
                this.fetchTable()
            },
            loadFlowStatus() {
                if (this.flowStatusOptions.length) return
                const options = enums.FLOW_STATUS_ENUM || {}
                this.flowStatusOptions = Object.keys(options).map((key) => {
                    const item = options[key]
                    return {
                        id: item.value,
                        dictCode: item.value,
                        dictName: item.name
                    }
                })
            },
            handleOpened() {
                this.syncSelection()
            },
            handleClosed() {
                this.$emit('update:visible', false)
                this.$emit('closed')
            },
            handleQuery() {
                this.page.current = 1
                this.fetchTable()
            },
            handleReset() {
                this.query = {
                    name: '',
                    code: '',
                    flowStatus: '',
                    sectionId: this.getDefaultSectionId()
                }
                this.handleQuery()
            },
            handleSizeChange(size) {
                this.page.size = size
                this.fetchTable()
            },
            handleCurrentChange(current) {
                this.page.current = current
                this.fetchTable()
            },
            fetchTable() {
                this.loading = true
                const params = {
                    current: this.page.current,
                    size: this.page.size,
                    entity: {
                        ...this.query
                    }
                }
                page(params)
                    .then((res) => {
                        const data = res?.data || {}
                        this.tableData = data.records || []
                        this.page.total = data.total || 0
                        this.$nextTick(() => {
                            this.syncSelection()
                        })
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows
            },
            syncSelection() {
                const table = this.$refs.dataTable
                if (!table) return
                table.clearSelection()
                const selectedIds = new Set(this.value || [])
                this.tableData.forEach((row) => {
                    if (selectedIds.has(row.id)) {
                        table.toggleRowSelection(row, true)
                    }
                })
                this.selectedRows = this.tableData.filter((row) => selectedIds.has(row.id))
            },
            handleConfirm() {
                const ids = this.selectedRows.map((item) => item.id)
                this.$emit('confirm', ids, this.selectedRows)
                this.$emit('change', ids)
                this.close()
            },
            close() {
                this.innerVisible = false
            },
            getIndex(index) {
                return (this.page.current - 1) * this.page.size + index + 1
            },
            timeFormat(time, format = 'YYYY-MM-DD HH:mm:ss') {
                return dateFormat(time, format)
            },
            async getCurrent() {
                this.current = this.$getStorage('userInfo')
                await this.getSectionList(this.current.corpId)
                if (this.sectionList.length === 1) {
                    // 如果标段只有一个，自动带入sectionId
                    this.query.sectionId = this.sectionList[0].id
                } else {
                    // 如果标段有多个，sectionId为空
                    this.query.sectionId = ''
                }
            },
            async getSectionList(corporateId) {
                try {
                    const { data, success, message } = await getSectionByCorpId({
                        corpId: corporateId
                    })
                    if (!success) {
                        this.$message.error('查询标段失败：' + message)
                        return false
                    }
                    this.sectionList = data || []
                    return data
                } catch (err) {
                    console.error(err)
                    this.$message.error('查询标段失败')
                    return false
                }
            },
            getDefaultSectionId() {
                // 返回默认的sectionId：单个标段时返回该标段ID，多个标段时返回空
                return this.sectionList.length === 1 ? this.sectionList[0].id : ''
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
            }
        }
    }
</script>

<style scoped lang="scss">
    .filter-wrapper {
        margin-bottom: 12px;
    }

    .pagination-wrapper {
        margin-top: 12px;
        text-align: right;
    }

    .text-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>

<style lang="scss">
/* 使用更强的选择器优先级 */
.el-dialog__wrapper .ingress-check-selector-dialog .el-dialog {
    margin-top: 5vh !important;
    max-height: 90vh !important;
}

.el-dialog__wrapper .ingress-check-selector-dialog .el-dialog .el-dialog__body {
    padding: 20px !important;
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
    overflow-x: hidden !important;
    overflow-y: visible !important;
}

/* 备用方案：直接针对弹窗内容 */
.ingress-check-selector-dialog .el-dialog__body {
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
}
</style>
