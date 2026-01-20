<template>
  <div class="szgc-process-getor">
    <div class="process-body">
      <!-- 左侧：表单区域 -->
      <div class="process-left">
        <!-- 左侧头部 -->
        <div class="left-header">
          <div class="business-title">{{ businessTitle }}</div>
          <div class="business-sub">{{ businessSub }}</div>
        </div>
        <!-- 左侧内容：tabs -->
        <el-tabs v-model="activeTab" type="border-card" class="process-tabs">
          <el-tab-pane label="表单" name="form">
            <div class="form-container">
              <slot name="form" :data-all="dataAll" :page="page" :readonly="true">
                <!-- 优先使用动态组件 -->
                <component
                  v-if="dynamicFormComponent"
                  :is="dynamicFormComponent"
                  ref="dynamicForm"
                  :data-all="dataAll"
                  :page="page"
                  :prop-readonly="true"
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
        <!-- 非只读模式：完整显示 -->
        <template v-if="!isReadonly">
          <!-- 右侧头部 -->
          <div class="right-header">
            <div class="node-name">{{ nodeName }}</div>
            <div class="node-user">{{ nodeUser }}</div>
          </div>
          <!-- 右侧内容块：模拟tabs样式 -->
          <div class="right-card">
            <!-- 相关意见：tabs头部样式 -->
            <div class="right-card-header">相关意见</div>
            <!-- 内容区 -->
            <div class="right-card-body">
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
              <!-- 流程日志 -->
              <div class="logs-section">
                <ProcessLogs ref="processLogs" :business-id="businessId" />
              </div>
            </div>
          </div>
        </template>

        <!-- 只读模式：仅显示流程日志，保持header占位对齐 -->
        <template v-else>
          <div class="right-header"></div>
          <div class="right-card readonly-card">
            <div class="right-card-body">
              <ProcessLogs ref="processLogs" :business-id="businessId" />
            </div>
          </div>
        </template>
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
    // 业务标题：直接使用接口返回的businessName
    businessTitle() {
      return (
        this.dataAll?.businessName ||
        this.dataAll?.run?.businessName ||
        this.dataAll?.procMatterRun?.businessName ||
        "流程处理"
      );
    },
    // 业务副标题：创建人 + 时间
    businessSub() {
      const createUserName = this.dataAll?.run?.createUserName || "";
      const createTime = this.dataAll?.run?.createTime;
      if (createUserName && createTime) {
        const date = new Date(Number(createTime));
        const timeStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
        return `${createUserName} 发起于 ${timeStr}`;
      }
      return createUserName;
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
        this.dataAll?.run?.flowCfgId ||
        this.dataAll?.flowCfgId ||
        this.dataAll?.matterTaskTodo?.flowConfigId ||
        this.dataAll?.procMatterRun?.flowConfigId ||
        ""
      );
    },
    nodeName() {
      return (
        this.dataAll?.task?.procTaskName ||
        this.dataAll?.matterTaskTodo?.procTaskName ||
        this.dataAll?.flowName ||
        ""
      );
    },
    nodeUser() {
      return (
        this.dataAll?.task?.realName ||
        this.dataAll?.matterTaskTodo?.realName ||
        ""
      );
    },
    isReadonly() {
      return ["view", "done", "finished", "fine", "sent", "cc"].includes(this.page);
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
      console.log("[流程表单] iframeConfig:", iframeConfig, "dataAll.fields:", this.dataAll?.fields);
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
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;

  .process-body {
    flex: 1;
    display: flex;
    gap: 8px;
    overflow: visible;
    min-width: 0;
    min-height: 0;
  }

  .process-left {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;

    .left-header {
      height: 46px;
      min-height: 46px;
      box-sizing: border-box;

      .business-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        line-height: 1.4;
      }

      .business-sub {
        font-size: 12px;
        color: #909399;
        margin-top: 2px;
      }
    }

    .process-tabs {
      flex: 1;
      display: flex;
      flex-direction: column;
      border-radius: 4px;
      box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.15);
      overflow: hidden;

      :deep(.el-tabs__content) {
        flex: 1;
        overflow: auto;
        padding: 12px;
      }

      :deep(.el-tab-pane) {
        height: 100%;
      }
    }

    .form-container {
      height: 100%;
      padding: 16px;
      overflow: auto;
      box-sizing: border-box;
    }

    .form-iframe {
      width: 100%;
      height: 100%;
      min-height: 600px;
      border: none;
    }
  }

  .process-right {
    width: 340px;
    min-width: 280px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    .right-header {
      height: 46px;
      min-height:   46px;
      box-sizing: border-box;

      .node-name {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
      }

      .node-user {
        font-size: 12px;
        color: #909399;
        margin-top: 2px;
      }
    }

    .right-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.15);
      overflow: hidden;

      .right-card-header {
        padding: 10px 20px;
        background: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;
        font-size: 14px;
        font-weight: 500;
        color: #303133;
      }

      .right-card-body {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        background: #fff;
      }
    }

    .readonly-tip {
      text-align: center;
      padding: 20px 0;
    }

    .logs-section {
      margin-top: 26px;
      padding-top: 20px;
      border-top: 1px dashed #e4e7ed;
    }
  }
}
</style>

<style lang="scss">
// 全局样式：让弹窗body撑满
.el-dialog:has(.szgc-process-getor) {
  display: flex;
  flex-direction: column;

  .el-dialog__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: visible;
    min-height: 0;
  }
}
</style>
