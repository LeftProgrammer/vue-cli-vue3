<template>
  <div class="Organization">
    <el-tabs v-model="activeName">
      <el-tab-pane label="组织机构列表" name="table">
        <table-layout :showPage="false" @query="getTableData" @reset="reset">
          <template #opratebtns>
            <el-button type="primary" @click="addHandle(1)">
              <el-icon><Plus /></el-icon>
              新增组织
            </el-button>
            <el-button type="primary" @click="addHandle(2)">
              <el-icon><Plus /></el-icon>
              新增职位
            </el-button>
          </template>
          <template #table>
            <el-table ref="multipleTable" :data="tableData" border row-key="id">
              <el-table-column
                label="序号"
                type="index"
                :index="getIndex"
                width="54"
                align="center"
              />
              <el-table-column
                label="组织/职位名称"
                align="left"
                header-align="center"
                prop="name"
                excel.sort="2"
              >
                <template #default="{ row }">
                  <el-link
                    type="primary"
                    :underline="false"
                    @click="view(row)"
                  >
                    {{ row.name }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                label="顺序号"
                prop="sort"
                align="left"
                header-align="center"
                width="350"
              />
              <el-table-column
                label="成员"
                prop="user"
                align="left"
                header-align="left"
              />
              <el-table-column
                label="职责"
                prop="responsibility"
                align="left"
                header-align="left"
              />
              <el-table-column
                fixed="right"
                label="操作"
                width="200"
                align="center"
              >
                <template #default="{ row }">
                  <list-button
                    :row="row"
                    @edit="edit"
                    @delete="deleteHandle"
                  />
                </template>
              </el-table-column>
            </el-table>
          </template>
        </table-layout>
        <dataform
          v-if="oprateRow.dialogShow"
          :type="type"
          :title="title"
          :visible="oprateRow.dialogShow"
          :data="oprateRow.data"
          :readonly="oprateRow.isView"
          :tableData="tableData"
          @closed="closedDialog"
          @ok="getTableData"
        />
      </el-tab-pane>
      <el-tab-pane label="组织机构图" name="image">
        <vue3-tree-org v-if="treeData" :data="treeData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { page, remove } from './api'
import { dateFormat } from '@/utils'
import { ListMixin } from '@/mixins/ListMixin'
import ListButton from '@/components/ListButton'
import TableLayout from '@/components/ContentLayout/Table'
import dataform from './dataform'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'Organization',
  components: {
    ListButton,
    dataform,
    TableLayout,
    Plus
  },
  mixins: [ListMixin],
  data() {
    return {
      activeName: 'table',
      type: '',
      title: '',
      oprateRow: {},
      tableData: [],
      treeData: null
    }
  },
  created() {},
  mounted() {
    this.getTableData()
  },
  methods: {
    dateFormat,
    closedDialog() {
      this.oprateRow.dialogShow = false
    },
    edit(row) {
      this.oprateRow.data = { ...row, type: row.user ? 2 : 1 }
      this.oprateRow.dialogShow = true
      this.oprateRow.isView = false
      this.type = 'edit'
      this.title = '编辑'
    },
    view(row) {
      this.oprateRow.data = { ...row, type: row.user ? 2 : 1 }
      this.oprateRow.dialogShow = true
      this.oprateRow.isView = true
      this.type = 'view'
      this.title = '详情'
    },
    getTableData() {
      page().then((data) => {
        this.tableData = this.arrayToTree(data.data)
        this.treeData = this.tableData[0] || null
        console.log('组织架构树数据:', this.treeData)
      })
    },
    arrayToTree(list = [], opt = {}) {
      const {
        idKey = 'id',
        pidKey = 'pid',
        sortKey = 'sort',
        childrenKey = 'children'
      } = opt

      const map = new Map()
      list.forEach((item) =>
        map.set(item[idKey], {
          ...item,
          label: `${item.name} ${item.user ? ' : ' + item.user : ''}`,
          [childrenKey]: []
        })
      )

      const tree = []
      list.forEach((item) => {
        const node = map.get(item[idKey])
        if (item[pidKey] == null || !map.has(item[pidKey])) {
          tree.push(node)
        } else {
          const parent = map.get(item[pidKey])
          parent[childrenKey].push(node)
        }
      })

      function sortChildren(nodes) {
        if (!Array.isArray(nodes)) return
        nodes.sort((a, b) => (a[sortKey] ?? 0) - (b[sortKey] ?? 0))
        nodes.forEach((n) => sortChildren(n[childrenKey]))
      }
      sortChildren(tree)

      return tree
    },
    addHandle(type) {
      this.type = 'add'
      this.title = '新增'
      this.oprateRow.data = { type }
      this.oprateRow.dialogShow = true
      this.oprateRow.isView = false
    },
    deleteHandle(row) {
      remove({ id: row.id }).then((res) => {
        if (!res.success) {
          return this.$message.error('删除失败：' + res.message)
        }
        this.$message.success('删除成功')
        this.getTableData()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.Organization {
  height: 100%;
  
  :deep(.el-tabs) {
    height: 100%;
    
    .el-tabs__content {
      height: calc(100% - 40px - 15px);
      
      .el-tab-pane {
        height: 100%;
        
        .org-tree-container {
          height: 100%;
          width: 100%;
          
          .org-tree {
            margin: auto;
          }
        }
      }
    }
  }
}
</style>
