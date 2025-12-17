<template>
  <el-dialog
    v-model="visibleInner"
    title="流程处理"
    width="85%"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    @closed="closedHandle"
  >
    <div class="flow-dialog-body">
      <div class="info">
        <div class="row">
          <span class="label">businessId：</span>
          <span class="value">{{ flowInfo && flowInfo.businessId }}</span>
        </div>
        <div class="row">
          <span class="label">taskId：</span>
          <span class="value">{{ flowInfo && (flowInfo.taskId || flowInfo.procTaskId) }}</span>
        </div>
        <div class="row">
          <span class="label">page：</span>
          <span class="value">{{ flowInfo && flowInfo.page }}</span>
        </div>
      </div>

      <el-alert
        type="warning"
        show-icon
        :closable="false"
        title="当前项目无法使用旧项目的 @szgc/wbench（私有库）。这里先提供占位弹窗。等你抓包提供流程办理相关接口与返回数据后，我再补齐表单渲染与提交能力。"
      />
    </div>

    <template #footer>
      <el-button @click="visibleInner = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "FlowHandleDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    flowInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["closed", "child-evt"],
  data() {
    return {
      visibleInner: false,
    };
  },
  watch: {
    visible: {
      handler(val) {
        this.visibleInner = !!val;
      },
      immediate: true,
    },
  },
  methods: {
    closedHandle() {
      this.$emit("closed");
    },
  },
};
</script>

<style scoped lang="scss">
.flow-dialog-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.row {
  display: flex;
  line-height: 24px;
}

.label {
  width: 120px;
  color: #666;
}

.value {
  flex: 1;
  word-break: break-all;
}
</style>
