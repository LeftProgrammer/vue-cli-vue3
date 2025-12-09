<template>
  <div class="side-frame" @contextmenu.prevent="">
    <a-form :form="form">
      <a-form-item v-show="type == 1" label="构件坐标" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
        <a-input :disabled="true" v-model="positionStr" placeholder="请选择坐标" />
      </a-form-item>
      <a-form-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
        <a-upload
          v-show="uploadType === 'local'"
          :accept="accept"
          name="file"
          :multiple="false"
          :remove="handleRemove"
          :before-upload="beforeUpload"
          :file-list="fileList"
        >
          <a-button> <a-icon type="upload" /> 上传文件</a-button>
        </a-upload>
        <a-input
          type="hidden"
          v-decorator="['files', { rules: [{ required: true, message: '请选择要上传的文件' }] }]"
        />
        <div v-show="progressShow" style="width: 100%">
          <a-progress :percent="percent" />
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" block @click="SaveFile()"> 确定 </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import { breakpointContinuation, mergeAttach, saveAttach } from '@/components/BimEngine/api/documentAttach'
import { splitResult } from '@/utils/split'
export default {
  name: 'FileAdd',
  props: {
    projectMessage: {
      type: Object,
      default: undefined,
    },
    //类型 0=全局 1：局部
    type: {
      type: Number,
      default: 0,
    },
    fetch: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      accept: '.jpg,.jpeg,.png,.gif,.txt,.pdf,.docx,.xls,.xlsx,.mp3,.mpeg,.mp4,.avi',
      fileList: [], //
      position: [],
      positionStr: '',
      uploadType: 'local', //local=本地上传 system=系统关联
      percent: 0, //上传进度
      upload: false, //是否正在上传
      percentCount: 0,
      progressShow: false,
      curentIndex: 0,
    }
  },
  watch: {
    type(val, old) {
      this.CreateLabel()
    },
  },
  mounted() {
    this.CreateLabel()
  },
  methods: {
    CreateLabel() {
      const that = this
      if (that.type == 1) {
        that.$api.Public.Event('LEFT_CLICK', function (click) {
          that.$api.Public.PickupCoordinate(click.position, function (data) {
            that.position = data
            that.positionStr = JSON.stringify(data)
            that.$api.Lable.DeleteCustomLabel('lable_selected')
            var html = `<div style="position: relative;width:100px;height: 50px;margin-left: 0px;margin-top: 0px; padding: 0px;">
                      <div style="position: absolute;left: 80px;top: -14px;border: 1px solid #FFFFFF; line-height: 22px;border-radius: 6px;padding: 2px 6px;background-color: rgba(0,0,1,0.1);color: #FFFFFF;">                         
                        <div style="width:86px;word-wrap: break-word; word-break: normal;">局部链接位置</div>                        
                      </div>
                      <div style="width:50px;height:50px;position: absolute;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px"><line x1="100%" y1="0" x2="0" y2="100%" stroke="#FFFFFF" stroke-width="1"></line></svg>
                      </div>
                      <div style="width: 30px;height: 30px;position: absolute;left: 50px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px"><line x1="100%" y1="0" x2="0" y2="0" stroke="#FFFFFF" stroke-width="2"></line></svg>
                      </div>
                    </div>`
            that.$api.Lable.AddCustomLabel({
              id: 'lable_selected',
              axisType: 1,
              position: data,
              html: html,
              onClick: function (par) {
              },
            })

            // var opt = {
            //   axisType: 0,
            //   id: 'lable_selected',
            //   position: [click.position.x, click.position.y],
            //   text: '自定义内容',
            // }
            // that.$api.Lable.AddLabel2d(opt)
          })
        })
        that.$nextTick(() => {
          that.$message.info('请选定局部链接位置')
        })
      } else {
        this.$api.Public.clearHandler('LEFT_CLICK')
        this.$api.Lable.DeleteCustomLabel('lable_selected')
      }
    },
    ClearLabel() {
      this.$api.Public.clearHandler('LEFT_CLICK') //移除点击事件
      this.$api.Lable.DeleteCustomLabel('lable_selected')
    },
    beforeUpload(file) {
      if (this.fileList.length >= 1) {
        this.$message.warning('一次只能上传一个文件！')
        return false
      }
      var suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
      if (this.accept.split(',').indexOf(suffix) < 0) {
        this.$message.error('暂不支持此格式')
        return false
      }
      if (file.name.split('.')[0].length <= 50) {
        this.fileList = [...this.fileList, file]
        this.form.setFieldsValue({ files: this.fileList.map((x) => x.uid).join(',') })
      } else {
        this.$message.warning('文件名称不能超过50个字符')
      }
      return false
    },
    sendRequest() {
      const that = this
      const requestList = [] // 请求集合
      this.chunkList.forEach((item, index) => {
        const fn = () => {
          const formData = new FormData()
          formData.append('chunk', item.chunk)
          formData.append('fileName', item.fileName)
          formData.append('index', index)
          formData.append('hashName', this.hash)
          var promise = new Promise((resolve, reject) => {
            breakpointContinuation(formData).then((res) => {
              if (res) {
                if (this.percentCount === 0) {
                  // 避免上传成功后会删除切片改变 chunkList 的长度影响到 percentCount 的值
                  this.percentCount = 100 / this.chunkList.length
                }
                this.percent += this.percentCount // 改变进度
                this.percent = +this.percent.toFixed(2)
                if (this.percent > 99) {
                  this.percent = 99
                }
                resolve(res)
              }
            })
          })
          return promise
        }
        requestList.push(fn)
      })

      // 文件切片全部发送完毕后，需要请求 '/merge' 接口，把文件的 hash 传递给服务器
      const complete = () => {
        this.form.validateFields(async (err, values) => {
          const params = {
            hashName: this.hash,
            fileName: this.bigFileName,
            fileName: this.fileList[0].name,
            fileSize: this.fileList[0].size,
            projectId: that.projectMessage.projectId,
            modelId: that.projectMessage.id,
            category: that.type,
            position: that.positionStr,
          }
          mergeAttach(params)
            .then((res) => {
              if (res) {
                this.percent = 100
                this.upload = false
                this.$message.success('上传成功')
                that.$notification.close('EngineKey')
                that.fetch()
                that.ClearLabel()
              } else {
                this.$message.error(`上传失败！`)
              }
            })
            .catch((err) => {
              this.$message.error(`$上传失败！`)
            })
        })
      }
      const send = async () => {
        if (!this.upload) {
          return
        }
        if (this.curentIndex >= requestList.length) {
          // 发送完毕
          complete()
          return
        }
        await requestList[this.curentIndex]().then((a) => {
          if (!a) {
            this.upload = false
          } else {
            this.curentIndex++
          }
        })
        await send()
      }
      send() // 发送请求
    },

    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    async SaveFile() {
      const that = this
      if (that.type == 1 && that.positionStr.length == 0) {
        that.$message.warning('请点击构件拾取坐标')
        return
      }
      if (that.uploadType === 'local') {
        if (that.fileList.length == 0) {
          that.$message.error('请选择文件上传')
          return
        }
        this.progressShow = true
        this.upload = true
        const file = this.fileList[0]
        this.percent = 0
        const res = await splitResult(file, 1024 * 1024 * 2)
        this.chunkList = res.chunkList
        this.hash = res.hash
        this.suffix = res.suffix
        this.chunkListLength = res.chunkListLength
        this.bigFileName = file.name

        //判断文件格式
        if (this.upload) {
          await this.sendRequest()
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
 .side-frame{
   padding-top:30px
 } 
 .select-table{
   width: 100%;
   table-layout:fixed;
   color: #fff;
   tr:hover{
     background-color: #285681;
   }
   tr td{
     padding: 0 4px;
   }
   tr td div{    
    width: 100%;
    overflow:hidden; //超出的文本隐藏
    text-overflow:ellipsis; //用省略号显示
    white-space:nowrap; //不换行
   }    
 }
 /deep/.ant-upload-list{
   color: #fff; 
   .ant-upload-list-item-info:hover{
     background-color: #285681;
   }
 }
 
</style>
