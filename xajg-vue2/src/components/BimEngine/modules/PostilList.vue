<template>
  <div @contextmenu.prevent="">
    <div style="display: flex; justify-content: flex-end">
      <a-button type="primary" @click="addComments" style="margin: 15px 0">新建问题</a-button>
    </div>
    <div>
      <vue-scroll>
        <a-table
          :columns="columns"
          :rowKey="(record) => record.id"
          :data-source="tableData"
          :pagination="false"
          @change="handleTableChange"
          :bordered="false"
          size="middle"
          :locale="{ emptyText: '暂无数据' }"
          :customRow="selectViewpoint"
        >
          <div slot="renderFileName" slot-scope="text, record" :title="record.title">
            {{ record.title }}
          </div>
          <div slot="renderAction" slot-scope="text, record">
            <!-- <a-button type="link" @click="openView(record)" size="small" title="编辑">
              <a-icon type="edit" />
            </a-button> -->
            <a-popconfirm title="确定删除吗？" :overlayStyle="{width: '200px'}" ok-text="确定" cancel-text="取消" @confirm="confirm(record)">
              <a-button type="link" size="small" title="删除">
                <a-icon type="delete" />
              </a-button>
            </a-popconfirm>
          </div>  
        </a-table>
      </vue-scroll>
    </div>
    <mark-page ref="markpage" @saveEventName="saveComments"></mark-page>
    <a-modal
      title="新建问题"
      :width="600"
      :visible="visibleNewAnnotation"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
      :zIndex="1000"
    >
      <a-form-model
        ref="ruleForm"
        layout="horizontal"
        :model="formData"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item label="批注标题" required prop="title">
          <a-input v-model="formData.title" :maxLength="50" :allowClear="true" placeholder="批注标题"> </a-input>
        </a-form-model-item>
        <a-form-model-item label="问题描述" prop="describe">
          <a-textarea v-model="formData.describe" style="height: 50px" placeholder="问题描述" />
        </a-form-model-item>
        <a-form-model-item label="处理建议" required prop="advise">
          <a-textarea v-model="formData.advise" style="height: 50px" placeholder="处理建议" />
        </a-form-model-item>
        <a-form-model-item label="缩略图">
          <img class="thumbnailImg" :src="thumbnail" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: '批注标题',
    dataIndex: 'title',
    key: 'title',
    scopedSlots: { customRender: 'renderFileName' },
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: { customRender: 'renderAction' },
    width: '100px',
    align: 'center',
  },
]
import MarkPage from './MarkPage.vue'
import { savePostil, getPostilList, getPositil, deletePostil, saveTask } from '@/components/BimEngine/api/postil'
import { uploadFile, getFileByBlobName } from '@/components/BimEngine/api/file'
export default {
  name: 'PostilList',
  components: {
    MarkPage,
  },
  data() {
    return {
      columns,
      tableData: [],
      pagination: { current: 1, pageSize: 20 },
      visible: this.show,
      deleteNode: null,      
      visibleNewAnnotation: false, //批注问题弹窗
      formData: {
        title: undefined,  
        priority: '0', //优先级
        describe: undefined, //问题描述
        advise: undefined, //处理建议
        viewPosition: undefined, //视角
      },
      thumbnail: undefined, //缩略图
      rules: {
        title: [
          { required: true, message: '请输入批注标题', trigger: ['change', 'blur'] },
          { max: 50, message: '最多输入50个字符', trigger: ['change', 'blur'] },
        ],
        describe: [{ max: 500, message: '最多输入500个字符', trigger: ['change', 'blur'] }],
        advise: [
          { required: true, message: '请输入处理建议', trigger: ['change', 'blur'] },
          { max: 200, message: '最多输入200个字符', trigger: ['change', 'blur'] },
        ],
      },
      closedTotal: 0, //关闭数
      widthScreen: 300,
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
  },
  methods: {
    fetch() {
      const that = this
      getPostilList({
        MaxResultCount: this.pagination.pageSize,
        SkipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        docId: that.projectMessage.id,
      }).then((res) => {
        const pagination = { ...this.pagination }
        pagination.total = res.totalCount
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

    // resetCurrenPage() {
    //   const totalPage = Math.ceil((this.pagination.total - 1) / this.pagination.pageSize) // 总页数
    //   this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
    //   this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
    // },

    onClose() {
      this.visible = false
      this.$emit('changeDrawer')
    },   
    selectViewpoint(item, index) {
      const that = this
      return {
        on: {
          click: () => {
            if (item.viewPosition != null) {
              try {
                var position = JSON.parse(item.viewPosition)
                window.api.Camera.SetCamera(position.position, position.heading, position.pitch)
              } catch (e) {}
            }
          },
        },
      }
    },
    addComments() {
      const that = this
      that.$refs.markpage.OpenStatusMonitoring()
    },
    saveComments(data) {
      this.formData = {
        title: undefined,  
        priority: '0', //优先级
        describe: undefined, //问题描述
        advise: undefined, //处理建议
        viewPosition: undefined, //视角
      },
      this.visibleNewAnnotation = true
      this.formData.viewPosition = JSON.stringify(data.viewPosition)
      this.thumbnail = data.img
    },
    handleOk() {
      const that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //上传图片
          var bolb = this.convertBase64UrlToBlob(this.thumbnail)
          uploadFile(bolb).then((blobName) => {
            //保存表单
            that.formData.imgPath = blobName
            that.formData.projectId = that.projectMessage.projectId
            that.formData.docId = that.projectMessage.id
            that.formData.postilTasks = [
              {
                opinion: that.formData.advise,
              },
            ]
            that.formData.sceneType = that.projectMessage.sceneType
            that.formData.viewPosition = JSON.stringify(window.api.Camera.GetCamera())
            savePostil(that.formData).then((res) => {
              if (res) {
                that.$message.success('保存成功!')
                that.$refs.markpage.SortClickNew('cancel') //关闭画板
                that.fetch()
              } else {
                that.$message.error('保存失败')
              }
              that.visibleNewAnnotation = false
              that.$refs.ruleForm.resetFields() //清空表单
            })
          })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.visibleNewAnnotation = false
    },
    convertBase64UrlToBlob(urlData) {
      const fd = new FormData()
      var bytes = window.atob(urlData.split(',')[1]) //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: 'image/png' })
      fd.append('file', blob, new Date().getTime() + '.png')
      return fd
    },
    async openView(record){
      getPositil(record.id).then((ret) =>{
        this.visibleNewAnnotation = true
        this.formData = ret;
        this.formData.viewPosition = JSON.parse(ret.viewPosition)
        this.thumbnail = getFileByBlobName(ret.imgPath)
      })
    },
    confirm(record){
      const that = this
      deletePostil(record.id).then((res) => {
        that.$message.success('删除成功')
        that.fetch()
      })
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/.ant-drawer-content {
  background: #001529cc;
  .ant-drawer-header {
    background: #001529cc;
    border-bottom: 1px solid #5a738b;
  }
  .ant-drawer-title {
    color: #00ffc5;
  }
  .ant-drawer-close {
    color: #fff;
  }
}
/deep/.ant-tabs-nav-scroll {
  width: 100%;
  text-align: center;
}
/deep/.ant-tabs-nav-wrap {
  color: #fff;
}
/deep/.ant-table {
  .ant-table-placeholder {
    background-color: none;
    border-width: 0;
  }
  color: #fff;
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: #285681;
  }
  a {
    color: #fff;
  }
  .ant-table-tbody > tr > td {
    border-width: 0;
  }
}
/deep/.ant-table-middle > .ant-table-content > .ant-table-body > table > .ant-table-thead > tr > th {
  padding: 8px 6px;
}
/deep/.ant-table-middle > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td {
  padding: 6px 4px;
}
/deep/.ant-table-placeholder {
  background: none;
  border-bottom-width: 0;
  color: #fff;
}
.thumbnailImg {
  width: 100%;
  height: 200px;
}
</style>
