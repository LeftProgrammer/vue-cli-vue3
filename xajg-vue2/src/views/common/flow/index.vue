<template>
  <div
    class="investGeneralPay"
    style="width: 100%; height: 100%; padding: 15px"
  >
    <TreeTableLayout
      :page="pageParams"
      :showExportBtn="false"
      @query="getTableData"
      @reset="reset"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
    >
      <template slot="form">
        <el-form :model="pageParams" :inline="true">
          <el-form-item label="流程名称:">
            <el-input v-model="pageParams.todoTitle" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="发起时间:">
            <el-input
              v-model="pageParams.startTimeAndEndTime"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
      </template>
      <!-- 新增按钮 -->
      <template slot="opratebtns">
        <el-button
          v-if="showSelect"
          type="primary"
          icon="el-icon-plus"
          @click="batchUrge"
        >
          批量催办
        </el-button>
      </template>
      <!-- 数据表格 -->
      <template slot="table">
        <div class="content">
          <div class="left-content">
            <div class="tree-wrapper" :style="{ width: treeWidth + 'px' }">
              <el-tree
                ref="tree"
                :highlight-current="true"
                class="tree"
                :data="treeData"
                @node-click="(data) => handelNodeClick(data)"
                :current-node-key="type"
                node-key="id"
              >
              </el-tree>
            </div>
            <DragLine @moveEnd="handelMoveEnd" :minMoveX="0"></DragLine>
          </div>
          <div class="table-wrapper">
            <el-table
              ref="multipleTable"
              :data="tableData"
              height="100%"
              border
              v-if="showTable"
              @selection-change="handleSelectionChange"
              @header-dragend="handleHeaderDragEnd"
            >
              <el-table-column
                v-if="showSelect"
                type="selection"
                width="55"
                align="center"
              />
              <el-table-column
                label="序号"
                type="index"
                :width="$calculateWidth(80)"
                align="center"
                :index="getIndex"
              />
              <el-table-column
                v-if="showUrge"
                label="页面名称"
                prop="pageName"
                align="left"
                min-width="180"
              />
              <el-table-column
                v-if="showUrge"
                label="催办节点"
                prop="nodeName"
                align="left"
                min-width="180"
              />
              <el-table-column
                v-if="showUrge"
                label="消息接收人"
                prop="receiver"
                align="left"
                width="120"
              />
              <el-table-column
                v-if="showUrge"
                label="催办时间"
                prop="urgeDate"
                align="center"
                width="180"
              >
                <template #default="{ row }">
                  <span>
                    {{ dateFormat(row.createTime, 'yyyy-MM-DD HH:mm:ss') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showUrge"
                label="催办说明"
                prop="urgeInfo"
                min-width="180"
                align="left"
              />
              <el-table-column
                v-if="showUrge"
                label="催办结果"
                prop="urgeResult"
                align="left"
                min-width="180"
              >
                <template #default="{ row }">
                  <span :style="{ color: row.urgeFlag !== '0' ? 'red' : '' }">
                    {{ row?.urgeResult || row.urgeResult || '' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!showUrge"
                label="流程名称"
                min-width="180"
                align="left"
              >
                <template slot-scope="{ row }">
                  <div>{{ getBusinessName(row) }}</div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="type === 'cc'"
                label="发起人"
                prop="createUserName"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  <span>
                    {{ row?.matter?.createUserName || row.startorName || '' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!showUrge"
                label="发起时间"
                align="center"
                width="180"
              >
                <template #default="{ row }">
                  <span>
                    {{ getStartTime(row) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="type === 'todo' || type === 'done'"
                label="到达时间"
                title="待办"
                prop="createTime"
                align="center"
                width="180"
              >
                <template #default="{ row }">
                  <span>
                    {{ dateFormat(row.createTime, 'yyyy-MM-DD HH:mm:ss') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="type === 'todo' || type === 'done'"
                label="当前节点"
                title="待办"
                prop="procTaskName"
                align="center"
                width="180"
              >
              </el-table-column>

              <el-table-column
                label="操作"
                v-if="!showUrge"
                prop="name"
                width="120"
                align="center"
              >
                <template #default="{ row }">
                  <el-link
                    v-if="type === 'todo' || type === 'wait'"
                    @click="todoHandle(row, 'edit')"
                    type="primary"
                  >
                    办理
                  </el-link>
                  <el-link
                    v-else
                    @click="todoHandle(row, 'view')"
                    type="primary"
                  >
                    查看
                  </el-link>
                  <span v-if="showSelect" style="margin: 5px">
                    <el-divider direction="vertical"></el-divider>
                    <el-link @click="urge(row)" type="primary"> 催办 </el-link>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="closeHandle"
    ></flow-dialog>
  </div>
</template>

<script>
import TreeTableLayout from '@/components/ContentLayout/TreeTable'
import { dateFormat, computeTimeDuration } from '@/utils'
import moment from 'moment'
import DragLine from '@/views/archives/shared_component/DragLine'
import { sendMessage } from './api'
import FlowDialog from '@/components/FlowHandle/Dialog'
import { page } from '@/api/common'
export default {
  name: 'flow',
  components: { TreeTableLayout, DragLine, FlowDialog },
  mixins: [],
  data() {
    return {
      pageParams: {
        total: 0,
        current: 1,

        pageSize: 20
      },
      showTable: true,
      tableData: [],
      flowInfo: {
        businessId: '',
        page: 'mine', //待办是todo，已办done，已发sent，
        status: ''
      },
      /**流程状态 */
      treeWidth: 267,
      treeData: [
        { label: '待发事项', id: 'wait' },
        { label: '待办事项', id: 'todo' },
        { label: '抄送给我', id: 'cc' },
        { label: '已办事项', id: 'done' },
        { label: '我发起的', id: 'sent' },
        { label: '我催办的', id: 'urge' }
      ], //
      dialogFormData: {},
      dialogReadonly: false,
      dialogTitle: '',
      type: 'wait',
      url: {
        list: '/api/process/packages/self/proc-task-page/todo', //api/process/packages/self/todo
        todolist: '/api/process/packages/self/proc-task-page/todo', //api/process/packages/self/todo
        cclist: '/api/process/packages/self/proc-page/cc',
        donelist: '/api/process/packages/self/proc-task-page/done', //已办事项 对应 已办任务
        sentlist: '/api/process/packages/self/proc-page/done', //我发起的 对应 已发
        urgelist: '/api/urge/result/page',
        waitlist: '/api/process/packages/self/proc-page/todo' //我发起的 对应 已发
      },
      readonly: false,
      flowShow: false,
      detailData: []
    }
  },
  computed: {
    userInfo() {
      return this.$getStorage('userInfo')
    },
    showUrge() {
      if (this.type === 'urge') {
        return true
      } else {
        return false
      }
    },
    /**流程数据传递key */
    storageTaskKey() {
      return 'flow_task_row_' + this.flowInfo.businessId + '_v2'
    },
    showSelect() {
      if (this.type === 'sent') {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    type: {
      handler(newValue, oldValue) {
        this.showTable = false
        this.$set(this.pageParams, 'todoTitle', '')
        this.$set(this.pageParams, 'matterSentStartTime', '')
        this.$set(this.pageParams, 'matterSentEndTime', '')
        this.$set(this.pageParams, 'current', 1)
        this.$set(this.pageParams, 'pageSize', 20)
        this.$set(this.pageParams, 'businessName', '')
        this.startTimeAndEndTime = []
        if (newValue != oldValue) {
          switch (newValue) {
            case 'wait':
              this.url.list = this.url.waitlist
              this.flowInfo.page = 'wait'
              break
            case 'todo':
              this.url.list = this.url.todolist
              this.flowInfo.page = 'todo'
              break
            case 'cc':
              this.url.list = this.url.cclist
              this.flowInfo.page = 'cc'
              break
            case 'done':
              this.url.list = this.url.donelist
              this.flowInfo.page = 'done'
              break
            case 'sent':
              this.url.list = this.url.sentlist
              this.flowInfo.page = 'sent'
              break
            case 'urge':
              this.url.list = this.url.urgelist
              this.flowInfo.page = 'urge'
              break
          }
          this.pageParams = Object.assign(this.pageParams, {
            size: 20,
            pageSize: 20,
            current: 1
          })
          this.getTableData()
          this.$nextTick(() => {
            this.showTable = true
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  mounted() {
    console.log(this.$route.query, '=====')
    if (this.$route.query.businessId) {
      this.$refs.tree.setCurrentKey('todo')
      this.handelNodeClick(
        { id: 'todo', label: '代办事项' },
        this.$route.query.businessId
      )
    }
  },

  methods: {
    dateFormat,
    moment,
    computeTimeDuration,
    handelPageSizeChange(page) {
      this.pageParams.current = 1
      this.pageParams.pageSize = page.pageSize
      this.getTableData()
    },
    handelCurrentChange(page) {
      this.pageParams.current = page.current
      this.getTableData()
    },
    /**
     * @description 点击左侧树
     * @param data
     * @param node
     * @param own
     */
    handelNodeClick(data, businessId) {
      console.log('🚀 ~ handelNodeClick ~ data:', data)
      this.type = data.id
      this.pageParams.current = 1
      switch (this.type) {
        case 'wait':
          this.url.list = this.url.waitlist
          this.flowInfo.page = 'wait'
          break
        case 'todo':
          this.url.list = this.url.todolist
          this.flowInfo.page = 'todo'
          break
        case 'cc':
          this.url.list = this.url.cclist
          this.flowInfo.page = 'cc'
          break
        case 'done':
          this.url.list = this.url.donelist
          this.flowInfo.page = 'done'
          break
        case 'sent':
          this.url.list = this.url.sentlist
          this.flowInfo.page = 'sent'
          break
        case 'urge':
          this.url.list = this.url.urgelist
          this.flowInfo.page = 'urge'
          break
      }
      this.getTableData({}, businessId)
    },

    handleSelectionChange(val) {
      const newData = []
      val.map((i) => {
        newData.push(
          Object.assign({}, { businessId: i.businessId, pacId: i.pacId })
        )
      })
      this.multipleSelection = newData
    },
    // 批量催办
    batchUrge() {
      this.sendMsg(this.multipleSelection)
    },
    // 催办
    urge(row) {
      this.sendMsg([row])
    },
    sendMsg(row) {
      this.$confirm(
        '确认催办？催办会给当前处理人发送提醒，此操作不可撤回。',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          sendMessage(row).then((res) => {
            console.log(res)
            if (res.success) {
              this.$message({
                type: 'success',
                message: '催办成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '催办失败：' + res.message
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消催办'
          })
        })
    },
    //获取开始时间
    getStartTime(row) {
      let time = ''
      if (this.type === 'done' || this.type === 'todo') {
        time = row.matter?.createTime || ''
      } else if (
        this.type === 'cc' ||
        this.type === 'wait' ||
        this.type === 'sent'
      ) {
        time = row.createTime
      }
      return dateFormat(time, 'yyyy-MM-DD HH:mm:ss')
    },
    // 获取流程名称
    getBusinessName(row) {
      if (this.type == 'todo') {
        return row.todoTitle || row.matter.businessName
        // return row.matter.businessName
      } else if (this.type == 'cc') {
        return row.todoTitle || row.businessName
      } else if (this.type == 'done') {
        return row.todoTitle || row.doneTitle
      } else if (this.type == 'sent') {
        return row.todoTitle || row.businessName
      } else if (this.type == 'wait') {
        return row.todoTitle || row.businessName
      } else {
        return ''
      }
    },
    /**弹窗关闭事件 */
    closeHandle() {
      localStorage.removeItem(this.storageTaskKey)
      this.flowShow = false
    },
    /**点击事件 */
    childEvtHandle() {
      // 更新待办数量
      this.$bus.emit('updateTodoNum')
      if (typeof this.getTableData === 'function') this.getTableData()
      this.flowShow = false
    },
    /**办理 */
    async todoHandle(row, type) {
      this.flowInfo.status = row.suspended
      this.flowInfo.taskId = row.procTaskId
      this.flowInfo.procTaskId = row.procTaskId
      this.flowInfo.businessId = row.businessId
      if (type == 'edit') {
        this.flowInfo.page = row.type || this.flowInfo.page
      } else {
        this.flowInfo.page = 'fine'
        this.$setStorage('flow_page_type', 'fine')
      }

      let flowConfigId =
        row.flowConfigId || (row.matter && row.matter.flowConfigId)

      this.flowInfo.flowConfigId = flowConfigId
      //移除业务列表中的缓存业务数据
      localStorage.removeItem(this.storageTaskKey)
      //添加待办任务的流程数据
      localStorage.setItem(
        this.storageTaskKey,
        JSON.stringify({ flowInfo: this.flowInfo })
      )
      this.flowShow = true
    },
    reset() {
      this.pageParams = {
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0
      }
      this.getTableData()
    },
    getTableData(pageInfo, businessId) {
      const pageParams = Object.assign(this.pageParams, pageInfo)
      if (pageParams.startTimeAndEndTime?.length > 0) {
        pageParams.matterSentStartTime = pageParams.startTimeAndEndTime[0]
        pageParams.matterSentEndTime = pageParams.startTimeAndEndTime[1]
        delete pageParams.startTimeAndEndTime
      }
      if (this.type == 'done') {
        pageParams.doneTitle = pageParams.todoTitle
      } else {
        pageParams.businessName = pageParams.todoTitle
      }
      if (businessId) pageParams.businessId = businessId
      else delete pageParams.businessId
      page(this.url.list, pageParams).then(async (res) => {
        if (res.success) {
          this.tableData = await this.loadAfter(
            this.pageParams,
            res.data.records
          )
          this.pageParams.total = res.data.total
          if (businessId) {
            this.todoHandle(res.data.records[0], 'edit')
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX
    },
    /**加载完成后事件 */
    async loadAfter(page, _tableData) {
      let tableData = [..._tableData]
      if (tableData && tableData.length > 0) {
        for (let i = 0; i < tableData.length; i++) {
          let row = tableData[i]
          let flowName = ''
          let startorName = ''
          let startorTime = ''
          let curNodeName = ''
          let title = row.title || row.flowName || row.businessName
          if (title) {
            row.title = title
            let endTime = this.dateFormat(
              row.matter && row.matter.createTime,
              'yyyy-MM-DD HH:mm:ss'
            )

            let index1 = title.indexOf('-')
            let index2 = title.indexOf('（')
            let index3 = title.indexOf(' ')
            let index4 = title.indexOf('）')
            flowName = title.substring(0, index1)
            startorName =
              row.createUserName || title.substring(index2 + 1, index3)
            startorTime = title.substring(index3 + 1, index4) || endTime
            if (title.indexOf('：') >= 0) {
              let index5 = title.indexOf('：')
              curNodeName = title.substring(index5 + 1, title.length)
            }
            row.flowName = flowName
            row.startorName = startorName
            row.startorTime = startorTime
            row.curNodeName = curNodeName
            if (startorTime && endTime) {
              let { days } = this.computeTimeDuration(startorTime, endTime)
              row.takeTime = days + 1
            }
          }
        }
      }
      console.log('tableData middle', tableData)
      this.pageParams = { ...page }
      return tableData
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
    }
  }
}
</script>

<style scoped lang="scss">
.investGeneralPay {
  height: 100%;
  overflow: hidden;
  color: #fff;
  .content {
    width: 100%;
    display: flex;
    height: 100%;

    .left-content {
      height: 100%;
      position: relative;
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
      overflow-y: auto;
      border: #e5e5e5 1px solid;
    }
    .table-wrapper {
      flex: 1;
      width: 0;
    }
  }
}
</style>
