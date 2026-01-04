<template>
  <div class="">
    <div class="flex justify-between align-center mb-10 pl-22">
      <!-- <slot name="title" /> -->
      <div class="tableName">
        <span v-if="required" class="required">*</span>
        {{ tableName }}
        <span class="font-12">{{ tips || `请上传${maxSize}M以内的文件` }}</span>
      </div>
      <el-upload
        ref="uploadFile"
        class="upload-demo"
        :action="uploadApi"
        :on-success="handleUploadSuccess"
        width="100%"
        :file-list="uploadFileList"
        :disabled="readonly"
        :list-type="listType"
        :multiple="multiple"
        :show-file-list="false"
        :limit="limit"
        :on-exceed="masterFileMax"
        :before-upload="attachmentsBeforeUpload"
        :on-progress="handelUploadProgress"
        :on-error="handleUploadError"
        :accept="accept"
      >
        <!-- <div slot="tip" class="el-upload__tip">
          只能上传不超过 {{ maxSize }}MB 的文件
        </div> -->
        <!-- 上传按钮 -->
        <el-button size="small" type="primary" :disabled="readonly"
          >点击上传</el-button
        >
      </el-upload>
    </div>
    <!-- <div class="line"></div> -->
    <!--  文本格式的时候 -->
    <el-row class="table">
      <el-table
        id="uploadfileTable"
        ref="multipleTable"
        class="w-100pre"
        :data="tableData"
        :border="true"
      >
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column
          label="文件名称"
          prop="name"
          width="290"
          align="center"
        >
          <template #default="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件大小" prop="size" align="center">
          <template #default="{ row }">
            <span>{{ $computedSzie(row.size || row.fileSize) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件格式" prop="type" align="center">
          <template #default="{ row }">
            <span>{{ getFileType(row.name) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传进度" prop="percentage" align="center">
          <template #default="{ row }">
            <el-progress
              v-if="row.percentage || row.percentage === 0"
              :percentage="getPercentage(row.percentage)"
            ></el-progress>
            <span v-else>已上传</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" prop="name" width="220" align="center">
          <template
            v-if="!(row.percentage || row.percentage === 0)"
            #default="{ row, $index }"
          >
            <!--            <el-tooltip-->
            <!--              class="item"-->
            <!--              effect="dark"-->
            <!--              content="预览"-->
            <!--              placement="bottom"-->
            <!--            >-->
            <!--              <el-button-->
            <!--                class="custom-btn"-->
            <!--                type="text"-->
            <!--                @click="-->
            <!--                  $visibleChange($event, 'el-tooltip__popper');-->
            <!--                  handlePreview(row, $event);-->
            <!--                "-->
            <!--                >预览</el-button-->
            <!--              >-->
            <!--            </el-tooltip>-->

            <el-button
              type="text"
              @click="
                $visibleChange($event, 'el-tooltip__popper');
                $downFileById(row);
              "
            >
              下载
            </el-button>

            <el-button
              type="text"
              @click="
                $visibleChange($event, 'el-tooltip__popper');
                handlePreview(row);
              "
            >
              预览
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleRemoveText($index)"
            >
              <template #reference>
                <el-button
                  :disabled="readonly"
                  type="text"
                  :style="{ color: readonly ? '#ccc' : 'red' }"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-image
      v-show="false"
      id="imPre"
      ref="imageRef"
      style="width: 0; height: 0"
      :src="url"
      :preview-src-list="srcList"
      draggable="false"
    >
    </el-image>
  </div>
</template>
<script>
import {
  getMinioUrl
} from '@/utils/ntko'
import { UploadFileMixin } from '@/mixins/UploadFileMixin'

export default {
  components: {},
  mixins: [UploadFileMixin],
  model: {
    prop: 'uploadFile',
    event: 'change'
  },
  props: {
    isSingnForTable: {
      default: false,
      type: Boolean
    },
    multiple: {
      default: true,
      type: Boolean
    },
    // 必填
    required: {
      default: false,
      type: Boolean
    },
    // 是否手动签章
    handSign: {
      default: false,
      type: Boolean
    },
    // 是否可以电子签章
    showNtko: {
      default: false,
      type: Boolean
    },
    accept: {
      type: String,
      default: '*'
    },
    readonly: {
      default: false,
      type: Boolean
    },
    uploadFile: {
      default: () => [],
      type: Array
    },
    limit: {
      type: Number,
      default: 10
    },
    listType: {
      // text/picture/picture-card
      default: 'text',
      type: String
    },
    //是否使用ekey签章
    useKeySign: {
      default: false,
      type: Boolean
    },
    /**
     * 文件限制大小 单位M
     */
    maxSize: {
      type: Number,
      default: 500
    },
    //是否展示日期
    showDate: {
      default: false,
      type: Boolean
    },
    tableName: {
      type: String,
      default: '文件列表'
    },
    tips: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileNtkoIndex: '',
      uploadApi: '/api/file/upload',
      uploadFileList: [],
      uploadingFileList: [],
      /**存储刚刚上传的图片json字符串 */
      uploadFileTemp: '',
      compKey: new Date().getTime() + '',
      srcList: [],
      url: ''
    }
  },
  computed: {
    tableData() {
      let uploadinglist = this.uploadingFileList.filter((x) => x.uploadingShow)
      let allList = [...this.uploadFileList, ...uploadinglist]
      console.log('列表文件', allList)
      return allList
    },
    isShow() {
      return (value) => {
        return value == this.listType
      }
    }
  },
  watch: {
    uploadFile: {
      handler(value) {
        this.uploadFileList = value
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    ntkoClick(index) {
      this.fileNtkoIndex = index
    },
    h5SginCallBack(varData, onSuccess) {
      this.$nextTick(function () {
        console.info('h5签章回调数据：', this.fileNtkoIndex, varData)
        //文件保存
        if (varData) {
          let newfile = varData
          let filelist = JSON.parse(JSON.stringify(this.uploadFileList))
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
          this.uploadFileTemp = JSON.stringify(this.uploadFileList)
          this.$emit('changeNtkoFile', this.uploadFileTemp, this.fileNtkoIndex)
          if (typeof onSuccess === 'function') onSuccess()
          this.$message.success('盖章成功！')
        }
      })
    },
    // url  替换成mino
    getMinioUrl(url) {
      if (!url) {
        return ''
      }

      if (url.indexOf('?') != -1) {
        url = url.substr(0, url.indexOf('?'))
      }
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
    /**     文件正在上传时的钩子    **/
    handelUploadProgress(event, file) {
      if (!file || file.percentage === 0) {
        return
      }
      // console.log("event, file", event, file, file.percentage);
      // 计算上传进度
      if (file.percentage === 100) {
        // 上传完成，不做处理
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

      if (this.fromapp) {
        //移动端预览文件
        // let fileType = file.name.split(".")[file.name.split(".").length - 1];
        let url = await this.getMinioFilePath(file)
        let params = {
          action: 'previewfile',
          params: {
            fileId: file.fileId,
            // fileType: fileType,
            fileName: file.name,
            fileUrl: url
          }
        }
        // 检查是否在 uni-app 环境
        if (typeof uni !== 'undefined') {
          uni.postMessage({
            data: JSON.stringify(params)
          })
        }
      } else if (
        file?.blobType &&
        (file.blobType == 'application/pdf' || file.blobType == 'video/mp4')
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
        this.$previewFileById(file)
        // }
      } else {
        this.$message.info('不支持预览该类型文件！')
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
    //电子签章文件保存后事件
    OnNtkoSaveSuccessHandle(varData) {
      //文件保存
      // console.log("OnNtkoSaveSuccessHandle", varData);
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
              size: newfile.fileSize,
              url: this.getMinioUrl(newfile.requestRelativeUrl)
            }
            break
          }
        }
        this.uploadFileList = [...filelist]
        // console.log("this.uploadFileList", this.uploadFileList);
      }
    },
    //电子签章
    // handleNtko(file) {
    //   //判断插件是否安装
    //   var ntkoed = getNtkoInstalled();
    //   var ntkoversion = getNtkoVersion();
    //   // console.log("当前ntkoversion", ntkoversion);
    //   var ntkourl = window.location.host;
    //   var ntkoprotocol = window.location.protocol;

    //   let params = getNtkoSignParams(file, this.userInfo?.name, this.compKey);
    //   console.log("params", params);
    //   if (ntkoed) {
    //     ntkoBrowser.openWindow(
    //       ntkoprotocol +
    //         "//" +
    //         ntkourl +
    //         "/ntko/officeTemplate/ntko.html?t=" +
    //         new Date().getTime() +
    //         "&cmd=" +
    //         encodeURIComponent(JSON.stringify(params)),
    //       false
    //     );
    //   } else {
    //     getNtkoExe();
    //   }
    // },
    // 限制上传数量
    masterFileMax(files, fileList) {
      console.log('limit', files)
      this.$message.warning(`最多上传${this.limit}个文件`)
      return false
    },
    //上传之前处理 大小处理
    attachmentsBeforeUpload(file) {
      const isRightSize = file.size / 1024 / 1024 <= this.maxSize
      if (!isRightSize) {
        this.$message.warning(`文件大小超过 ${this.maxSize}MB`)
        return false
      }
      if (this.accept != '*' && !this.accept.includes(file.type)) {
        this.$message.warning(`不支持的文件类型`)
        return false
      }
      return true
    },

    handleUploadSuccess(res, file, fileList) {
      // console.log(
      //   "handleUploadSuccess 1: ",
      //   res,
      //   file,
      //   fileList,
      //   this.uploadFileList
      // );

      // 处理每次上传成功的文件信息
      if (fileList.every((item) => item.status == 'success')) {
        for (let idx = fileList.length - 1; idx >= 0; idx--) {
          const x = fileList[idx]

          //如果文件是已经上传成功的文件，跳过处理
          let fileIndex = this.uploadFileList.findIndex((f) => f.uid === x.uid)
          if (fileIndex >= 0) {
            continue
          }

          if (x.response?.success) {
            let url = x?.response?.data?.requestRelativeUrl || x.url || ''
            url = this.getMinioUrl(url)
            console.log('文件上传成功', x)
            let item = {
              name: x.name, // 名称
              url: url, // 临时地址
              fileId: x?.response?.data?.fileId || x.fileId, // 上传服务器上的唯一标识符
              blobType: x?.raw?.type || x.blobType, // 预览时候转成blob的类型
              fileSize: x?.size, // 文件大小
              size: x?.size, // 文件大小
              type: this.getFileType(x.name)
            }

            this.uploadFileList.push(item)

            // console.log("handleUploadSuccess 2: ", res, file, fileList);
            if (fileList.length === this.uploadFileList.length) {
              // console.log("_uploadFile", this._uploadFile);
              this.$emit('change', this.uploadFileList)
            }
          } else {
            this.$message.error(x.response?.message || '上传失败！')
            console.log('fileList', fileList, this.uploadFileList)
            //清理已有的上传文件
            fileList.splice(1, 1)
            this.$refs['uploadFileRef'].clearFiles()

            for (let i = 0; i < this.uploadingFileList.length; i++) {
              let uploadingfile = this.uploadingFileList[i]
              if (x.uid === uploadingfile.uid) {
                uploadingfile.uploadingShow = false
                break
              }
            }

            return
          }
          console.log('上传完成文件列表', this.uploadFileList)
          for (let i = 0; i < this.uploadingFileList.length; i++) {
            let uploadingfile = this.uploadingFileList[i]
            if (x.uid === uploadingfile.uid) {
              uploadingfile.uploadingShow = false
              break
            }
          }

          return null
        }

        // // 过滤掉无效的文件对象
        // uploadFileList = uploadFileList.filter((x) => x !== null);

        // this.uploadFileList = uploadFileList; // 更新文件列表

        // this.$emit("change", uploadFileList); // 发送事件，通知父组件
      }
    },

    // 删除类型是 text
    handleRemoveText(index) {
      this.uploadFileList.splice(index, 1)
      // console.log("删除成功", this.uploadFileList);
      this.$emit('change', this.uploadFileList)
    },

    /**获取文件类型 */
    getFileType(name) {
      let arr = (name || '').split('.')
      let type = arr[arr.length - 1]
      return type
    }
  }
}
</script>

<style lang="scss" scoped>
.file-list {
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
    // width: 85%;
    max-width: 85%;

    &:hover {
      color: #409eff;
    }
  }

  .icon {
    span:hover {
      color: #409eff;
    }
  }
}

:deep(.el-icon-delete) {
  font-size: 18px !important;
}

.line {
  background-color: #dcdfe6;
  height: 1px;
  margin: 5px 0 10px 0;
}

:deep(.el-button.el-popover__reference) {
  margin-left: 10px !important;
}

:deep(.el-progress) {
  display: flex;
  justify-content: space-between;

  .el-progress__text {
    width: 55px;
  }
}
.tableName {
  font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
  font-weight: normal;
  font-size: 14px;
  color: #1d2129;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  position: relative;
  .required {
    color: red;
  }
  span {
    color: #86909c;
  }
  &::before {
    content: '';
    position: absolute;
    display: inline-block;
    width: 8px;
    height: 8px;
    background: linear-gradient(180deg, #388ff6 0%, #014acb 100%);
    box-shadow: 1px 1px 2px 0px rgba(37, 118, 214, 0.42);
    border-radius: 1px 1px 1px 1px;
    left: -22px;
    top: 4px;
    z-index: 2;
  }
  &::after {
    top: 8px;
    z-index: 1;
    position: absolute;
    left: -19px;
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #8db6ff;
    border-radius: 1px 1px 1px 1px;
  }
}
</style>
