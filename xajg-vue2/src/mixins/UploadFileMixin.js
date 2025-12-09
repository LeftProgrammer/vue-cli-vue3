import {
  getMinioUrl,
  getH5PreviewUrl
} from "@/utils/ntko";
import { fromApp, windowOpen } from "@/utils/index";
import { Message } from "element-ui";
import {
  getFile,
  getFileById,
  getYljoaFileStream,
  getFilePath,
} from "@/api/user.js";

export const UploadFileMixin = {
  data() {
    return {};
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async getMinioFilePath(file) {
      if (file.source === 'yljoa') {
        return "/api/synthesis/oa/getOaFileStream?isDownload=0&url=" + encodeURI(file.url);
      }

      const params = {
        fileInfoId: file.fileId,
        fileName: file.name || "无标题",
        isDownload: 0,
      };
      //预览时也不能使用文件流方式，
      let res = await getFilePath(params);
      // console.log("资源", res);

      if (res.success && res.data) {
        let url = new URL(res.data);
        return url.pathname + url.search;
      } else {
        Message.warning("预览文件失败：" + res.message);
        return "";
      }
    },

    // 文件预览
    async handlePreview(file, e) {
      console.log("文件预览", file);
      e && this.$visibleChange(e, 'el-tooltip__popper');

      //处理版式文件文件名不带类型
      if (file.name.lastIndexOf(".") === -1) {
        if (
          file.blobType &&
          (file.blobType === "pdf" || file.blobType === "application/pdf")
        ) {
          file.name = file.name + ".pdf";
        }
      }

      // 判断文件是不是   图片资源
      if (file?.blobType && file.blobType.includes('image')) {
        // 判断当前页面是不是含有iframe
        this.$nextTick(async () => {
          if (this.isIframe) {
            window.parent.postMessage({ action: 'moveImage', file: file }, '*');
          } else {
            this.url = await this.getMinioFilePath(file);
            this.srcList = [this.url];
            this.$nextTick(() => {
              this.$refs.imageRef.clickHandler();
            });
          }
        });
        return;
      }

      if (this.fromapp) {
        //移动端预览文件
        // let fileType = file.name.split(".")[file.name.split(".").length - 1];
        let url = await this.getMinioFilePath(file);
        let params = {
          action: "previewfile",
          params: {
            fileId: file.fileId,
            // fileType: fileType,
            fileName: file.name,
            fileUrl: url,
          },
        };
        uni.postMessage({
          data: JSON.stringify(params),
        });
      } else {
        // 由于电子签章这里目前只能预览的office一套的文件 (.pdf .doc .ppt....) 二进制类型 application/...
        // 所以判断文件类型 来判断 当前的是走电子签章 预览 还是走自己的预览方法
        // this.$previewFileById(file);
        if (file.name.toLocaleLowerCase().endsWith(".pdf")) {
          let signPosition = file?.signPosition || null;
          let username = this.userInfo.username;
          //封装配置 传入参数优先
          let ntkoConfig = {
            keySign: true,
            showDate: true,
          };

          //minio文件//获取预览地址
          file.url = await this.getMinioFilePath(file);
          if (!file.url) {
            return;
          }
          let h5url = getH5PreviewUrl(
            file,
            username,
            this.compKey,
            signPosition,
            ntkoConfig
          );
          // console.log("h5url", h5url)
          windowOpen(h5url);

        } else {
          this.$previewFileById(file);
        }
      }
    },

    // 文件下载
    async handleDownload(file, e) {
      console.log("文件下载", file);
      e && this.$visibleChange(e, 'el-tooltip__popper');

      if (this.fromapp) {
        //移动端下载文件
        // let fileType = file.name.split(".")[file.name.split(".").length - 1];
        let url = await this.getMinioFilePath(file);
        let params = {
          action: "downloadfile",
          params: {
            fileId: file.fileId,
            // fileType: fileType,
            fileName: file.name,
            fileUrl: url,
          },
        };
        uni.postMessage({
          data: JSON.stringify(params),
        });
      } else {
        // 暂时先请求下载  因为的 min 下载 没有文件名称
        this.$downFileById(file);
      }
      return;
      if (file.url) {
        window.open(getMinioUrl(file.url), "_blank");
      } else {
        this.$downFileById(file);
      }
    },
  },
  computed: {
    /**是否来自app */
    fromapp() {
      let fromapp = fromApp();
      return fromapp;
    },
    userInfo() {
      return this.$getStorage("userInfo");
    },
  },
  watch: {},
  destroyed() {
  },
};
