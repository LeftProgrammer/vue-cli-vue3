<template>
  <div class="szgc-process-getor">
    <!-- 顶部区域 -->
    <div v-if="topShow" class="process-header">
      <div class="header-title">{{ title }}</div>
      <div class="header-actions">
        <slot name="header-actions" />
      </div>
    </div>

    <div class="process-body">
      <!-- 左侧：表单区域 -->
      <div class="process-left">
        <el-tabs v-model="activeTab" class="process-tabs">
          <el-tab-pane label="表单" name="form">
            <div class="form-container">
              <slot name="form" :data-all="dataAll" :page="page" :readonly="isReadonly">
                <!-- 优先使用动态组件 -->
                <component
                  v-if="dynamicFormComponent"
                  :is="dynamicFormComponent"
                  ref="dynamicForm"
                  :data-all="dataAll"
                  :page="page"
                  :readonly="isReadonly"
                  @saved="handleFormSaved"
                />
                <!-- iframe兆底 -->
                <iframe
                  v-else-if="resolvedFormUrl"
                  ref="formIframe"
                  :src="resolvedFormUrl"
                  class="form-iframe"
                  frameborder="0"
                />
                <el-empty v-else description="请配置表单或通过slot传入表单组件" />
              </slot>
            </div>
          </el-tab-pane>
          <el-tab-pane label="流程" name="flow">
            <ProcessFlow
              ref="processFlow"
              :business-id="businessId"
              :flow-config-id="flowConfigId"
            >
              <template #chart>
                <slot name="flow-chart" />
              </template>
            </ProcessFlow>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 右侧：审批区域 -->
      <div class="process-right">
        <ProcessOpinion
          v-if="showOpinion"
          ref="processOpinion"
          :business-id="businessId"
          :proc-task-id="procTaskId"
          :node-name="nodeName"
          :node-user="nodeUser"
          :page="page"
          :save-api="saveApi"
          :data-all="dataAll"
          @success="handleOpinionSuccess"
          @error="handleOpinionError"
        />

        <div v-if="isReadonly" class="readonly-tip">
          <el-tag type="info">当前为只读模式</el-tag>
        </div>

        <el-divider />

        <!-- 流程日志 -->
        <ProcessLogs ref="processLogs" :business-id="businessId" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent, markRaw } from "vue";
import ProcessOpinion from "./components/ProcessOpinion.vue";
import ProcessLogs from "./components/ProcessLogs.vue";
import ProcessFlow from "./components/ProcessFlow.vue";
import { parseIframePath, getFormModule, hasFormModule } from "./formModules";

export default {
  name: "SzgcProcessGetor",
  components: {
    ProcessOpinion,
    ProcessLogs,
    ProcessFlow,
  },
  props: {
    topShow: {
      type: Boolean,
      default: false,
    },
    page: {
      type: String,
      default: "todo",
    },
    dataAll: {
      type: Object,
      default: () => ({}),
    },
    formUrl: {
      type: String,
      default: "",
    },
    saveApi: {
      type: Function,
      default: null,
    },
  },
  emits: ["childEvt"],
  data() {
    return {
      activeTab: "form",
      dynamicFormComponent: null,
      formModulePath: "",
    };
  },
  computed: {
    title() {
      return this.dataAll?.procMatterRun?.businessName || "流程处理";
    },
    businessId() {
      return (
        this.dataAll?.businessId ||
        this.dataAll?.flowInfo?.businessId ||
        this.dataAll?.id ||
        ""
      );
    },
    procTaskId() {
      return (
        this.dataAll?.flowInfo?.procTaskId ||
        this.dataAll?.flowInfo?.taskId ||
        this.dataAll?.matterTaskTodo?.procTaskId ||
        ""
      );
    },
    flowConfigId() {
      return (
        this.dataAll?.matterTaskTodo?.flowConfigId ||
        this.dataAll?.procMatterRun?.flowConfigId ||
        ""
      );
    },
    nodeName() {
      return this.dataAll?.matterTaskTodo?.procTaskName || this.dataAll?.flowName || "";
    },
    nodeUser() {
      return this.dataAll?.matterTaskTodo?.realName || "";
    },
    isReadonly() {
      return ["view", "done", "finished"].includes(this.page);
    },
    showOpinion() {
      return ["todo", "wait", "mine"].includes(this.page);
    },
    // 从iframeConfig获取原始路径（用于iframe兜底）
    resolvedFormUrl() {
      if (this.formUrl) return this.formUrl;
      const iframeConfig = this.iframeConfig;
      if (!iframeConfig) return "";
      const path = parseIframePath(iframeConfig);
      // 如果有动态组件映射，不使用iframe
      if (hasFormModule(path)) return "";
      // 返回原始路径用于iframe
      try {
        if (typeof iframeConfig === "string") return iframeConfig;
        if (iframeConfig.value) {
          const parsed = typeof iframeConfig.value === "string" ? JSON.parse(iframeConfig.value) : iframeConfig.value;
          return parsed.web || parsed.app || "";
        }
        return "";
      } catch (e) {
        return "";
      }
    },
    // 从dataAll中获取iframe配置
    // 支持多种数据结构：
    // 1. dataAll.fields.iframe (fresh-read/finished-read接口返回)
    // 2. dataAll.iframe (兼容旧格式)
    // 3. dataAll.procMatterRun.iframe (兼容旧格式)
    iframeConfig() {
      return (
        this.dataAll?.fields?.iframe ||
        this.dataAll?.iframe ||
        this.dataAll?.procMatterRun?.iframe ||
        null
      );
    },
  },
  watch: {
    // 监听iframe配置变化，加载动态组件
    iframeConfig: {
      handler(config) {
        this.loadDynamicForm(config);
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.initMessageListener();
  },
  beforeUnmount() {
    this.removeMessageListener();
  },
  methods: {
    initMessageListener() {
      window.addEventListener("message", this.handleIframeMessage);
    },
    removeMessageListener() {
      window.removeEventListener("message", this.handleIframeMessage);
    },
    handleIframeMessage(event) {
      if (event.data?.action === "moveImage") {
        this.$emit("childEvt", {
          type: "image",
          data: event.data,
        });
      }
      if (event.data?.action === "formSaved") {
        this.$emit("childEvt", {
          type: "formSaved",
          data: event.data,
        });
      }
    },
    handleOpinionSuccess(data) {
      this.$emit("childEvt", {
        type: "submit",
        success: true,
        data: data,
      });
    },
    handleOpinionError(data) {
      this.$emit("childEvt", {
        type: "submit",
        success: false,
        error: data,
      });
    },
    refreshLogs() {
      this.$refs.processLogs?.refresh();
    },
    getOpinionData() {
      return this.$refs.processOpinion?.getSubmitData();
    },
    resetOpinion() {
      this.$refs.processOpinion?.reset();
    },
    // 加载动态表单组件
    loadDynamicForm(iframeConfig) {
      if (!iframeConfig) {
        this.dynamicFormComponent = null;
        this.formModulePath = "";
        return;
      }
      const path = parseIframePath(iframeConfig);
      if (!path) {
        this.dynamicFormComponent = null;
        return;
      }
      // 避免重复加载
      if (path === this.formModulePath) return;
      this.formModulePath = path;

      if (hasFormModule(path)) {
        const loader = getFormModule(path);
        this.dynamicFormComponent = markRaw(
          defineAsyncComponent({
            loader,
            loadingComponent: {
              template: '<div style="padding:20px;text-align:center;"><el-skeleton :rows="8" animated /></div>',
            },
            errorComponent: {
              template: '<el-empty description="表单加载失败" />',
            },
            delay: 200,
            timeout: 30000,
          })
        );
        console.log("[流程表单] 加载动态组件:", path);
      } else {
        console.warn("[流程表单] 未找到组件映射，将使用iframe:", path);
        this.dynamicFormComponent = null;
      }
    },
    handleFormSaved(data) {
      this.$emit("childEvt", { type: "formSaved", data });
    },
    // 获取动态表单组件实例
    getDynamicForm() {
      return this.$refs.dynamicForm;
    },
  },
};
</script>

<style scoped lang="scss">
.szgc-process-getor {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .process-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #e4e7ed;

    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .process-body {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .process-left {
    flex: 1;
    border-right: 1px solid #e4e7ed;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .process-tabs {
      height: 100%;
      display: flex;
      flex-direction: column;

      :deep(.el-tabs__content) {
        flex: 1;
        overflow: auto;
      }

      :deep(.el-tab-pane) {
        height: 100%;
      }
    }

    .form-container {
      height: 100%;
      padding: 16px;
      overflow: auto;
    }

    .form-iframe {
      width: 100%;
      height: 100%;
      min-height: 600px;
      border: none;
    }
  }

  .process-right {
    width: 320px;
    overflow-y: auto;
    padding: 16px 8px;

    .readonly-tip {
      text-align: center;
      padding: 20px 0;
    }
  }
}
</style>
