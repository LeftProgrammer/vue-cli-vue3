<template>
  <div>
    <el-dialog
      v-model="visibleInner"
      title="流程处理表单"
      custom-class="flow-handle-dialog wbench-el-dialog"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      center
      fullscreen
      :before-close="beforeCloseDialog"
      @closed="closedHandle"
    >
      <SzgcProcessGetor
        v-if="visibleInner"
        ref="SzgcProcessGetor"
        :top-show="false"
        :page="flowInfo.page"
        :data-all="mergedDataAll"
        :save-api="saveApi"
        @child-evt="childEvtHandle"
      >
        <template #form="{ dataAll, page, readonly }">
          <slot name="form" :data-all="dataAll" :page="page" :readonly="readonly" />
        </template>
        <template #flow-chart>
          <slot name="flow-chart" />
        </template>
      </SzgcProcessGetor>
    </el-dialog>

    <el-image
      v-if="showImage"
      id="imPre"
      ref="imageRef"
      style="width: 0; height: 0"
      :src="imageUrl"
      :preview-src-list="imageSrcList"
      draggable="false"
    />
  </div>
</template>

<script>
import SzgcProcessGetor from "@/components/SzgcProcess/index.vue";

export default {
  name: "FlowHandleDialog",
  components: {
    SzgcProcessGetor,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    flowInfo: {
      type: Object,
      default: () => ({
        businessId: "",
        status: false,
        page: "",
        taskId: "",
        procTaskId: "",
      }),
    },
    dataAll: {
      type: Object,
      default: () => ({}),
    },
    saveApi: {
      type: Function,
      default: null,
    },
  },
  emits: ["closed", "childEvt", "update:visible"],
  data() {
    return {
      visibleInner: false,
      showImage: false,
      imageUrl: "",
      imageSrcList: [],
    };
  },
  computed: {
    mergedDataAll() {
      return {
        ...this.dataAll,
        flowInfo: this.flowInfo,
        businessId: this.flowInfo?.businessId || this.dataAll?.id,
      };
    },
  },
  watch: {
    visible: {
      handler(val) {
        this.visibleInner = !!val;
        if (val) {
          this.$bus?.emit("updateTodoNum");
        }
      },
      immediate: true,
    },
  },
  created() {
    window.addEventListener("message", this.handleIframeMessage);
  },
  beforeUnmount() {
    window.removeEventListener("message", this.handleIframeMessage);
  },
  methods: {
    handleIframeMessage(event) {
      if (event.data?.action === "moveImage") {
        this.showImage = true;
        this.imageUrl = this.getMinioUrl(event.data.file?.url);
        this.imageSrcList = [this.imageUrl];
        this.$nextTick(() => {
          this.$refs.imageRef?.clickHandler();
        });
      }
    },
    getMinioUrl(url) {
      if (!url) return "";
      try {
        const urlObj = new URL(url);
        return urlObj.pathname + urlObj.search;
      } catch (e) {
        return url;
      }
    },
    childEvtHandle(data) {
      this.$emit("childEvt", data);
      if (data?.type === "submit" && data?.success) {
        this.visibleInner = false;
      }
    },
    beforeCloseDialog(done) {
      if (this.$route?.query?.dialog) {
        window.close();
      }
      this.$clearStorage?.("resultsType");
      const noticePath = [
        "/progress/TotalPlan",
        "/progress/ProgressPlan",
        "/progress/MonthPlan",
      ];
      const route = this.$route?.path;
      const localStorage = this.$getStorage?.("flow_page_type");
      if (
        noticePath.includes(route) &&
        (localStorage === "wait" || localStorage === "mine")
      ) {
        this.$confirm("请保存数据！", "提示", {
          cancelButtonText: "返回填写页面",
          confirmButtonText: "退出",
          type: "warning",
        })
          .then(() => done())
          .catch(() => {});
      } else {
        done();
      }
    },
    closedHandle() {
      this.$clearStorage?.("reply");
      this.$emit("closed");
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.wbench-el-dialog.is-fullscreen) {
  .el-dialog__body {
    height: calc(100% - 57px);
  }
}

:deep(.flow-handle-dialog) {
  min-width: 1200px;
  min-height: 700px;
}
</style>
