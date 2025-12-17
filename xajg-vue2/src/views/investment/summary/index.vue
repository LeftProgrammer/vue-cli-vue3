<template>
  <div class="page-compare">
    <TreeTableLayout
      :showPage="false"
      class="full-height-layout"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
    >
      <template slot="opratebtns">
        <el-button type="primary" @click="lockFun">
          {{ isLock ? '解锁' : '锁定' }}
        </el-button>
        <el-button :disabled="!isLock" @click="viewFile"> 预览 </el-button>
        <el-button @click="handelExport" :disabled="!isLock"> 导出 </el-button>
      </template>
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="项目名称">
            <el-input
              v-model="searchData.name"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="table">
        <div class="content">
          <div class="left-content">
            <div class="tree-wrapper" :style="{ width: treeWidth + 'px' }">
              <div class="tree-toolbar">
                <el-date-picker
                  v-model="selectedYear"
                  type="year"
                  placeholder="选择年"
                  @change="handelYearChange"
                />
              </div>
              <el-tree
                ref="tree"
                :key="treeRefreshKey"
                :highlight-current="true"
                class="tree"
                :data="treeData"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                node-key="id"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              >
                <span
                  slot-scope="{ data, node }"
                  class="custom-tree-node"
                  :title="node.label"
                >
                  <i style="color: #014acb" :class="getNodeIcon(data)" />
                  <el-tooltip
                    effect="dark"
                    :content="node.label"
                    placement="top"
                  >
                    <span>{{ node.label }}</span>
                  </el-tooltip>
                </span>
              </el-tree>
            </div>
            <DragLine @moveEnd="handelMoveEnd" :minMoveX="0" />
          </div>

          <div class="table-wrapper">
            <el-table :data="tableData" stripe height="100%" border>
              <el-table-column
                label="编码"
                prop="code"
                fixed="left"
                align="center"
                width="60"
              />

              <el-table-column
                prop="name"
                label="项目名称"
                show-overflow-tooltip
                fixed="left"
                align="left"
                width="140"
                header-align="center"
              />

              <el-table-column
                prop="totalInvestmentAmount"
                label="年度计划完成投资（万元）"
                align="right"
                fixed="left"
                header-align="center"
                width="120"
              >
                <template #default="{ row }">
                  {{ monthData.totalPlanByCode[row.code] }}
                </template>
              </el-table-column>

              <el-table-column
                v-for="(m, i) in 12"
                :key="m"
                :label="`${m}月`"
                align="center"
                header-align="center"
              >
                <el-table-column label="计划完成目标" align="right" width="120">
                  <template #default="{ row }">
                    {{
                      monthData.planByCodeMonth[row.code]
                        ? monthData.planByCodeMonth[row.code][i]
                        : ''
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="实际完成目标" align="right" width="120">
                  <template #default="{ row }">
                    {{
                      monthData.actualByCodeMonth[row.code]
                        ? monthData.actualByCodeMonth[row.code][i]
                        : ''
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="差额" align="right">
                  <template #default="{ row }">
                    {{
                      (monthData.actualByCodeMonth[row.code]
                        ? monthData.actualByCodeMonth[row.code][i]
                        : 0) -
                      (monthData.planByCodeMonth[row.code]
                        ? monthData.planByCodeMonth[row.code][i]
                        : 0)
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="完成率" align="right">
                  <template #default="{ row }">
                    {{
                      (
                        monthData.planByCodeMonth[row.code]
                          ? monthData.planByCodeMonth[row.code][i]
                          : 0
                      )
                        ? Math.ceil(
                            ((monthData.actualByCodeMonth[row.code]
                              ? monthData.actualByCodeMonth[row.code][i]
                              : 0) /
                              (monthData.planByCodeMonth[row.code]
                                ? monthData.planByCodeMonth[row.code][i]
                                : 0)) *
                              100
                          ) + '%'
                        : 0
                    }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                label="累计完成投资"
                fixed="right"
                align="right"
                width="120"
              >
                <template #default="{ row }">
                  {{
                    monthData.actualByCodeMonth[row.code]
                      ? monthData.actualByCodeMonth[row.code].reduce(
                          (a, b) => a + Number(b || 0),
                          0
                        )
                      : ''
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="计划投资完成率"
                fixed="right"
                width="120"
                align="right"
              >
                <template #default="{ row }">
                  {{
                    (
                      monthData.planByCodeMonth[row.code]
                        ? monthData.planByCodeMonth[row.code].reduce(
                            (a, b) => a + Number(b || 0),
                            0
                          )
                        : 0
                    )
                      ? Math.ceil(
                          ((monthData.actualByCodeMonth[row.code]
                            ? monthData.actualByCodeMonth[row.code].reduce(
                                (a, b) => a + Number(b || 0),
                                0
                              )
                            : 0) /
                            (monthData.planByCodeMonth[row.code]
                              ? monthData.planByCodeMonth[row.code].reduce(
                                  (a, b) => a + Number(b || 0),
                                  0
                                )
                              : 0)) *
                            100
                        ) + '%'
                      : 0
                  }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>

    <DataForm
      :visible="showItemDialog"
      :title="'概算执行详情'"
      :investmentYear="selectedYear"
      :oprateRow="{ data: formData, isView: false }"
      :type="'edit'"
      @ok="handleSaveSuccess"
      @closed="closeItemDialog"
    />
    <el-dialog
      v-draggable
      :title="viewFileName"
      :visible.sync="dialogShow"
      :destroy-on-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      custom-class="view-file-dialog"
      :append-to-body="true"
      :fullscreen="true"
    >
      <VueOfficeExcel :src="url" style="height: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import VueOfficeExcel from '@vue-office/excel'
import {
  list,
  lock,
  getInvestmentCategoryTree,
  exportUrl,
  lockStatus,
  unlock
} from './api'
import { FlowListMixin } from '@/mixins/FlowListMixin'
import { dateFormat } from '@/utils'
import DataForm from './dataform.vue'
import moment from 'moment'
import DragLine from '@/views/archives/shared_component/DragLine'
import TreeTableLayout from '@/components/ContentLayout/TreeTable'
export default {
  name: 'investmentPlan',
  // mixins: [FlowListMixin],
  components: {
    TreeTableLayout,
    DragLine,
    VueOfficeExcel,
    DataForm
  },
  data() {
    return {
      priceUnit: '元',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      searchData: {},
      tableData: [],
      selectionNode: {},
      date: [],
      treeWidth: 267,
      selectedYear: new Date(),
      showItemDialog: false,
      treeRefreshKey: 0,
      settlementRecordDetailSubs: [],
      formData: {},
      monthData: {},
      isLock: false,
      dialogShow: false,
      viewFileName: '',
      url: ''
    }
  },

  mounted() {
    this.getTreeData()
    lockStatus({ year: moment(this.selectedYear).format('YYYY') }).then(
      (res) => {
        this.isLock = res.data == 1
      }
    )
  },
  methods: {
    dateFormat,
    moment,
    closeItemDialog() {
      this.showItemDialog = false
    },
    handelYearChange() {
      this.getTreeData()
    },
    getTreeData() {
      getInvestmentCategoryTree({
        year: moment(this.selectedYear).format('YYYY')
      }).then((res) => {
        if (res.success) {
          this.treeData = res.data
          this.treeRefreshKey++
          if (this.treeData.length > 0) {
            this.handleNodeClick(this.treeData[0])
          }
        } else {
          this.treeData = []
          this.treeRefreshKey++
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      const labelKey = this.defaultProps.label || 'label'
      const text = data[labelKey] || ''
      return text.indexOf(value) !== -1
    },
    getNodeIcon(data) {
      if (data.nodeType === 'item') {
        // 为项目类型节点显示文档图标
        return 'el-icon-document'
      } else if (data.children && data.children.length > 0) {
        // 有子节点的树显示打开的文件夹
        return 'el-icon-folder-opened'
      } else {
        // 无子节点的树显示关闭的文件夹
        return 'el-icon-folder'
      }
    },
    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX
    },
    handleNodeClick(data) {
      this.selectionNode = data
      const rows = this.flattenSubtree(data)
      this.tableData = rows.map((x) => {
        return { code: x.code, name: x.name, investmentPlanDetails: [] }
      })
      this.getTableData()
    },
    flattenSubtree(root) {
      const rows = []
      const visit = (node, path) => {
        const displayIndex = path.join('.')
        const level = path.length - 1
        const row = { ...node, displayIndex, level }
        rows.push(row)
        const children = Array.isArray(node.children) ? node.children : []
        for (let i = 0; i < children.length; i++) {
          visit(children[i], path.concat(i + 1))
        }
      }
      visit(root, [1])
      return rows
    },
    handelSearchButtonClick() {
      this.getTableData()
    },
    handelResetButtonClick() {
      this.pageParams = {}
      this.getTableData()
    },
    handleSaveSuccess() {
      this.getTableData()
    },

    closedDialog() {
      this.oprateRow.dialogShow = false
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout()
      })
    },
    reset() {
      this.getTableData()
    },
    getTableData() {
      list({
        code: this.selectionNode.code,
        name: this.searchData.name,
        year: moment(this.selectedYear).format('YYYY')
      }).then((res) => {
        console.log('🚀 ~ res:', res)
        if (res.success) {
          this.monthData = res.data || {
            actualByCodeMonth: {}, //每月实际
            planByCodeMonth: {}, //每月计划
            totalPlanByCode: {} //每月计划总和
          }
        }
      })
    },
    lockFun() {
      let http = this.isLock
        ? unlock(moment(this.selectedYear).format('YYYY'))
        : lock(moment(this.selectedYear).format('YYYY'))
      http.then((res) => {
        this.$message.info(res.data)
        lockStatus({ year: moment(this.selectedYear).format('YYYY') }).then(
          (res) => {
            this.isLock = res.data == 1
          }
        )
      })
    },
    async viewFile() {
      exportUrl({ year: moment(this.selectedYear).format('YYYY') }).then(
        (res) => {
          this.viewFileName = res.data.fileName
          this.url =
            window.location.origin +
            new URL(res.data.requestRelativeUrl).pathname +
            new URL(res.data.requestRelativeUrl).search
          this.dialogShow = true
        }
      )
    },
    handelExport() {
      exportUrl({ year: moment(this.selectedYear).format('YYYY') }).then(
        (res) => {
          window.open(
            window.location.origin +
              new URL(res.data.requestRelativeUrl).pathname +
              new URL(res.data.requestRelativeUrl).search
          )
        }
      )
    }
  }
}
</script>

<style scoped lang="scss">
.page-compare {
  height: 100%;
  // overflow: hidden;
  // display: flex;
  // flex-direction: column;

  // .full-height-layout {
  //   height: 100%;
  //   display: flex;
  //   flex-direction: column;
  // }

  // 确保内容区域占满所有可用空间
  // /deep/ .tree-table-layout {
  //   display: flex;
  //   flex-direction: column;
  //   height: 100%;
  //   overflow: hidden;
  // }

  // // 确保表单区域不会超出显示范围
  // /deep/ .search-area {
  //   flex-shrink: 0; // 不缩小
  // }

  // // 让内容区域自动填充剩余空间
  // /deep/ .content-area {
  //   flex: 1;
  //   display: flex;
  //   flex-direction: column;
  //   overflow: hidden;
  //   min-height: 0; // 解决flex布局中的滚动问题
  // }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    gap: 16px;

    .left-content {
      height: 100%;
      position: relative;
      flex-shrink: 0; // 不压缩左侧宽度
      /deep/ .el-tree-node__content {
        .custom-tree-node {
          flex: 1;
          overflow: hidden;
          display: flex;
          span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      &:hover {
        .drag-line {
          width: 5px;
          background-color: #e4e1e1;
        }
      }
    }

    .tree-wrapper {
      width: 100%;
      height: 100%;
      padding-right: 10px;
      border: #e5e5e5 1px solid;
      .tree-toolbar {
        padding: 8px 8px 8px 8px;
      }
      .el-tree {
        height: calc(100% - 52px) !important;
      }
    }

    .table-wrapper {
      flex: 1;
      min-width: 0; // 让flex子项能够正确处理overflow
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      // 使表格填充容器并显示滚动条
      /deep/ .el-table {
        height: 100% !important;

        .el-table__body-wrapper {
          height: calc(100% - 115px) !important; // 减去表头高度
          overflow-y: auto !important; // 强制显示滚动条
        }
      }
    }
  }

  // 其他样式保持不变
  // .command-content {
  //   position: absolute;
  //   right: 0px;
  //   z-index: 1;
  // }

  // .tree-wrapper {
  //   width: 267px;
  //   float: left;
  //   height: 100%;
  //   border: #e5e5e5 1px solid;

  //   .tree-inner-wrapper {
  //     width: 100%;
  //     box-sizing: border-box;
  //     padding: 10px;
  //     height: 100%;
  //     overflow-y: hidden;

  //     .tree {
  //       overflow: auto;
  //       height: calc(100% - 80px);
  //       background-color: unset;
  //       color: #515b81;
  //       margin-top: 10px;

  //       .tree-icon {
  //         margin-right: 5px;

  //         &.el-icon-folder {
  //           color: #35a5ff;
  //         }

  //         &.el-icon-tickets {
  //           color: #ff6601;
  //         }
  //       }
  //     }
  //   }
  // }

  // .table-btn {
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   gap: 10px;
  // }
}
</style>
