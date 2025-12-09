<template>
  <div class="Organization">
    <el-tabs v-model="activeName">
      <el-tab-pane label="组织机构列表" name="table">
        <table-layout :showPage="false" @query="getTableData" @reset="reset">
          <template slot="opratebtns">
            <el-button type="primary" icon="el-icon-plus" @click="addHandle(1)">
              新增组织
            </el-button>
            <el-button type="primary" icon="el-icon-plus" @click="addHandle(2)">
              新增职位
            </el-button>
          </template>
          <template slot="table">
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
                <template slot-scope="{ row }">
                  <el-link
                    type="primary"
                    :underline="false"
                    @click="view(row)"
                    >{{ row.name }}</el-link
                  >
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
                width="400"
              />

              <el-table-column
                label="联系方式"
                align="center"
                prop="phone"
                width="120"
                excel.sort="6"
              />

              <el-table-column
                label="更新人"
                align="center"
                prop="createUsername"
                width="120"
                excel.sort="6"
              >
              </el-table-column>
              <el-table-column
                label="更新时间"
                align="center"
                prop="createDate"
                width="120"
                excel.sort="6"
                excel.dateFormat="yyyy-MM-dd"
              >
                <template slot-scope="{ row }">
                  {{
                    row.createDate
                      ? dateFormat(row.createDate, 'YYYY-MM-DD')
                      : ''
                  }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template #default="{ row }">
                  <list-button
                    :data="row"
                    :btns="[
                      { title: '编辑', method: 'edit' },
                      { title: '删除', method: 'delete' }
                    ]"
                    @edit="edit"
                    @delete="deleteHandle"
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
          :data="oprateRow.data"
          :readonly="oprateRow.isView"
          :tableData="tableData"
          @closed="closedDialog"
          @ok="getTableData"
        >
        </dataform>
      </el-tab-pane>
      <el-tab-pane label="组织机构图" name="image">
        <vue2-org-tree :data="treeData" v-if="treeData" />
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
export default {
  components: {
    ListButton,
    dataform,
    TableLayout
  },
  mixins: [ListMixin],
  data() {
    return {
      activeName: 'table',
      type: '',
      title: '',
      oprateRow: {},
      tableData: [],
      treeData: {}
    }
  },
  created() {},
  mounted() {},
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
    }, // 查询表格数据
    getTableData() {
      page().then((data) => {
        this.tableData = this.arrayToTree(data.data)
        this.treeData = this.tableData[0] || false
      })
    },
    /**
     * 将扁平数组转成树形结构（按 sort 升序排序）
     * @param {Array} list 原始数组
     * @param {Object} opt 配置项
     *        - idKey: 主键字段名，默认 'id'
     *        - pidKey: 父级 id 字段名，默认 'parentId'
     *        - sortKey: 排序字段名，默认 'sort'
     *        - childrenKey: 子节点字段名，默认 'children'
     * @returns {Array} 树形结构
     */
    arrayToTree(list = [], opt = {}) {
      const {
        idKey = 'id',
        pidKey = 'pid',
        sortKey = 'sort',
        childrenKey = 'children'
      } = opt

      // 1. 建立 id -> node 的映射
      const map = new Map()
      list.forEach((item) =>
        map.set(item[idKey], {
          ...item,
          label: `${item.name} ${item.user ? ' : ' + item.user : ''}`,
          [childrenKey]: []
        })
      )

      // 2. 组装树
      const tree = []
      list.forEach((item) => {
        const node = map.get(item[idKey])
        if (item[pidKey] == null || !map.has(item[pidKey])) {
          // 根节点
          tree.push(node)
        } else {
          // 子节点
          const parent = map.get(item[pidKey])
          parent[childrenKey].push(node)
        }
      })

      // 3. 递归排序
      function sortChildren(nodes) {
        if (!Array.isArray(nodes)) return
        nodes.sort((a, b) => (a[sortKey] ?? 0) - (b[sortKey] ?? 0))
        nodes.forEach((n) => sortChildren(n[childrenKey]))
      }
      sortChildren(tree)

      return tree
    },
    /* 新增 */
    addHandle(type) {
      this.type = 'add'
      this.title = '新增'
      this.oprateRow.data = { type }
      this.oprateRow.dialogShow = true
      this.oprateRow.isView = false
    },
    /** 删除*/
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
@import url('https://unpkg.com/vue2-org-tree@1.1.0/dist/style.css');
.Organization {
  height: 100%;
  .el-tabs {
    height: 100%;
    .el-tabs__content {
      height: calc(100% - 40px - 15px);
      .el-tab-pane {
        height: 100%;
        .org-tree-container {
          height: 100%;
          width: 100%;
          ::v-deep .org-tree {
            margin: auto;
          }
        }
      }
    }
  }
}
</style>

