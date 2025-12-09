<template>
  <div class="side-frame" @contextmenu.prevent="">
    <a-card size="small" :bordered="false">
      <a-form :form="form" class="view-box">
        <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input placeholder="请输入" v-decorator="['title', { rules: [{ required: true, message: '请输入!' }] }]" />
        </a-form-item>
        <a-form-item v-show="false" label="目录" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-form-item>
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
        </a-form-item>
        <a-form-item>
          <div style="text-align: center">
            <img :src="base64image" style="width: 100%; border: 1px solid #dfdfdf" />
          </div>
        </a-form-item>
        <a-form-item>
          <a-button block type="primary" @click="submitViewpoint" :disabled="disabledBtnViewPoint">保存视点</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script>
import { setViewpointData } from '@/components/BimEngine/api/engine'
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
    fetch: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      disabledBtnViewPoint: false,
      confirmLoading: false,
      visible: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      treeData: [],
      replaceFields: {
        title: 'viewName',
        key: 'id',
        value: 'id',
      },
      base64image: '',
    }
  },
  async mounted() {
    await this.GetViewpointImg()
    //监听滑轮
    window.addEventListener(
      'mousewheel',
      () => {
        this.GetViewpointImg()
      },
      false
    )
    //监听鼠标移动
    window.addEventListener(
      'mousemove',
      () => {
        this.GetViewpointImg()
      },
      false
    )
  },
  methods: {
    async GetViewpointImg() {
      const that = this
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
            setViewpointData({
              modelId: that.projectMessage.id,
              projectId: that.projectMessage.projectId,
              parentId: values.category,
              viewName: values.title,
              viewType: 1,
              imgPath: blobName,
              viewPosition: JSON.stringify(viewpoint),
            }).then((res) => {
              that.$message.success('保存成功')
              that.form.resetFields() //清空表单
              that.disabledBtnViewPoint = false
              that.$notification.close('EngineKey')
              that.fetch() //更新列表
            })
          })
        }
      })
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
  },
  destroyed(){
    window.removeEventListener('mousewheel',()=>{
      this.GetViewpointImg()
    })
    window.removeEventListener('mousemove',()=>{
      this.GetViewpointImg()
    })
  }
}
</script>
<style lang="scss" scoped> 
</style>