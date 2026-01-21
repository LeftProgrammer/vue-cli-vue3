<template>
  <div class="process-getor">
    <!-- 添加模式头部：横跨整个页面 -->
    <div v-if="isAddMode" class="add-mode-header">
      <el-button type="primary" :loading="sending" @click="handleSend">
        <el-icon><Promotion /></el-icon>
        发送
      </el-button>
      <div class="header-title-area">
        <el-input :model-value="addModeTitle" readonly class="title-input">
          <template #prepend>标题</template>
        </el-input>
        <el-button plain :loading="savingDraft" @click="handleSaveDraft">
          <el-icon><Document /></el-icon> 保存待发
        </el-button>
      </div>
    </div>

    <div class="process-body">
      <!-- 左侧：表单区域 -->
      <div class="process-left">
        <!-- 左侧头部 - 非add模式 -->
        <div v-if="!isAddMode" class="left-header">
          <div class="business-title">{{ businessTitle }}</div>
          <div class="business-sub">{{ businessSub }}</div>
        </div>
        <!-- 左侧内容：tabs -->
        <el-tabs v-model="activeTab" type="border-card" class="process-tabs">
          <el-tab-pane label="表单" name="form">
            <div class="form-container">
              <slot name="form" :data-all="dataAll" :page="page" :readonly="isReadonly">
                <!-- 优先使用动态组件 -->
                <component
                  :is="dynamicFormComponent"
                  v-if="dynamicFormComponent"
                  ref="dynamicForm"
                  :data-all="dataAll"
                  :page="page"
                  :prop-readonly="isReadonly"
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
        <!-- 右侧头部：非add模式显示 -->
        <div v-if="!isAddMode" class="right-header">
          <template v-if="!isReadonly">
            <div class="node-name">{{ nodeName }}</div>
            <div class="node-user">{{ nodeUser }}</div>
          </template>
        </div>
        <!-- 右侧内容卡片 -->
        <div class="right-card" :class="{ 'readonly-card': isReadonly}">
          <!-- 卡片头部：待办模式显示 -->
          <div v-if="!isReadonly && !isAddMode" class="right-card-header">相关意见</div>
          <!-- 卡片内容 -->
          <div class="right-card-body">
            <!-- 可办理模式：审批意见 + 日志 -->
            <template v-if="!isReadonly && !isAddMode">
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
              <div class="logs-section">
                <ProcessLogs ref="processLogs" :business-id="businessId" />
              </div>
            </template>
            <!-- 其他模式：仅日志 -->
            <template v-else>
              <ProcessLogs ref="processLogs" :business-id="businessId" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent, markRaw } from "vue";
import { Promotion, Document } from "@element-plus/icons-vue";
import ProcessOpinion from "./components/ProcessOpinion.vue";
import ProcessLogs from "./components/ProcessLogs.vue";
import ProcessFlow from "./components/ProcessFlow.vue";
import { parseIframePath, getFormModule, hasFormModule, getFormModuleByRoute } from "./formModules";
import { sendFlow, initSave } from "@/api/flow";

export default {
  name: "SzgcProcessGetor",
  components: {
    Promotion,
    Document,
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
      sending: false,
      savingDraft: false,
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
    // add模式标题：模块名-用户名 (当前时间)
    addModeTitle() {
      const flowName = this.dataAll?.flowInfo?.flowName || this.dataAll?.flowName || "";
      const userName = this.$store?.getters?.realName || this.$store?.getters?.name || "";
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      if (flowName && userName) {
        return `${flowName}-${userName} (${timeStr})`;
      } else if (flowName) {
        return `${flowName} (${timeStr})`;
      } else if (userName) {
        return `${userName} (${timeStr})`;
      }
      return `新建流程 (${timeStr})`;
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
        this.dataAll?.flowInfo?.flowCfgId ||
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
    isAddMode() {
      return ["add", "mine"].includes(this.page);
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
        // 非add模式时，根据iframeConfig加载表单
        if (!this.isAddMode) {
          this.loadDynamicForm(config);
        }
      },
      immediate: true,
      deep: true,
    },
    // add模式下，根据formPath加载表单
    isAddMode: {
      handler(isAdd) {
        if (isAdd) {
          this.loadDynamicFormByRoute();
        }
      },
      immediate: true,
    },
    // 监听dataAll变化，add模式下重新加载表单
    "dataAll.flowInfo.formPath": {
      handler() {
        if (this.isAddMode) {
          this.loadDynamicFormByRoute();
        }
      },
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
    // add模式下根据路由路径加载表单组件
    loadDynamicFormByRoute() {
      const formPath = this.dataAll?.flowInfo?.formPath || "";
      console.log("[流程表单] add模式加载表单, formPath:", formPath);
      
      if (!formPath) {
        // 如果没有formPath，尝试从iframeConfig加载
        if (this.iframeConfig) {
          this.loadDynamicForm(this.iframeConfig);
        } else {
          console.warn("[流程表单] add模式下没有formPath和iframeConfig");
          this.dynamicFormComponent = null;
        }
        return;
      }
      
      // 避免重复加载
      const routeKey = "route:" + formPath;
      if (routeKey === this.formModulePath) return;
      
      const loader = getFormModuleByRoute(formPath);
      if (loader) {
        this.formModulePath = routeKey;
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
        console.log("[流程表单] add模式加载动态组件:", formPath);
      } else {
        // 没有路由映射时，尝试从iframeConfig加载
        if (this.iframeConfig) {
          this.loadDynamicForm(this.iframeConfig);
        } else {
          console.warn("[流程表单] add模式下未找到路由映射:", formPath);
          this.dynamicFormComponent = null;
        }
      }
    },
    // 获取动态表单组件实例
    getDynamicForm() {
      return this.$refs.dynamicForm;
    },
    // 发送流程
    async handleSend() {
      try {
        this.sending = true;
        // 先保存表单
        const formRef = this.$refs.dynamicForm;
        if (formRef && typeof formRef.save === "function") {
          const saveResult = await formRef.save();
          if (!saveResult) {
            this.$message.warning("请先完善表单信息");
            return;
          }
        }
        // 构建发送参数
        const sendData = {
          clientType: "web",
          reqToken: this.dataAll?.reqToken,
          businessId: this.businessId,
          flowCfgId: this.flowConfigId,
          btnKey: this.dataAll?.send?.btnKey || "send",
        };
        const res = await sendFlow(sendData);
        if (res?.success) {
          this.$message.success("发送成功");
          this.$emit("childEvt", { type: "send", action: "send", success: true, data: res.data });
        } else {
          this.$message.error(res?.message || "发送失败");
          this.$emit("childEvt", { type: "send", action: "send", success: false, error: res?.message });
        }
      } catch (e) {
        console.error("发送失败:", e);
        this.$message.error("发送失败");
        this.$emit("childEvt", { type: "send", action: "send", success: false, error: e.message });
      } finally {
        this.sending = false;
      }
    },
    // 保存待发
    async handleSaveDraft() {
      try {
        this.savingDraft = true;
        const formRef = this.$refs.dynamicForm;
        // 1. 先调用表单的save方法保存业务数据
        if (formRef && typeof formRef.save === "function") {
          const saveResult = await formRef.save();
          if (!saveResult) {
            this.$message.warning("请先完善表单信息");
            return;
          }
        }
        
        // 2. 获取保存后的businessId（从表单组件获取）
        const businessId = formRef?.formData?.id || this.businessId;
        if (!businessId) {
          this.$message.error("业务数据保存异常，未获取到业务ID");
          return;
        }
        
        // 3. 构建流程初始化保存参数（与原项目保持一致）
        const pacId = this.dataAll?.pacId || this.dataAll?.flowInfo?.pacId || "";
        const saveData = {
          attIds: null,
          businessId: businessId,
          businessName: this.addModeTitle,
          ccs: null,
          fields: this.dataAll?.sendFlowJson || formRef?.sendFlowJson || {},
          flowCfgId: this.flowConfigId,
          pacId: pacId,
          reqToken: this.dataAll?.reqToken,
        };
        
        // 4. 调用流程初始化保存接口
        const res = await initSave(saveData);
        if (res?.success) {
          this.$message.success("保存成功");
          this.$emit("childEvt", { type: "saveDraft", action: "saveDraft", success: true, data: res.data });
        } else {
          this.$message.error(res?.message || "保存失败");
          this.$emit("childEvt", { type: "saveDraft", action: "saveDraft", success: false, error: res?.message });
        }
      } catch (e) {
        console.error("保存待发失败:", e);
        this.$message.error("保存失败");
        this.$emit("childEvt", { type: "saveDraft", action: "saveDraft", success: false, error: e.message });
      } finally {
        this.savingDraft = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.process-getor {
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
        padding: 10px 12px;
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

    .empty-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .empty-text {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  // add模式头部：横跨整个页面
  .add-mode-header {
    display: flex;
    align-items: stretch;
    background: #fff;
    margin-bottom: 12px;

    > .el-button {
      width: 88px;
      min-width: 88px;
      height: auto;
      font-size: 18px;
    }

    .header-title-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 12px;
      gap: 6px;

      > .el-button {
        align-self: flex-start;
      }
    }
  }
}
</style>

<style lang="scss">
// 全局样式：让弹窗body撑满
.el-dialog:has(.process-getor) {
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
