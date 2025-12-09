<template>
  <div @contextmenu.prevent="">
    <a-drawer
      title="视点"
      :width="300"
      placement="left"
      :maskClosable="false"
      :destroyOnClose="true"
      :mask="false"
      :visible="visible"
      :get-container="false"
      :wrap-style="{ position: 'absolute' }"
      @close="onClose"
      :bodyStyle="{ padding: '10px' }"
    >
      <div style="display: flex; justify-content: flex-end">
        <a-button v-show="folderPermission.hasEdit" type="primary" @click="addViewpoint" style="margin-bottom: 10px"
          >新增</a-button
        >
      </div>
      <div class="box">
        <vue-scroll>
          <a-table
            :columns="columns"
            :rowKey="(record) => record.id"
            :data-source="tableData"
            :pagination="false"
            @change="handleTableChange"
            :showHeader="false"
            :bordered="false"
            size="middle"
            :locale="{ emptyText: '暂无数据' }"
            :customRow="SelectViewpoint"
          >
            <div slot="renderViewName" slot-scope="text" :title="text" style="cursor: pointer;">
              {{ text }}
            </div>
            <div slot="renderAction" slot-scope="text, record">
              <a-popconfirm
                title="确定删除吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirm"
                :disabled="!folderPermission.hasEdit"
              >
                <a-button type="link" @click.stop="delNode(record)" :disabled="!folderPermission.hasEdit" size="small">
                  <a-icon type="delete" />
                </a-button>
              </a-popconfirm>
            </div>
          </a-table>
        </vue-scroll>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import ViewpointAdd from './ViewpointAdd.vue'
import { getViewpointList, deleteViewPoint } from '../../../api/engine'

export default {
  name: 'ViewpointList',
  components: {
    ViewpointAdd,
  },
  data() {
    return {
      columns: [
        {
          title: '视点名称',
          dataIndex: 'viewName',
          scopedSlots: { customRender: 'renderViewName' },
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'id',
          key: 'id',
          scopedSlots: { customRender: 'renderAction' },
          width: '50px',
          align: 'center',
        },
      ],
      tableData: [],
      pagination: { current: 1, pageSize: 1000 },
      visible: this.show,
      deleteNode: null,
      folderPermission: { hasRead: false, hasEdit: false },
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    projectMessage: {
      type: Object,
      default: undefined,
    },
  },
  mounted() {
    this.fetch()
    this.folderPermission.hasEdit=this.projectMessage.hasEdit
    if (this.folderPermission.hasEdit == false) {
      this.columns = [
        {
          title: '视点名称',
          dataIndex: 'viewName',
          scopedSlots: { customRender: 'renderViewName' },
          ellipsis: true,
        },
      ]
    }
  },
  methods: {
    fetch() {
      const that = this
      getViewpointList({
        MaxResultCount: this.pagination.pageSize,
        SkipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        modelId: that.projectMessage.id,
        projectId: that.projectMessage.projectId,
      }).then((res) => {
        const pagination = { ...this.pagination }
        pagination.total = res.totalCount
        res.items.forEach((el) => {
          delete el.children
        })
        this.tableData = res.items
        this.pagination = pagination
      })
    },

    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch()
    },

    resetCurrenPage() {
      const totalPage = Math.ceil((this.pagination.total - 1) / this.pagination.pageSize) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
    },

    onClose() {
      this.visible = false
      this.$emit('changeDrawer')
    },
    SelectViewpoint(item, index) {
      const that = this
      return {
        on: {
          click: () => {
            if (item.viewType == 1 && item.viewPosition != null) {
              try {
                var position = JSON.parse(item.viewPosition)
                that.$api.Camera.SetCamera(position.position, position.heading, position.pitch)
              } catch (e) {}
            }
          },
        },
      }
    },
    async delNode(item) {
      this.deleteNode = item
    },
    confirm(e) {
      const that = this
      deleteViewPoint(that.deleteNode.id).then((res) => {
        that.$message.info('删除成功')
        that.resetCurrenPage()
        that.fetch()
      })
    },
    addViewpoint() {
      const that = this
      that.$notification.open({
        key: 'EngineKey',
        message: `视点管理`,
        description: <viewpoint-add projectMessage={that.projectMessage} store={that.$store} fetch={that.fetch} />,
        class: 'engine-notification',
        duration: null,
        onClose: () => {},
      })
    },     
  },
}
</script>
<style lang="scss" scoped>
/deep/.ant-drawer-content{   
  background:#001529cc;
  .ant-drawer-header{
    background:#001529cc;
    border-bottom:1px solid #5a738b
  }
  .ant-drawer-title{
    color: #00ffc5;
  }
  .ant-drawer-close{
    color: #fff;
  }
}
/deep/.ant-tabs-nav-scroll{
  width: 100%;
  text-align: center;
}
/deep/.ant-tabs-nav-wrap{
  color: #fff;
}
/deep/.ant-table{
  .ant-table-placeholder{
    background-color: none;
    border-width: 0;
  }
  color:#fff;
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: #285681;
  } 
  a{
     color:#fff;
  }  
  .ant-table-tbody > tr > td{
    border-width: 0;    
  }  
}
/deep/.ant-table-middle > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td{
    padding: 6px 4px;
  }
.box{
  height: calc(100vh - 269px);     
}
/deep/.ant-table-placeholder{
  background: none;
  border-bottom-width: 0;
  color: #fff;
} 
</style>