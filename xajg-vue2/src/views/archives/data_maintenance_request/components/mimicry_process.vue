<template>
  <div class="page-mimicry-process">
    <SzgcProcessGetor
      ref="SzgcProcessGetor"
      v-if="dataAll.businessId"
      :top-show="false"
      :page="detailStatus"
      :dataAll="dataAll"
    ></SzgcProcessGetor>
    <footer class="text-right mb-10 mt-10">
      <el-button type="primary" @click="handelFlowDialogConfirm">保存</el-button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "MimicryProcess",
  data() {
    return {
      detailStatus: "mine",
      packageId: "1224376020367310848",
      dataAll: {
        businessId: "",
        taskId: "",
      },
    };
  },
  async mounted() {
    this.dataAll.businessId = this.$route.query.businessId;
    this.detailStatus = this.$route.query.detailStatus;
    const messageEventListener = window.addEventListener(
      "message",
      this.handelMessageEvent,
      false
    );
    
    this.$once("hook:beforeDestroy", function () {
      removeEventListener("message", messageEventListener);
    });
    /**
     * 给Iframe加入maintenance参数
     */
    const fixedIframe = () => {
        const iframe = this.$refs.SzgcProcessGetor.$el.querySelector("iframe");
        if (!iframe) {
          requestAnimationFrame(fixedIframe);
        } else {
          const src = iframe.src;
          this.iframe = iframe;
          if (src) {
            const urlInstance = new URL(src);
            const hash = urlInstance.hash;
            iframe.src = `${urlInstance.origin}/?${urlInstance.hash}&maintenance=1`;
            
          }

          return;
        }
      };
      requestAnimationFrame(fixedIframe);
  },
  methods: {
    sendMessageToChildIFrame() {
      if (window.frames) {
        this.iframe.contentWindow.postMessage(
          {
            btnKey: "maintenance",
            type: "maintenance",
          },
          this.iframe.src
        );
      }
    },
    handelFlowDialogConfirm() {
      this.sendMessageToChildIFrame();
    },
    handelMessageEvent(event) {
      const { data } = event;
      if (data.btnKey === "send" || data.btnKey === "submit") {
        if (!this.validateForm()) return;
        const businessId = data.businessId || this.$route.query.businessId;
        const submitData = {};
        Object.keys(this.$options.data().formData).forEach((key) => {
          submitData[key] = this.formData[key];
        });
        this.sendMessage(
          {
            businessId,
            type: data.type,
            page: data.page,
            btnKey: data.btnKey,
            data: submitData,
            message: "数据已接收",
          },
          event.origin
        );
      }
      if (data.type === "maintenance") {
        const parentWindow = window.opener;
        if (parentWindow) {
          parentWindow.makePdfByForm?.(data.data);
          window.close();
        }
        // this.makePdfByForm(data.data);
        // this.flowShow = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-mimicry-process {
    height: calc(100% - 30px);
    display: flex;
    flex-direction: column;
    .wbench-process-page {
        height: 0;
        flex: 1;
    }
}
</style>
