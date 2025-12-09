<template>
  <div ref="wrap">
    <a-card size="small" :bordered="false" class="card-custom-style">
      <a-space>
        <a-button ghost @click="CreateViewpoint">创建视点</a-button>
      </a-space>
      <a-list size="small" :data-source="viewpointList" :locale="{ emptyText: `暂无视点数据` }"
        class="viewpoint-list scroll-box">
        <a-list-item slot="renderItem" slot-scope="item,index">
          <a-space @click="ZoomViewpoint(item)" class="viewpoint-title">{{ item.viewName }}</a-space>
          <a-space slot="actions">
            <el-tooltip title="删除">
              <a-icon type="delete" @click="DelViewpoint(item, index)" />
            </el-tooltip>
          </a-space>
        </a-list-item>
      </a-list>
    </a-card>
    <a-modal title="保存视点" :width="340" :visible="visible" :confirm-loading="confirmLoading" @ok="SaveViewpoint"
      @cancel="handleCancel" cancel-text="取消" ok-text="确定" :getContainer="() => this.$refs.wrap">
      <a-form :form="formFolder">
        <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input placeholder="请输入" v-decorator="['title', { rules: [{ required: true, message: '请输入!' }] }]" />
        </a-form-item>
        <a-form-item label="缩略图" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <img :src="thumbnail" class="thumbnail-style">
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { getViewpointList, setViewpointData, deleteViewPoint } from '@/components/BimEngine/api/engine'
import { uploadFile } from '@/components/BimEngine/api/file'
export default {
  props: {
    projectMessage: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      formFolder: this.$form.createForm(this, { name: 'coordinated2' }),
      thumbnail: undefined,
      viewpointList: [],
      pagination: { current: 1, pageSize: 1000 },
    }
  },
  mounted() {
    const that = this
    that.formFolder.resetFields() //清空表单
    getViewpointList({
      MaxResultCount: that.pagination.pageSize,
      SkipCount: (that.pagination.current - 1) * that.pagination.pageSize,
      modelId: that.projectMessage.id,
      projectId: that.projectMessage.projectId,
    }).then((res) => {
      const pagination = { ...that.pagination }
      pagination.total = res.totalCount
      res.items.forEach((el) => {
        delete el.children
      })
      that.viewpointList = res.items
      that.pagination = pagination
    })
  },
  methods: {
    CreateViewpoint() {
      const that = this;
      api.Camera.saveScreenShot(function (base64image) {
        that.thumbnail = base64image
        that.visible = true
      });
    },
    SaveViewpoint(e) {
      const that = this
      e.preventDefault()
      that.formFolder.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          var viewpoint = api.Camera.getViewPort()
          //上传图片
          var bolb = that.convertBase64UrlToBlob(that.thumbnail)
          uploadFile(bolb).then((blobName) => {
            setViewpointData({
              modelId: that.projectMessage.id,
              projectId: that.projectMessage.projectId,
              viewName: values.title,
              viewType: 1,
              imgPath: blobName,
              viewPosition: JSON.stringify(viewpoint),
            }).then((res) => {
              that.viewpointList.push(res)
              that.confirmLoading = false
              that.$message.success('视点创建成功')
              that.formFolder.resetFields() //清空表单
              that.visible = false
            })
          })
        }
      })
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
    handleCancel() {
      const that = this
      that.visible = false
    },
    DelViewpoint(data, index) {
      const that = this
      deleteViewPoint(data.id).then((res) => {
        that.$message.success('视点删除成功')
        that.viewpointList.splice(index, 1)
      })
    },
    ZoomViewpoint(item) {
      let viewpoint = JSON.parse(item.viewPosition)
      api.Camera.setViewPort(viewpoint.position, viewpoint.heading, viewpoint.pitch);
    }
  }
}
</script>

<style lang="scss" scoped>
.thumbnail-style {
  width: 100%;
  // height: 200px;
}

.viewpoint-list {
  margin-top: 15px;
  height: 48vh;
  overflow-y: auto;
}

/deep/.ant-list-item {
  padding: 8px 5px;

  .viewpoint-title {
    width: 70%;
    cursor: pointer;

    .ant-space-item {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>