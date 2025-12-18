import { getH5PreviewUrl } from "@/utils/ntko";
import { fromApp, windowOpen } from "@/utils";
import { getFileById, getFilePath, getYljoaFileStream } from "@/api/user";

export const UploadFileMixin = {
  methods: {
    async getMinioFilePath(file) {
      if (file && file.source === "yljoa") {
        return "/api/synthesis/oa/getOaFileStream?isDownload=0&url=" + encodeURI(file.url);
      }

      const params = {
        fileInfoId: file.fileId,
        fileName: file.name || "无标题",
        isDownload: 0,
      };

      const res = await getFilePath(params);
      if (res && res.success && res.data) {
        const url = new URL(res.data);
        return url.pathname + url.search;
      }

      if (this.$message && typeof this.$message.warning === "function") {
        this.$message.warning("预览文件失败：" + (res && res.message ? res.message : ""));
      }
      return "";
    },

    async handlePreview(file, e) {
      e && this.$visibleChange && this.$visibleChange(e, "el-tooltip__popper");

      if (file && file.name && file.name.lastIndexOf(".") === -1) {
        if (
          file.blobType &&
          (file.blobType === "pdf" || file.blobType === "application/pdf")
        ) {
          file.name = file.name + ".pdf";
        }
      }

      if (file && file.blobType && file.blobType.includes("image")) {
        this.$nextTick(async () => {
          if (this.isIframe) {
            window.parent.postMessage({ action: "moveImage", file: file }, "*");
          } else {
            this.url = await this.getMinioFilePath(file);
            this.srcList = [this.url];
            this.$nextTick(() => {
              if (this.$refs && this.$refs.imageRef && this.$refs.imageRef.clickHandler) {
                this.$refs.imageRef.clickHandler();
              }
            });
          }
        });
        return;
      }

      if (this.fromapp) {
        const url = await this.getMinioFilePath(file);
        const params = {
          action: "previewfile",
          params: {
            fileId: file.fileId,
            fileName: file.name,
            fileUrl: url,
          },
        };
        if (typeof uni !== "undefined" && uni.postMessage) {
          uni.postMessage({
            data: JSON.stringify(params),
          });
        }
      } else {
        if (file && file.name && file.name.toLocaleLowerCase().endsWith(".pdf")) {
          const signPosition = file.signPosition || null;
          const username = this.userInfo && this.userInfo.username;

          const ntkoConfig = {
            keySign: true,
            showDate: true,
          };

          file.url = await this.getMinioFilePath(file);
          if (!file.url) return;

          const h5url = getH5PreviewUrl(file, username, this.compKey, signPosition, ntkoConfig);
          windowOpen(h5url);
        } else {
          this.$previewFileById && this.$previewFileById(file);
        }
      }
    },

    async handleDownload(file, e) {
      e && this.$visibleChange && this.$visibleChange(e, "el-tooltip__popper");

      if (this.fromapp) {
        const url = await this.getMinioFilePath(file);
        const params = {
          action: "downloadfile",
          params: {
            fileId: file.fileId,
            fileName: file.name,
            fileUrl: url,
          },
        };
        if (typeof uni !== "undefined" && uni.postMessage) {
          uni.postMessage({
            data: JSON.stringify(params),
          });
        }
      } else {
        this.$downFileById && this.$downFileById(file);
      }
    },

    async downFileById(file) {
      if (!file) return;

      if (file.source === "yljoa") {
        return getYljoaFileStream(file.url);
      }

      return getFileById({
        fileInfoId: file.fileId,
        fileName: file.name,
        isDownload: 1,
      });
    },
  },
  computed: {
    fromapp() {
      return fromApp();
    },
    userInfo() {
      return this.$getStorage ? this.$getStorage("userInfo") : null;
    },
  },
};
