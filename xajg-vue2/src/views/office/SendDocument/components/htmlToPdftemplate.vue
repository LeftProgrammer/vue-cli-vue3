<template>
  <div
    class="position-fixed top-0 left-2000 bg-fff"
    :style="{ width: htlewidth }"
    style="opacity: 0; z-index: -100"
  >
    <div
      :id="`pdf-content_${random}`"
      :ref="`pdf-content_${random}`"
      class="px-20 py-20 border"
    >
      <div class="w-100pre">
        <div class="pdf-header">
          <h1 class="text-center p-8">{{ fileTitle }}</h1>
        </div>
        <div class="pdf-row">
          <div class="pdf-cell-left">
            <h3 class="p-8">
              {{ documentType == "SendDocument" ? "发文部门" : "来文单位" }}:
            </h3>
          </div>
          <div class="pdf-cell-right" colspan="2">
            <div class="font-18 p-8 font-18">
              {{
                documentType == "SendDocument"
                  ? `${formData.uniName}-${formData.department}`
                  : formData.uniName
              }}
            </div>
          </div>
        </div>
        <div class="pdf-row">
          <div class="pdf-cell-left">
            <h3 class="p-8">
              {{ documentType == "SendDocument" ? "发文编号" : "来文编号" }}:
            </h3>
          </div>
          <div class="pdf-cell-right" colspan="2">
            <div class="font-18 p-8 font-18">{{ getCode(formData.code) }}</div>
          </div>
        </div>
        <div class="pdf-row">
          <div class="pdf-cell-left">
            <h3 class="p-8">
              {{ documentType == "SendDocument" ? "发文日期" : "来文日期" }}:
            </h3>
          </div>
          <div class="pdf-cell-right" colspan="2">
            <div class="font-18 p-8 font-18">
              {{ formData.createDate ? $dateFormat(formData.createDate) : "" }}
            </div>
          </div>
        </div>
        <div class="pdf-row">
          <div class="pdf-cell-left">
            <h3 class="p-8">
              {{ documentType == "SendDocument" ? "发文标题" : "来文标题" }}:
            </h3>
          </div>
          <div class="pdf-cell-right" colspan="2">
            <div class="p-8 font-18">{{ formData.title }}</div>
          </div>
        </div>
        <div class="pdf-row">
          <div class="pdf-cell-left flex">
            <div class="p-8" style="margin: auto">
              <h3>流</h3>
              <h3>程</h3>
              <h3>记</h3>
              <h3>录</h3>
            </div>
          </div>
          <div class="pdf-cell-right chulifu">
            <div class="p-8 text-center font-18">处理流程</div>
            <div
              class="idea p-8"
              v-for="(item, index) in logsList"
              :key="index"
            >
              <div class="">
                <span class="font-18">{{ item.idea }}</span>
              </div>
              <div class="">
                <!-- <div v-if="item.signFile" class="flex flex-column align-end">
                  <img class="w-80" :src="item.signFile" alt="" />
                  <div>
                    {{ item.createTime ? $dateFormat(item.createTime) : "" }}
                  </div>
                </div> -->
                <div class="flex flex-column align-end font-18">
                  <div class="mb-5">{{ item.createUserName }}</div>
                  <div>
                    {{ item.createTime ? $dateFormat(item.createTime) : "" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pdf-row">
          <div
            class="pdf-cell-left"
            style="border-bottom: 0.5px solid rgba(255, 0, 0, 0.7)"
          >
            <h3 class="p-8">附 件:</h3>
          </div>
          <div
            class="pdf-cell-right font-18"
            style="border-bottom: 0.5px solid rgba(255, 0, 0, 0.7)"
          >
            <div v-for="(item, index) in fileList" :key="index">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { logs, signFileName, downSignFile } from "../api.js";
import { fromApp } from "@/utils/index";

// import { pinyin } from "pinyin-pro";
export default {
  // mixins: [BaseMixin],
  props: {
    htlewidth: {
      type: String,
      default: "50%",
    },
    documentType: {
      type: String,
      default: "SendDocument",
    },
  },
  data() {
    return {
      random: "",
      pdfUrl: "",
      formData: {},
      fileTitle: "雄安调蓄处理笺",
      logsList: [],
      fileList: [],
    };
  },
  methods: {
    getCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code?.replace(/\|/, "-〔");

      // 匹配第二个｜并替换为】-
      outputString = outputString?.replace(/\|/, "〕-");

      return outputString + "\n" + "号";
    },
    // 将中文姓名转成拼音
    // convertToPinyin(name) {
    //   const options = {
    //     toneType: "none",
    //   };

    //   const result = pinyin(name, options);
    //   let trspinyin = result?.replace(/\s/g, "");
    //   return trspinyin;
    // },

    getReturnLog(logs) {
      const lastIndex = logs.map((item) => item.btnKey).lastIndexOf("return");
      console.log("lastIndex", lastIndex);
      let list = [];
      if (lastIndex !== -1) {
        const desiredData = logs.slice(lastIndex + 1);
        console.log(desiredData);
        list = desiredData;
      } else {
        list = logs;
      }
      return list;
    },
    // 转成  pdf
    async priviewOrsavePdf(type, formData) {
      this.random = Math.floor(Math.random() * 1000000);
      console.log("htmlToPdf", formData);

      // 处理附件
      if (formData.uploadFile) {
        let files = JSON.parse(formData.uploadFile);
        if (files && Array.isArray(files)) {
          this.fileList = files;
        }
      } else {
        this.fileList = [];
      }

      this.formData = { ...formData };
      const { success, data } = await logs(formData.id);
      if (!success) {
        this.$message.error("获取日志失败");
        return;
      }
      if (data && Array.isArray(data)) {
        // 只要含有操作的数据  包含：“提交、退回、加签、转发”
        let oparation = data.filter((x) => x.idea);
        console.log("获取日志", oparation);
        let list = this.getReturnLog(oparation);
        console.log("最后发起人得流程日志", list);
        this.logsList = list;
      } else {
        this.logsList = [];
      }
      // 将 $nextTick 移至这里，确保数据处理完毕后再执行  存在一点问题 就是页面没有渲染完毕的 就开始画pdf有些dom 没有被画出来
      setTimeout(() => {
        this.jspdfgeneratePDF(type);
      });
    },
    async jspdfgeneratePDF(type) {
      // 获取要转换的元素
      // 生成一个随机数
      this.$nextTick(async () => {
        // 获取当前页面的缩放比例
        console.log("id___", `pdf-content_${this.random}`);
        let element = document.getElementById(`pdf-content_${this.random}`); //这个有问题  好像是因为多个组件导致的
        console.log("dom", element, element.clientWidth, element.clientHeight);
        let scale = null;
        let dom = null;
        if (this.fromapp) {
          dom = document.getElementsByClassName("fromapp")[0] || null;
          if (dom) {
            scale = dom.style.transform.replace(/[^0-9\.]/g, ""); //备用 跳转之前再缩放回来
            dom.style.transform = "scale(1)";
          }
        }
        // 179 769
        console.log("html2canvas", element.clientWidth, element.clientHeight);
        // 使用 html2canvas 将元素转换为图像
        const canvas = await html2canvas(element, {
          useCORS: true, // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
          scale: 3, // 处理模糊问题
          width: element.clientWidth,
          height: element.clientHeight,
        });
        const contentWidth = canvas.width;
        const contentHeight = canvas.height;
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        let a4Width = 595.28;
        let a4Height = 841.89;
        let pageHeight = (contentWidth / a4Width) * a4Height;
        let leftHeight = contentHeight;
        //页面偏移
        var position = 0;
        var imgWidth = a4Width; // A4 宽度
        var imgHeight = (imgWidth / contentWidth) * contentHeight; // A4总高度
        var pageData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF("", "pt", "a4");
        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, "JPEG", 10, 0, imgWidth - 20, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(
              pageData,
              "JPEG",
              10,
              position,
              imgWidth - 20,
              imgHeight
            );
            leftHeight -= pageHeight;
            position -= 841.89;
            //避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }
        let fileName = `${this.fileTitle}.pdf`;
        if (type === "priview") {
          // Optional - set properties on the document
          pdf.setProperties({
            title: fileName,
            // subject: 'This is the subject',
            // author: 'James Hall',
            // keywords: 'generated, javascript, web 2.0, ajax',
            // creator: 'MEEE'
          });
          if (dom && scale) {
            dom.style.transform = `scale(${scale})`;
          }
          // 可选：在使用完 URL 后，释放资源
          if (this.fromapp) {
            const base64String = pdf.output("datauristring");
            // 使用 postMessage 发送 Base64 字符串
            let params = {
              action: "previewfile",
              params: {
                // fileUrl: pdfUrl,
                fileBase64: base64String,
                fileName: fileName,
              },
            };
            uni.postMessage({
              data: JSON.stringify(params),
            });
          } else {
            if (this.pdfUrl) {
              URL.revokeObjectURL(this.pdfUrl);
            }
            // 生成 Blob 对象
            const pdfBlob = pdf.output("blob");
            // 创建一个临时 URL
            const pdfUrl = URL.createObjectURL(pdfBlob);
            this.pdfUrl = pdfUrl;
            // 使用 URL 进行预览
            console.log("pdfUrl", pdfUrl);
            this.$forceUpdate();
            window.open(pdfUrl, "_blank");
          }
        } else {
          if (dom && scale) {
            dom.style.transform = `scale(${scale})`;
          }
          if (this.fromapp) {
            const base64String = pdf.output("datauristring");
            // 使用 postMessage 发送 Base64 字符串
            let params = {
              action: "downloadfile",
              params: {
                // fileUrl: pdfUrl,
                fileBase64: base64String,
                fileName: fileName,
              },
            };
            if (dom && scale) {
              dom.style.transform = `scale(${scale})`;
            }
            uni.postMessage({
              data: JSON.stringify(params),
            });
          } else {
            // 下载 PDF 文件
            pdf.save(fileName);
          }
        }
      });
    },
  },
  destroyed() {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
    }
  },
  computed: {
    /**是否来自app */
    fromapp() {
      let fromapp = fromApp();
      return fromapp;
    },
  },
};
</script>
<style scoped>
.pdf-row {
  display: flex;
}

.vertical-text {
  writing-mode: vertical-lr;
  align-items: center;
  /* 垂直居中 */
}

.idea {
  border-top: 0.5px solid rgba(255, 0, 0, 0.7);
}

.pdf-cell-left {
  width: 110px;
  min-width: 110px;
  border: 0.5px solid rgba(255, 0, 0, 0.7);
  border-bottom: none;
}

.pdf-cell-right {
  border: 0.5px solid rgba(255, 0, 0, 0.7);
  border-left: none;
  width: calc(100% - 110px);
  border-bottom: none;
}
</style>
