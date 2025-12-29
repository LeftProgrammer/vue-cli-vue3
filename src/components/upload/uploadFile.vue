<template>
  <div class="">
    <el-upload
      class="upload-demo"
      ref="uploadFileRef"
      :action="uploadApi"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      width="100%"
      :file-list="uploadFileList"
      :disabled="readonly"
      :list-type="listType"
      :data="uploadData"
      :accept="accept"
      :multiple="multiple"
      :on-exceed="masterFileMax"
      :before-upload="attachmentsBeforeUpload"
      :limit="limit"
      :on-progress="handleUploadProgress"
      :on-change="handleUploadChange"
    >
      <div slot="tip" class="el-upload__tip">
        只能上传不超过 {{ maxSize }}MB 的文件
      </div>
      <div slot="file" slot-scope="{ file }" v-if="isShow('picture-card')">
        <img class="el-upload-list__item" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <!-- <span class="ml-15 pointer" v-if="showNtko" @click="handleNtko(file)">
            <i class="el-icon-s-check" />
          </span> -->
          <!-- <el-tooltip class="item" effect="dark" content="签章" placement="bottom">
            <ntko v-if="showNtko" :handSign="handSign" :file="file" :compKey="compKey" :useKeySign="useKeySign"
              :showDate="showDate" @h5SginCallBack="h5SginCallBack"></ntko>
          </el-tooltip> -->
          <el-tooltip effect="dark" content="预览" placement="top">
            <span class="ml-15 pointer" @click="handlePreview(file)">
              <i class="el-icon-view" />
            </span>
          </el-tooltip>
          <el-tooltip effect="dark" content="下载" placement="top">
            <span class="ml-15 pointer" @click="handleDownload(file)">
              <i class="el-icon-download" />
            </span>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="bottom"
          >
            <span
              class="ml-15 pointer"
              v-if="!readonly"
              @click="handleRemovePictureCard($event)"
            >
              <i class="el-icon-delete" />
            </span>
          </el-tooltip>
        </span>
      </div>
      <!-- 上传按钮 -->
      <el-button
        v-if="isShow('picture') || isShow('text')"
        icon="el-icon-upload"
        type="text"
        :disabled="readonly"
        >点击上传
      </el-button>
      <!-- <slot name="uploadBtn" v-if="$slots.uploadBtn" /> -->
      <i class="el-icon-plus" v-else></i>
    </el-upload>
    <!--  文本格式的时候 -->
    <div v-if="isShow('text')">
      <div
        v-for="(file, index) in uploadedFileList"
        :key="index"
        :class="{ 'file-item': true, 'file-item-app': isFromApp }"
      >
        <div v-if="isFromApp" style="width: 30px; height: 30px">
          <img
            :src="require(`@/assets/img/app/${getIconPath(file)}.png`)"
            style="width: 30px; height: 30px"
            alt=""
          />
        </div>
        <div class="file-name text-ellipsis" :title="file.name">
          {{ file.name }}
        </div>
        <div class="font-18 icon">
          <!-- <span class="ml-15 pointer" v-if="showNtko" @click="handleNtko(file)">
            <i class="el-icon-s-check" />
          </span> -->

          <el-tooltip
            class="item"
            effect="dark"
            content="正文编辑"
            placement="bottom"
          >
            <span
              v-if="showNtkoHandleEdit"
              class="ml-15 pointer"
              @click="$emit('ntkoHandleEdit', file)"
            >
              <i class="el-icon-edit-outline" />
            </span>
          </el-tooltip>
          <el-tooltip effect="dark" content="预览" placement="top">
            <span
              class="ml-15 pointer"
              @click="
                $visibleChange($event, 'el-tooltip__popper')
                handlePreview(file)
              "
            >
              <i class="el-icon-view" />
            </span>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="下载"
            placement="top"
            v-if="showDownloadButton"
          >
            <span
              class="ml-15 pointer"
              @click="
                $visibleChange($event, 'el-tooltip__popper')
                handleDownload(file)
              "
            >
              <i class="el-icon-download" />
            </span>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="bottom"
          >
            <span
              v-if="!readonly"
              class="ml-15 pointer"
              @click="
                $visibleChange($event, 'el-tooltip__popper')
                handleRemoveText(index)
              "
            >
              <i class="el-icon-delete" />
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <!-- 在模板中添加这一部分 -->
    <div class="upload-progress-list">
      <div class="file-item" v-for="file in progressFileList" :key="file.uid">
        <div :title="file.name" class="file-name text-ellipsis">
          {{ file.name }}
        </div>
        <el-progress :percentage="getPercentage(file.percentage)" />
      </div>
    </div>

    <el-image
      v-show="false"
      style="width: 0; height: 0"
      :src="url"
      :preview-src-list="srcList"
      ref="imageRef"
      id="imPre"
      draggable="false"
    >
    </el-image>
    <!-- pdf word excel -->
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
      <VueOfficeDocx
        v-if="viewFileType == 'word'"
        :src="url"
        style="height: 100%; overflow: auto"
      />
      <VueOfficeExcel
        v-if="viewFileType == 'excel'"
        :src="url"
        style="height: 100%"
      />
      <iframe
        v-if="viewFileType == 'pdf' || viewFileType == 'video'"
        style="height: 100%; width: 100%"
        :src="url"
        frameborder="0"
      />
    </el-dialog>
  </div>
</template>
<script>
import { getMinioUrl, getH5PreviewUrl } from '@/utils/ntko'
import { fromApp, windowOpen } from '@/utils/index'
import { UploadFileMixin } from '@/mixins/UploadFileMixin'
import VueOfficePdf from '@vue-office/pdf'
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
export default {
  mixins: [UploadFileMixin],
  components: {
    VueOfficePdf,
    VueOfficeDocx,
    VueOfficeExcel
  },
  model: {
    prop: 'uploadFile',
    event: 'change'
  },
  props: {
    showDownloadButton: {
      default: true,
      type: Boolean
    },
    component: {
      type: Object,
      default: () => {}
    },
    fromApplication: {
      type: String,
      default: 'web'
    },
    multiple: {
      default: true,
      type: Boolean
    },
    // 是否可以电子签章
    showNtko: {
      default: false,
      type: Boolean
    },
    // 是否手动签章
    handSign: {
      default: false,
      type: Boolean
    },
    //是否使用ekey签章
    useKeySign: {
      default: false,
      type: Boolean
    },
    // 上传参数
    uploadData: {
      default: () => {},
      type: Object
    },
    // 只读属性
    readonly: {
      default: false,
      type: Boolean
    },
    // 上传文件json
    uploadFile: {
      default: '',
      type: String
    },
    // 限制文件数量
    limit: {
      type: Number,
      default: 10
    },
    // 显示上传组件的类型
    listType: {
      // text/picture/picture-card
      default: 'text',
      type: String
    },
    // 文件限制大小 单位M
    maxSize: {
      type: Number,
      default: 500
    },
    // 是否显示已上传文件列表
    // showFileList: {
    //   type: Boolean,
    //   default: false,
    // },
    // 接受上传的文件类型 :accept="jpg,png,gif"
    accept: {
      type: String,
      default: ''
    },
    // 流程名称
    flowName: {
      default: '',
      type: String
    },
    // 是否可以编辑ntko
    showNtkoHandleEdit: {
      default: false,
      type: Boolean
    },
    //是否展示日期
    showDate: {
      default: false,
      type: Boolean
    },
    //针对列表签章 时候的签章 要根据这个文件里面的信息签章 不能 根据下面this.signFinish来
    isSingnForTable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isFromApp: false,
      fileNtkoIndex: '',
      srcList: [],
      url: '',
      uploadApi: '/api/file/upload',
      /**已完成上传文件的列表 */
      uploadFileList: [],
      /**可操作数组 */
      uploadedFileList: [],
      /**正在上传文件的列表 */
      uploadingFileList: [],
      /**存储刚刚上传的图片json字符串 */
      _uploadFile: '',
      // textList: [],
      compKey: new Date().getTime() + '',
      //是否签章
      ntkoDialog: {
        show: false,
        url: ''
      },
      isIframe: false,
      dialogShow: false,
      viewFileType: '',
      viewFileName: ''
    }
  },
  computed: {
    progressFileList() {
      let list = this.uploadingFileList.filter((x) => x.uploadingShow)
      console.log('progressFileList', list.length, list)
      return list
    },
    isShow() {
      return (value) => {
        return value == this.listType
      }
    },
    userInfo() {
      // console.log("userInfo", this.$getStorage("userInfo"));
      return this.$getStorage('userInfo')
    }
  },
  watch: {
    uploadFile: {
      handler(val, oldVal) {
        this.uploadFileList = []
        this.uploadedFileList = []
        if (val) {
          this.setFileList(val)
        }
        // console.log("uploadFile", oldVal, val);
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.isFromApp = fromApp()
  },
  mounted() {
    window.addEventListener('message', (event) => {
      this.isIframe = true
    })
  },
  methods: {
    // async getMinioFilePath(file) {
    //   const params = {
    //     fileInfoId: file.fileId,
    //     fileName: file.name || '无标题',
    //     isDownload: 0
    //   };
    //   //预览时也不能使用文件流方式，
    //   let res = await getFilePath(params);
    //   // console.log("资源", res);

    //   if (res.success && res.data) {
    //     let url = new URL(res.data);
    //     return url.pathname + url.search;
    //   } else {
    //     Message.warning('预览文件失败：' + res.message);
    //     return '';
    //   }
    // },

    // url替换成mino
    getMinioUrl(url) {
      return getMinioUrl(url)
    },

    /**获取进度百分比 */
    getPercentage(percentage) {
      let percent = 0
      if (!percentage) {
        percent = 0
      }
      if (percentage >= 100) {
        percent = 99.99
      } else {
        percent = percentage
      }
      return parseFloat(percent.toFixed(2))
    },
    ntkoClick(file, index) {
      this.fileNtkoIndex = index
    },
    /**     文件正在上传时的钩子    **/
    handleUploadProgress(event, file) {
      if (!file || file.percentage === 0) {
        return
      }
      // console.log(
      //   "handleUploadProgress event, file",
      //   event,
      //   file,
      //   file.percentage
      // );
      // 计算上传进度
      if (file.percentage === 100) {
      } else {
        let fileIndex = this.uploadingFileList.findIndex(
          (x) => x.uid === file.uid
        )
        if (fileIndex === -1) {
          file.uploadingShow = true
          this.uploadingFileList.push(file)
        }
      }
    },
    //电子签章文件保存后事件
    OnNtkoSaveSuccessHandle(varData) {
      //文件保存
      console.log('OnNtkoSaveSuccessHandle', varData)
      typeof varData === 'string' && (varData = JSON.parse(varData))

      if (varData) {
        let newfile = varData
        let filelist = [...this.uploadFileList]
        for (let i = 0; i < filelist.length; i++) {
          let file = filelist[i]
          if (file.fileId === newfile.oldfileid) {
            filelist[i] = {
              blobType: file.blobType,
              fileId: newfile.fileId,
              oldfileid: file.fileId,
              name: file.name, //newfile.fileName,
              fileSize: newfile.fileSize,
              url: newfile.requestRelativeUrl
              // url: this.getMinioUrl(newfile.requestRelativeUrl),
            }
            break
          }
        }
        this.uploadFileList = [...filelist]
        this.uploadedFileList = [...filelist]
        // console.log("this.uploadFileList", this.uploadFileList);
        this._uploadFile = JSON.stringify(this.uploadFileList)
        // console.log("_uploadFile", this._uploadFile);
        this.$emit('change', this._uploadFile)
      }
      this.$message.success('盖章成功！')
    },
    h5SginCallBack(varData, onSuccess) {
      this.$nextTick(function () {
        console.info(
          'h5签章回调数据：',
          this.uploadFileList,
          this.fileNtkoIndex,
          varData
        )
        //文件保存
        if (varData) {
          let newfile = varData
          let filelist = [...this.uploadFileList]
          let file = {
            blobType: filelist[this.fileNtkoIndex].blobType,
            fileId: newfile.fileId,
            oldfileid: filelist[this.fileNtkoIndex].fileId,
            signed: newfile.signed,
            name: filelist[this.fileNtkoIndex].name, //newfile.fileName,
            size: newfile.fileSize,
            url: newfile.requestRelativeUrl
          }
          filelist[this.fileNtkoIndex] = file
          this.uploadFileList = [...filelist]
          this._uploadFile = JSON.stringify(this.uploadFileList)
          this.$emit('changeNtkoFile', this._uploadFile, this.fileNtkoIndex)
          if (typeof onSuccess === 'function') onSuccess()
          this.$message.success('盖章成功！')
        }
      })
    },

    getIconPath(file) {
      let icon = 'app_empty_file'
      if (file.blobType) {
        if (file.blobType === 'pdf' || file.blobType === 'application/pdf') {
          icon = 'app_pdf_file'
        } else if (
          file.blobType === 'doc' ||
          file.blobType === 'application/msword' ||
          file.blobType === 'docx' ||
          file.blobType ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          icon = 'app_word_file'
        } else if (
          file.blobType === 'xls' ||
          file.blobType === 'application/vnd.ms-excel' ||
          file.blobType === 'xlsx' ||
          file.blobType ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          icon = 'app_excel_file'
        }
      }
      return icon
    },

    // 文件预览
    async handlePreview(file) {
      //处理版式文件文件名不带类型
      if (file.name.lastIndexOf('.') === -1) {
        if (
          file.blobType &&
          (file.blobType === 'pdf' || file.blobType === 'application/pdf')
        ) {
          file.name = file.name + '.pdf'
        }
      }
      // 判断文件是不是   图片资源
      if (file?.blobType && file.blobType.includes('image')) {
        // 判断当前页面是不是含有iframe
        this.$nextTick(async () => {
          // if (this.isIframe) {
          //   window.parent.postMessage({ action: 'moveImage', file: file }, '*')
          // } else {
          this.url = await this.getMinioFilePath(file)
          this.srcList = [this.url]
          this.$nextTick(() => {
            this.$refs.imageRef.clickHandler()
          })
          // }
        })
        return
      }
      console.log('文件预览', file)
      if (
        file?.blobType &&
        (file.blobType == 'application/pdf' ||
          file.blobType == 'video/mp4' ||
          file.blobType == 'application/vnd.ms-excel' ||
          file.blobType == 'application/msword' ||
          file.blobType ==
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.blobType ==
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      ) {
        // file.url = this.getMinioUrl(file.url);
        // console.log("文件预览", file.url);
        // 由于电子签章这里目前只能预览的office一套的文件 (.pdf .doc .ppt....) 二进制类型 application/...
        // 所以判断文件类型 来判断 当前的是走电子签章 预览 还是走自己的预览方法
        // if (file.name.toLocaleLowerCase().endsWith(".pdf")) {
        //   let signPosition = file?.signPosition || null;
        //   let username = this.userInfo.username;
        //封装配置 传入参数优先
        // let ntkoConfig = {
        //   keySign: true,
        //   showDate: true,
        // };
        //minio文件//获取预览地址
        // file.url = await this.getMinioFilePath(file);
        // let h5url = getH5PreviewUrl(
        //   file,
        //   username,
        //   this.compKey,
        //   signPosition,
        //   ntkoConfig
        // );
        // console.log("h5url", h5url)
        // windowOpen(h5url);
        // } else {
        // this.$previewFileById(file)
        this.viewFileName = file.name
        this.viewFileType =
          'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'.includes(
            file.blobType
          )
            ? 'word'
            : 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'.includes(
                file.blobType
              )
            ? 'excel'
            : file.blobType == 'application/pdf'
            ? 'pdf'
            : 'video'
        this.url = await this.getMinioFilePath(file)
        console.log('文件预览', this.url)
        this.dialogShow = true
        // }
      } else {
        this.$message.info('不支持预览该类型文件！')
      }
    },

    // 文件下载
    async handleDownload(file) {
      // console.log('文件下载', file);
      //处理版式文件文件名不带类型
      if (file.name.lastIndexOf('.') === -1) {
        if (
          file.blobType &&
          (file.blobType === 'pdf' || file.blobType === 'application/pdf')
        ) {
          file.name = file.name + '.pdf'
        }
      }

      if (this.fromapp) {
        //移动端下载文件
        // let fileType = file.name.split(".")[file.name.split(".").length - 1];
        let url = await this.getMinioFilePath(file)
        let params = {
          action: 'downloadfile',
          params: {
            fileId: file.fileId,
            // fileType: fileType,
            fileName: file.name,
            fileUrl: url
          }
        }
        uni.postMessage({
          data: JSON.stringify(params)
        })
      } else {
        // 暂时先请求下载  因为的 min 下载 没有文件名称
        this.$downFileById(file)
      }
      return
      if (file.url) {
        window.open(getMinioUrl(file.url), '_blank')
      } else {
        this.$downFileById(file)
      }
    },

    /**
     * 设置已上传文件列表
     */
    async setFileList(val) {
      // this.$refs["uploadFileRef"].clearFiles();
      if (!val) {
        this.uploadFileList = [] // 如果val为null或undefined，清空上传文件列表
        this.uploadedFileList = []
        return
      }
      try {
        let uploadFileList = JSON.parse(val)
        // console.log('设置已上传文件列表', uploadFileList);
        if (Array.isArray(uploadFileList)) {
          if (uploadFileList.length > 0) {
            for (let i = 0; i < uploadFileList.length; i++) {
              let x = uploadFileList[i]
              if (x.name && x.name.indexOf('\\') >= 0) {
                x.name = x.name.substring(x.name.lastIndexOf('\\') + 1)
              }
              // if (x.blobType && x.blobType.indexOf('image/') === 0) {
              x.url = await this.getMinioFilePath(x)
              // }
            }
          }
        } else if (typeof uploadFileList === 'object') {
          uploadFileList = [uploadFileList]
        }
        // console.log('设置已上传文件列表', uploadFileList);
        // uploadFileList   这里赋值 导致  资源重新刷
        this.uploadFileList = [...uploadFileList]

        this.uploadedFileList = [...uploadFileList]
      } catch (error) {
        console.error('Error while parsing JSON:', error, val)
        this.uploadFileList = [] // 处理JSON解析错误时清空上传文件列表
        this.uploadedFileList = []
      }
    },
    // 限制上传数量
    masterFileMax(files, fileList) {
      this.$message.warning(`最多上传${this.limit}个文件`)
      return false
    },
    // 上传之前处理 大小处理
    attachmentsBeforeUpload(file) {
      // 文件大小限制
      const isRightSize = file.size / 1024 / 1024 <= this.maxSize
      if (!isRightSize) {
        this.$message.warning(`文件大小超过 ${this.maxSize}MB`)
        return false
      }
      return isRightSize
    },

    // 上传成功
    handleUploadSuccess(res, file, fileList) {
      console.log('handleUploadSuccess 1: ', res, file, fileList)
      let uploadingFileIndex = this.uploadingFileList.findIndex(
        (f) => f.uid === file.uid
      )
      if (file.status === 'success') {
        if (res?.success) {
          let url = file?.response?.data?.requestRelativeUrl || file.url || ''
          url = this.getMinioUrl(url)
          let fileInfo = {
            name: file.name, //名称
            url: url, //临时地址
            fileSize: file.size,
            fileId: file?.response?.data?.fileId || file.fileId, //上传服务器上 唯一标识符
            blobType: file?.raw?.type || file.blobType // 预览时候转成blob 的类型
          }
          this.$emit('addFile', { ...fileInfo })
          this.uploadedFileList.push(fileInfo)
          console.log('上传之后的文件', this.uploadedFileList)
          if (fileList.length === this.uploadedFileList.length) {
            this.uploadFileList = [...this.uploadedFileList]
            this._uploadFile = JSON.stringify(this.uploadFileList)
            // console.log("_uploadFile", this._uploadFile);
            this.$emit('change', this._uploadFile)
          }
        } else {
          this.$message.error(`${file?.name} ${res?.message}`)
        }

        if (uploadingFileIndex != -1) {
          this.uploadingFileList.splice(uploadingFileIndex, 1)
        }
      }
    },

    //上传change
    handleUploadChange(file, fileList) {
      //处理附件上传异常会占用文件个数情况
      console.log('handleUploadChange', file, fileList)
      for (let i = 0; i < fileList.length; i++) {
        const item = fileList[i]
        if (item.response && !item.response.success) {
          fileList.splice(i, 1)
        }
      }
    },

    //上传失败
    handleUploadError(err, file, fileList) {
      console.log('handleUploadError', err, file, fileList, this.uploadFileList)
      this.$message.error(`${file?.name} 附件上传异常！`)
      for (let i = 0; i < this.uploadingFileList.length; i++) {
        const item = this.uploadingFileList[i]
        if (item.uid === file.uid) {
          this.uploadingFileList.splice(i, 1)
        }
      }
    },

    // 删除类型为 picture-card
    handleRemovePictureCard(event) {
      // 获取当前被点击的 span 元素
      const clickedSpan = event.currentTarget
      // 找到包含该 span 元素的 li 元素
      const listItem = clickedSpan.closest('li')
      // 获取 li 元素在其父节点 ul 的子元素中的位置（索引）
      const index = Array.from(listItem.parentNode.children).indexOf(listItem)
      // console.log("获取索引", index);
      // 从   this.uploadFileList  中删除 index 位置的元素 返回剩余的素组
      this.uploadFileList.splice(index, 1)
      this.uploadedFileList.splice(index, 1)
      // console.log("删除", this.uploadFileList);
      this._uploadFile = JSON.stringify(this.uploadFileList)

      this.$emit('change', this._uploadFile)
    },
    // 删除类型是 text
    handleRemoveText(index) {
      if (this.readonly) {
        return
      }
      this.uploadFileList.splice(index, 1)
      this.uploadedFileList.splice(index, 1)
      this.$emit('deleteFile', index)
      // console.log("删除", this.uploadFileList);
      this._uploadFile = JSON.stringify(this.uploadFileList)
      if (!this.uploadFileList || this.uploadFileList.length === 0) {
        this.$emit('change', '')
      } else {
        this.$emit('change', this._uploadFile)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload-list--text.el-upload-list {
  display: none;
}
::v-deep.el-upload__tip {
  font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
  font-weight: normal;
  font-size: 12px;
  color: #86909c;
  line-height: 24px;
  font-style: normal;
  text-transform: none;
  margin-top: 8px;
}
.file-item {
  display: flex;
  justify-content: space-between;
  padding-right: 30px;
  margin-top: 10px;
  padding: 0 5px;

  &:hover {
    background-color: #f5f5f5;
    border-radius: 5px;
  }

  .file-name {
    width: calc(100% - 90px);

    &:hover {
      color: #409eff;
    }
  }

  .icon {
    position: absolute;
    right: 0px;
    background: #fff;

    span:hover {
      color: #409eff;
    }
  }
}

.file-item-app {
  justify-content: flex-start !important;
  align-items: center !important;
}

.upload-progress-list {
  .file-item {
    display: block;

    .file-name {
      width: 100%;
    }
  }

  /deep/ .el-progress {
    display: flex;
    justify-content: space-between;

    .el-progress__text {
      width: 55px;
    }
  }
}

/deep/ .el-icon-delete {
  font-size: 18px !important;
  color: #f53f3f;
}

/deep/ .el-button.is-disabled.delete-btn {
  border: 0 !important;
  background-color: transparent !important;
}

.hideent {
  /deep/ .upload-demo {
    display: none;
  }
}
</style>
<style lang="scss">
.view-file-dialog {
  .el-dialog__body {
    padding: 0;
    height: calc(100vh - 57px) !important;
    overflow: hidden !important;
  }
}
</style>
