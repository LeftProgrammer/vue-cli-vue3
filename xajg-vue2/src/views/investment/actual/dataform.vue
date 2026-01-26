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
    <div ref="formContainer" class="data-form-container">
      <div class="form-content">
        <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="formDataRules"
          label-width="auto"
        >
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="申报年月" prop="investmentDate">
                <el-date-picker
                  v-model="formData.investmentDate"
                  type="month"
                  :disabled="readonly"
                  style="width: 100%"
                  format="yyyy年MM月"
                  value-format="yyyy-MM"
                  @change="monthChange"
                />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="发起人:" prop="startUser">
                <el-input v-model="formData.startUser" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发起部门:" prop="startDept">
                <el-input v-model="formData.startDept" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="table-wrapper">
        <el-table
          ref="multipleTable"
          border
          row-key="id"
          default-expand-all
          :data="treeData"
          class="detail-table"
        >
          <el-table-column
            label="序号"
            prop="code"
            header-align="center"
            width="140"
          />
          <el-table-column label="项目名称" header-align="center" prop="name" />
          <el-table-column
            label="年度计划完成投资(万元)"
            align="center"
            width="200"
          >
            <template #default="{ row }">
              {{ monthPlan(row.code).totalInvestmentAmount }}
            </template>
          </el-table-column>
          <el-table-column
            label="本月计划完成投资(万元)"
            align="center"
            width="200"
          >
            <template #default="{ row }">
              {{ monthPlan(row.code).monthPlan }}
            </template>
          </el-table-column>
          <el-table-column
            label="本月实际投资(万元)"
            prop="price"
            header-align="center"
            align="right"
            width="250"
          >
            <template #default="{ row }">
              <el-input-number
                v-if="!readonly"
                v-model="row.actualAmount"
                :precision="2"
                style="width: 100%"
                :controls="false"
                :min="0"
              />
              <span v-else>{{ row.actualAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="remark"
            header-align="center"
            align="left"
            width="250"
          >
            <template #default="{ row }">
              <el-input
                v-if="!readonly"
                v-model="row.remark"
                style="width: 100%"
                show-word-limit
              />
              <span v-else>{{ row.remark }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">
        {{ oprateRow.isView ? '关闭' : '取消' }}
      </el-button>
      <el-button v-if="!oprateRow.isView" type="primary" @click="handleSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save, update } from './api'
import { getInvestmentCategoryTree, list } from '../schedule/api'
import moment from 'moment'
import { dateFormat } from '@/utils'
export default {
  name: 'DataForm',
  components: {},
  // Workflow mixin removed
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
    }
  },
  data() {
    return {
      dialogKey: 0, // 用于强制更新选择器组件

      dialogShow: false,
      formData: {},
      formDataRules: {
        investmentDate: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        month: [
          { required: true, message: '请选择投资月份', trigger: 'change' }
        ]
      },
      //正在加载
      loading: false,
      url: {
        list: '/api/investment/real/page'
      },
      treeData: [],
      planList: []
    }
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage('userInfo')
    },
    monthPlan() {
      return (code) => {
        const data =
          this.planList.find((item) => item.categoryCode === code) || {}
        return {
          totalInvestmentAmount: data.totalInvestmentAmount || 0,
          monthPlan:
            data.investmentPlanDetails && data.investmentPlanDetails.length > 0
              ? data.investmentPlanDetails[
                  moment(this.formData.investmentDate).month()
                ].planAmount
              : 0
        }
      }
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          const newData = { ...this.oprateRow.data }
          if (!newData.id) {
            this.formData = Object.assign(
              {},
              {
                startUser: this.userInfo.realName,
                startDept: this.userInfo.departName
              }
            )
          } else {
            Object.assign(this.formData, newData)
            this.monthChange(moment(this.formData.investmentDate), true)

            // this.treeData = this.arrayToTree(
            //   this.formData.investmentActualDetails
            // )
            // console.log('🚀 ~ this.treeData:', this.treeData)
          }
        }
        this.dialogShow = newValue
      },
      immediate: true,
      deep: true
    }
  },

  created() {},

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
    closedHandle() {
      this.dialogShow = false
      this.$emit('closed')
    },

    validateForm() {
      let formValid = false
      this.$refs.dataFormRef.validate((valid) => {
        formValid = valid
      })
      if (!formValid) {
        return false
      }
      return true
    },

    /**
     * @description table校验 并计算总和
     * @param row
     */

    monthChange(val, flag) {
      getInvestmentCategoryTree({
        year: moment(val).format('YYYY')
      }).then((res) => {
        if (res.success) {
          this.treeData = res.data
        } else {
          this.treeData = []
        }
        if (flag) {
          this.treeData = this.mergeListToTree(
            this.treeData,
            this.formData.investmentActualDetails
          )
        }
      })
      list({ investmentYear: moment(val).format('YYYY') }).then((resp) => {
        this.planList = resp.data
      })
    },
    mergeListToTree(tree, list) {
      // ① 建表 O(n)
      const map = new Map(list.map((item) => [item.categoryCode, item]))

      // ② DFS 刷值 O(n)
      function dfs(nodes) {
        for (const node of nodes) {
          const hit = map.get(node.code)
          if (hit) {
            node.actualAmount = hit.actualAmount
            node.remark = hit.remark
          }
          if (node.children?.length) dfs(node.children)
        }
      }
      dfs(tree)
      return tree
    },
    handleSubmit() {
      // 验证整个表单
      if (!this.validateForm()) {
        return
      }
      const investmentActualDetails = this.flattenFast(this.treeData)
      const submitData = Object.assign({}, this.formData)
      submitData.investmentActualDetails = investmentActualDetails.map((x) => {
        const obj = {
          categoryCode: x.code,
          actualAmount: x.actualAmount,
          remark: x.remark
        }
        if (this.oprateRow.type == 'edit') {
          obj.id = x.id
        }
        return obj
      })
      submitData.totalInvestmentAmount = investmentActualDetails.reduce(
        (x, y) => {
          return x + (y.actualAmount || 0)
        },
        0
      )

      // 提交数据
      const requestFn = this.oprateRow.type == 'edit' ? update : save
      requestFn(submitData)
        .then((res) => {
          if (res.success) {
            this.$message.success(
              this.oprateRow.type == 'edit' ? '更新成功' : '保存成功'
            )
            this.$emit('ok')
            this.closedHandle()
          } else {
            this.$message.error(res.message || '保存失败')
          }
        })
        .catch((err) => {
          console.error('保存异常:', err)
          this.$message.error('系统异常，请稍后重试')
        })
    },
    arrayToTree(
      arr,
      {
        idKey = 'id',
        parentKey = 'pid',
        childrenKey = 'children',
        rootPid = 0
      } = {}
    ) {
      console.log('🚀 ~ arr:', arr)
      const map = new Map()
      const tree = []

      // ① 预创建节点（含空 children）
      for (const item of arr) {
        map.set(item[idKey], {
          ...item,
          [childrenKey]: [],
          code: item.categoryCode
        })
      }

      // ② 一次性挂载
      for (const item of arr) {
        const node = map.get(item[idKey])
        const pid = item[parentKey]
        console.log(pid)
        if (pid === rootPid || !map.has(pid)) {
          tree.push(node) // 根节点
        } else {
          map.get(pid)[childrenKey].push(node) // 挂到父级
        }
      }
      return tree
    },
    /**
     * 超大数据树 → 数组（高性能）
     * @param {Array} forest  根数组
     * @param {string|number} rootPid  根节点的 parentId 占位值
     * @returns {Array} 扁平数组，字段顺序与输入节点一致（仅去掉 children）
     */
    flattenFast(forest, rootPid = null) {
      // 1. 预估算节点总量（可选，避免频繁扩容）
      let total = 0
      const q = JSON.parse(JSON.stringify(forest))
      for (let i = 0; i < q.length; i++) {
        total++
        const c = q[i].children
        if (c) q.push(...c) // 仅做计数，不拷贝其它字段
      }
      const res = new Array(total) // 预分配
      let cursor = 0 // 写入指针

      // 2. 正式展开（再次扫一遍）
      const stack = new Array(total)
      let top = -1 // 手动栈指针

      // 根入栈
      for (let i = 0; i < forest.length; i++) {
        const node = forest[i]
        stack[++top] = { node, pid: rootPid, depth: 0 }
      }

      while (top !== -1) {
        const { node, pid, depth } = stack[top--]
        const { children } = node

        // 写入结果（手动拷贝字段，避免展开运算符）
        const item = {}
        for (const key in node) {
          if (key !== 'children') item[key] = node[key]
        }
        item.parentId = pid
        item.depth = depth
        res[cursor++] = item

        // 子节点入栈（从右向左，保证出栈顺序从左到右）
        if (children && children.length) {
          for (let i = children.length - 1; i >= 0; i--) {
            stack[++top] = { node: children[i], pid: node.id, depth: depth + 1 }
          }
        }
      }
      return res
    }
  }
}
</script>
<style scoped lang="scss">
.data-form-container {
  height: 100%;
}

.form-content {
}

.table-wrapper {
  height: calc(100% - 52px);
}
.el-table {
  height: 100%;
}

/deep/ .el-table__body-wrapper {
  height: calc(100% - 48px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
