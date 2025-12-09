<template>
  <div class="side-frame">
    <a-card size="small" :bordered="false">
      <a-form :form="form" class="view-box">
        <a-form-item label="名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-input placeholder="请输入" v-decorator="['title', { rules: [{ required: true, message: '请输入!' }] }]" />
        </a-form-item>
        <a-form-item
          v-show="false"
          label="目录"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          style="margin-bottom: 0"
        >
          <a-form-item :style="{ display: 'inline-block', width: 'calc(100% - 24px)' }">
            <a-tree-select
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择"
              tree-default-expand-all
              allow-clear
              v-decorator="['category', { rules: [{ required: false, message: '请输选择!' }] }]"
              :tree-data="treeData"
              :replace-fields="replaceFields"
            >
            </a-tree-select>
          </a-form-item>
          <a-form-item :style="{ display: 'inline-block', width: '24px' }">
            <a-button title="创建文件夹" @click="addFolder" size="small" icon="plus"></a-button>
          </a-form-item>
        </a-form-item>

        <a-form-item label="附加资料" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-upload
            accept="application/msword,image/jpeg,audio/mp4,video/mp4,application/pdf,image/png,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            name="file"
            :multiple="false"
            :customRequest="handleRequest"
            @change="handleChange"
            :file-list="fileList"
            :remove="handleRemove"
          >
            <a-button> <a-icon type="upload" /> 上传文件</a-button>
          </a-upload>
        </a-form-item>

        <a-form-item>
          <div style="text-align: center">
            <img :src="base64image" style="width: 100%; border: 1px solid #dfdfdf" />
          </div>
        </a-form-item>
        <a-form-item>
          <a-button block type="primary" @click="submitViewpoint" :disabled="disabledBtnViewPoint">保存视点</a-button>
          <!-- <a-upload name="file" :accept="'.xml'" :showUploadList="false" :customRequest="uploadXML" style="width: 40%">
              <a-button class="btn-view">导入视点</a-button>
            </a-upload> -->
        </a-form-item>
      </a-form>
    </a-card>
    <a-modal
      title="新增文件夹"
      :width="400"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="submitFolder"
      @cancel="handleCancel"
      cancel-text="取消"
      ok-text="确定"
    >
      <a-form :form="formFolder">
        <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input placeholder="请输入" v-decorator="['title', { rules: [{ required: true, message: '请输入!' }] }]" />
        </a-form-item>
        <a-form-item label="目录" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-tree-select
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择"
            tree-default-expand-all
            allow-clear
            v-decorator="['category', { rules: [{ required: false, message: '请输选择!' }] }]"
            :tree-data="treeData"
            :replace-fields="replaceFields"
          >
          </a-tree-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { getViewpointData, importViewpoint, setViewpointData } from '@/components/BimEngine/api/engine'
import { uploadFile } from '@/components/BimEngine/api/file'
export default {
  components: {},
  name: 'Viewpoint',
  props: {
    projectMessage: {
      type: Object,
      default: null,
    },
    store: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      disabledBtnViewPoint: false,
      confirmLoading: false,
      visible: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      formFolder: this.$form.createForm(this, { name: 'coordinated2' }),
      treeData: [],
      replaceFields: {
        title: 'viewName',
        key: 'id',
        value: 'id',
      },
      base64image: '',
      fileList: [], //
      fileArray: [], //附加文件Ids
    }
  },
  async mounted() {
    await this.GetViewpointNode()
  },
  methods: {
    async GetViewpointNode() {
      //视点结构树数据
      const that = this
      that.treeData = []
      getViewpointData({
        modelId: that.projectMessage.id,
        projectId: that.projectMessage.projectId,
        viewType: 0,
      }).then((res) => {
        that.treeData = that.filterMenu(res)
      })
      const element1 = document.getElementById('cesiumContainer')
      const canvas = element1.getElementsByTagName('canvas')
      that.base64image = canvas[0].toDataURL()
    },
    submitViewpoint(e) {
      const that = this
      e.preventDefault()
      that.form.validateFields((err, values) => {
        if (!err) {
          that.disabledBtnViewPoint = true
          var viewpoint = that.$api.Camera.GetCamera()
          //上传图片
          var bolb = that.convertBase64UrlToBlob(that.base64image)
          uploadFile(bolb).then((blobName) => {
            var fid = ''
            if (this.fileArray.length > 0) {
              fid = this.fileArray[0].fid
            }
            setViewpointData({
              modelId: that.projectMessage.id,
              projectId: that.projectMessage.projectId,
              parentId: values.category,
              viewName: values.title,
              viewType: 1,
              imgPath: blobName,
              viewPosition: JSON.stringify(viewpoint),
              remark: fid, //附加资料
            }).then((res) => {
              that.$message.success('保存成功')
              that.form.resetFields() //清空表单
              that.disabledBtnViewPoint = false
              that.$notification.close('EngineKey')
            })
          })
        }
      })
    },
    //保存文件夹
    submitFolder(e) {
      const that = this
      e.preventDefault()
      this.formFolder.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          setViewpointData({
            modelId: that.projectMessage.id,
            projectId: that.projectMessage.projectId,
            parentId: values.category,
            viewName: values.title,
            viewType: 0,
          }).then((res) => {
            that.confirmLoading = false
            that.visible = false
            that.$message.success('保存成功')
            that.formFolder.resetFields() //清空表单
            that.GetViewpointNode()
          })
        }
      })
    },
    addFolder() {
      const that = this
      that.visible = true
    },
    handleCancel() {
      const that = this
      that.visible = false
    },
    async uploadXML({ file }) {
      const formData = new FormData()
      formData.append('file', file, file.name)
      await importViewpoint(formData)
    },
    filterMenu(tree) {
      var newArr = []
      for (var i = 0; i < tree.length; i++) {
        var item = tree[i]
        if (item.viewType == 0) {
          if (item.children) {
            item.children = this.filterMenu(item.children)
          }
          newArr.push(item)
        }
      }
      return newArr
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
    handleChange(info) {
      const that = this
      that.fileList = [...info.fileList]
    },
    handleRequest(options) {
      const that = this
      const formData = new FormData()
      formData.append('file', options.file)
      uploadFile(formData)
        .then((res) => {
          that.fileArray.push({ fid: res, uid: options.file.uid })
          options.onSuccess(res, options.file)
        })
        .catch((err) => {
          that.$message.error('上传失败，请稍后再试。')
        })
    },
    handleRemove(file) {
      const that = this
      that.fileArray.forEach((item, index) => {
        if (file.uid == item.uid) {
          that.fileArray.splice(index, 1)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/.view-box{
 .ant-select-selection {
    background: none;
  }
  .ant-select {
    color: #fff;    
  }
}
/deep/.ant-upload-list{
   color: #bfbfbf;
 }
</style>