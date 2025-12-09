<template>
  <el-dialog
    v-draggable
    :oprate-row="oprateRow"
    :title="title"
    :visible.sync="dialogShow"
    :destroy-on-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :fullscreen="true"
    append-to-body
    @closed="closedHandle"
  >
    <div class="data-form-container">
      <el-row class="form-content">
        <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="formDataRules"
          label-width="auto"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                label="年度计划完成投资额"
                prop="totalInvestmentAmount"
                label-width="160px"
              >
                <el-input-number
                  v-model="formData.totalInvestmentAmount"
                  :disabled="true"
                  :precision="2"
                  :controls="false"
                  placeholder="请输入"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <span class="form-title">各月度计划完成投资额</span>

          <el-row class="table-container">
            <el-col :span="24" class="table-wrapper">
              <el-table :data="monthlyTableData" border class="detail-table">
                <el-table-column
                  label="月份"
                  fixed="left"
                  header-align="center"
                  align="center"
                >
                  <template #default> 计划完成投资额 </template>
                </el-table-column>
                <el-table-column
                  v-for="(m, idx) in monthsCn"
                  :key="idx"
                  :label="m"
                  align="center"
                  width="120"
                >
                  <template #default>
                    <el-input-number
                      v-if="!readonly"
                      v-model="formData.monthlyCompleteAmounts[idx]"
                      :controls="false"
                      :precision="2"
                      @change="monthlyChange"
                      placeholder="请输入"
                      style="width: 100%"
                    />
                    <span v-else>{{
                      formData.monthlyCompleteAmounts[idx]
                    }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">
        {{ oprateRow.isView ? '关闭' : '取消' }}
      </el-button>
      <el-button v-if="!oprateRow.isView" type="primary" @click="save">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save, update } from './api'
import { dateFormat } from '@/utils'
import moment from 'moment'

export default {
  name: 'DataForm',
  components: {},
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    oprateRow: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: ''
    },
    investmentYear: {}
  },
  data() {
    return {
      isFormApp: false,
      showHiddenDangerRectifier: false,
      ntkoClose: false,
      dialogShow: false,
      formData: {
        totalInvestmentAmount: null,
        monthlyCompleteAmounts: Array(12).fill(null)
      },
      formDataRules: {
        totalInvestmentAmount: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      //正在加载
      loading: false,
      url: {
        list: '/api/investment/plan/page'
      },
      monthsCn: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
      ],
      monthlyTableData: [{}],
      investmentPlanDetails: []
    }
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage('userInfo')
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          const newData = { ...this.oprateRow.data }
          this.setFormData(newData)
        }
        this.dialogShow = newValue
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  mounted() {},
  // 页面离开时触发
  beforeDestroy() {
    if (this.fromapp) {
      const titleElement = document.getElementById('dynamicTitle')
      // 设置动态标题
      titleElement.textContent = '雄安调蓄工程建设管理系统'
    }
  },
  methods: {
    moment,
    dateFormat,
    closedHandle() {
      this.dialogShow = false
      this.$emit('closed')
    },
    /**
     * 通过ref接收父组件传递的数据
     * @param {Object} row 行数据
     */
    async setFormData(row) {
      if (row) {
        // 将数据设置到表单中
        this.formData = JSON.parse(JSON.stringify(row || {}))
        // 如果有日期字段，进行格式化
        if (this.formData.createDate) {
          this.formData.createDate = dateFormat(
            this.formData.createDate,
            'YYYY-MM-DD'
          )
        }
        // 装载月度数据
        const monthly = Array(12).fill(0)
        if (
          row &&
          row.investmentPlanDetails &&
          row.investmentPlanDetails.length
        ) {
          row.investmentPlanDetails.forEach((d) => {
            const idx = (d.investmentMonth || 0) - 1
            if (idx >= 0 && idx < 12) monthly[idx] = d.planAmount ?? null
          })
        }
        this.formData.monthlyCompleteAmounts = monthly
        // if (row && row.totalInvestmentAmount != null) {
        //   this.formData.annualCompleteAmount = row.totalInvestmentAmount
        // } else {
        //   this.formData.annualCompleteAmount = monthly.reduce(
        //     (s, v) => s + (Number(v) || 0),
        //     0
        //   )
        // }
      } else {
        // 初始化空表单
        this.formData = {
          totalInvestmentAmount: 0,
          monthlyCompleteAmounts: Array(12).fill(0)
        }
      }
    },
    monthlyChange() {
      const sum = (this.formData.monthlyCompleteAmounts || []).reduce(
        (s, v) => s + (Number(v) || 0),
        0
      )
      this.$set(this.formData, 'totalInvestmentAmount', sum)
    },
    save() {
      // 先进行表单校验
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          return
        }

        // 组装 submission 明细（仅按月份与金额）
        const details = (this.formData.monthlyCompleteAmounts || []).map(
          (val, i) => ({
            investmentMonth: i + 1,
            planAmount: val
          })
        )

        // 根据是否有ID决定使用save还是update
        const apiMethod = this.formData.id ? update : save

        this.formData.categoryCode = this.formData.code
        apiMethod({
          categoryCode: this.formData.code,
          investmentYear: moment(this.investmentYear).format('YYYY'),
          totalInvestmentAmount: this.formData.totalInvestmentAmount,
          investmentPlanDetails: details,
          id: this.formData.id
        })
          .then((res) => {
            const { success, message } = res
            if (!success) {
              return this.$message.error('保存失败：' + message)
            } else {
              this.$message.success(this.formData.id ? '更新成功' : '保存成功')
              this.$emit('ok')
              this.closedHandle()
            }
          })
          .catch((err) => {
            console.error(err)
            this.$message.error('保存失败')
          })
      })
    }
  }
}
</script>

<style scoped lang="scss">
// 单独处理  上传样式
.data-form-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.button-container {
  margin-bottom: 16px;
}

.form-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; // 解决flex布局嵌套滚动问题
  margin-bottom: 10px;
  position: relative; // 添加相对定位
  overflow: hidden; // 防止溢出
  padding-left: 16px;
}

.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: visible; // 修改为可见，让滚动条可以溢出
  min-height: 0;
}

.detail-table {
  max-height: 100%;
  height: calc(100% - 17px) !important; // 为滚动条预留精确空间
}

.upload-container {
  flex-shrink: 0; // 不压缩上传区域高度
  margin-top: 10px;
}

/deep/ .el-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/deep/ .el-table__body-wrapper {
  overflow-y: auto !important;
  overflow-x: auto !important;
  height: calc(100% - 15px) !important; // 减少高度以显示横向滚动条
  padding-bottom: 5px; // 底部添加内边距确保滚动条完全可见
}

/deep/.custom-disabled {
  .upload-demo {
    display: none;
  }
}

/deep/ .taskname {
  .el-form-item__content {
    top: 8px !important;

    .el-input__count {
      height: 25px;
      line-height: 25px;
      bottom: 3px;
      // background: transparent;
      // bottom: -3px;
    }
  }
}

/deep/.el-upload {
  text-align: left;
}
/deep/ .el-table {
  width: 100%;
  display: flex;
  flex-direction: column;

  .el-table__header-wrapper {
    flex-shrink: 0; // 表头不压缩
  }

  .el-table__body-wrapper {
    flex: 1; // 表体占据剩余空间
    overflow-y: auto !important;
    overflow-x: auto !important;
    min-height: 0; // 重要：允许flex项目正确滚动
  }

  table {
    width: 100%;
    min-width: 100%;
  }
}

/deep/ .file-list {
  margin-top: 3px !important;

  .icon {
    background-color: transparent !important;
    margin-right: 5px;
  }
}

::v-deep .el-divider--horizontal {
  margin: 18px 0;
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

.cotntainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.title {
  font-weight: bold;
}

.form-title {
  margin: 16px 0 16px 16px;
  font-weight: bold;
}
</style>
