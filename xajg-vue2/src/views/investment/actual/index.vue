<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      title="实际投资列表"
      :page="pageParams"
      @query="handleQuery"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item label="申报年月:" size="mini">
            <el-date-picker
              v-model="pageParams.entity.investmentDate"
              type="month"
              placeholder="选择申报年月"
            />
          </el-form-item>
        </el-form>
      </template>
      <!-- 新增按钮 -->
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleShowDialog({}, 'add')"
        >
          新增
        </el-button>
      </template>
      <!-- 数据表格 -->
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          @header-dragend="handleHeaderDragEnd"
        >
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            width="54"
            align="center"
          />
          <el-table-column label="申报年月" prop="investmentDate" align="left">
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                :underline="false"
                @click="handleShowDialog(row, 'view')"
              >
                {{ row.investmentDate }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="本月完成总额(元)"
            prop="totalInvestmentAmount"
            align="right"
          />
          <el-table-column label="发起人" prop="startUser" align="right" />
          <el-table-column label="发起部门" prop="startDept" align="right" />
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-link type="primary" @click="handleShowDialog(row, 'edit')"
                >编辑</el-link
              >
              <el-divider direction="vertical" />
              <el-link type="danger" @click="deletedata(row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <data-form
      :type="type"
      :title="title"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :oprateRow="oprateRow"
      :readonly="oprateRow.isView"
      @closed="closedDialog"
      @ok="handleSaveSuccess"
    />
  </div>
</template>

<script>
import { page, remove } from './api'
import DataForm from './dataform.vue'
import TableLayout from '@/components/ContentLayout/Table'
import { FlowListMixin } from '@/mixins/FlowListMixin'
import { dateFormat } from '@/utils'
import moment from 'moment'
export default {
  name: 'InvestmentReal',
  mixins: [FlowListMixin],
  components: { TableLayout, DataForm },
  data() {
    return {
      currentRow: {},
      readonly: false,
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
        entity: {}
      },
      tableData: [],
      oprateRow: {},
      type: '',
      title: '',
      startTimeAndEndTime: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    dateFormat,
    moment,

    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },

    /**
     * @description 保存成功回调
     */
    handleSaveSuccess() {
      this.getTableData()
    },

    /**
     * @description 分页大小变化
     */
    handleSizeChange(val) {
      this.pageParams.size = val
      this.pageParams.pageSize = val
      this.getTableData()
    },
    /**
     * @description 当前页变化
     */
    handleCurrentChange(val) {
      this.pageParams.current = val
      this.getTableData()
    },

    handleShowDialog(row, type) {
      this.type = type
      this.title = type == 'add' ? '新增' : type == 'edit' ? '编辑' : '查看'
      this.oprateRow.data = row
      this.oprateRow.dialogShow = true
      this.oprateRow.type = type
      this.oprateRow.isView = type === 'view'
    },
    closedDialog() {
      this.oprateRow.dialogShow = false
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout()
      })
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
        entity: {}
      }
      this.startTimeAndEndTime = []
      this.getTableData()
    },
    getTableData(pageInfo) {
      const pageParams = Object.assign(this.pageParams, pageInfo)
      if (pageParams.entity.investmentDate) {
        pageParams.entity.investmentDate = moment(
          pageParams.entity.investmentDate
        ).format('YYYY-MM')
      }
      page(pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records
          this.pageParams.total = res.data.total
        }
      })
    },
    deletedata(row) {
      if (!row.id) {
        return
      }

      this.$confirm('确认删除该投资记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 用户确认删除
          remove({
            id: row.id
          })
            .then((res) => {
              if (res.success) {
                this.getTableData()
                this.$message.success('删除数据成功')
              } else {
                this.$message.error('数据删除异常，' + res.message)
              }
            })
            .catch((err) => {
              console.error('删除请求失败:', err)
              this.$message.error('删除请求失败，请稍后重试')
            })
        })
        .catch(() => {
          // 用户取消删除
          this.$message.info('已取消删除操作')
        })
    },
    timeFormat(time, type) {
      return dateFormat(time, type || 'YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped lang="scss">
.el-dialog__body {
  max-height: 65vh;
  overflow-y: auto;
}
</style>
