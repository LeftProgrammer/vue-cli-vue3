<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    width="60%"
    :close-on-click-modal="false"
    append-to-body
    v-draggable
    destroy-on-close
  >
    <el-table
      ref="multipleTable"
      border
      :data="tableData"
      style="width: 100%; height: 100%; overflow: auto"
    >
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="相关编号" prop="parentCode" align="center" />
      <el-table-column label="概算编码" prop="estimateCode" align="center" />
      <el-table-column label="本次结算金额" prop="thisPrice" align="center" />
      <el-table-column label="累计结算金额" prop="totalPrice" align="center" />
      <el-table-column label="日期" prop="createDate" align="center">
        <template slot-scope="{ row }">
          {{ dateFormat(row.createDate, 'YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="view(scope.row)"> 查看 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" align="center" class="dialog-footer">
      <el-button @click="handleCancel">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dateFormat } from '@/utils'
import { getRecordIdBySub } from './api'

export default {
  name: 'investment-estimate-item',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },

  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.dialogVisible = val
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('close')
      }
    }
  },
  methods: {
    dateFormat,

    handleCancel() {
      this.dialogVisible = false
    },
    view(row) {
      getRecordIdBySub(row.id).then((res) => {
        this.$router.push({
          path: `/contract/investGeneralPay${
            row.parentType == 2 ? '1' : ''
          }?permCode=contract-investGeneralPay${
            row.parentType == 2 ? '1' : ''
          }&name=${row.parentType == 2 ? '非' : ''}工程合同结算&id=${res.data}`
        })
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
