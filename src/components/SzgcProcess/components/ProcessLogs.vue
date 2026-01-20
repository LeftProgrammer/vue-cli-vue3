<template>
  <div class="process-logs">
    <el-timeline v-if="logs.length">
      <el-timeline-item
        v-for="(log, index) in logs"
        :key="index"
        hide-timestamp
      >
        <div class="log-header">
          <span class="log-user">【{{ log.createUserName }}】</span>
          <span class="log-action">-{{ formatBtnKey(log.btnKey, log.optionKey) }}-{{ formatTime(log.createTime) }}</span>
        </div>
        <el-card shadow="hover" class="log-card">
          <div class="log-content">{{ log.logMsg || log.idea || '' }}</div>
          <div v-if="getSignSrc(log.createUserId)" class="log-sign">
            <img :src="getSignSrc(log.createUserId)" />
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暂无流程日志" />
  </div>
</template>

<script>
import dayjs from "dayjs";
import { alllogs, getSignMapByIdList } from "@/api/flow";

// btnKey 操作类型映射
const BTN_KEY_MAP = {
  send: "发送",
  initial: "启动",
  submit: "提交",
  save: "保存",
  reject: "退回",
  transfer: "转办",
  cc: "抄送",
  recall: "撤回",
  terminate: "终止",
};

// optionKey 选项映射
const OPTION_KEY_MAP = {
  agree: "同意",
  reject: "拒绝",
  disagree: "不同意",
};

export default {
  name: "ProcessLogs",
  props: {
    businessId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      logs: [],
      signMap: {},
      loading: false,
    };
  },
  watch: {
    businessId: {
      handler(val) {
        if (val) {
          this.loadLogs();
        }
      },
      immediate: true,
    },
  },
  methods: {
    async loadLogs() {
      if (!this.businessId) return;
      this.loading = true;
      try {
        const res = await alllogs(this.businessId);
        if (res && res.success) {
          this.logs = res.data || [];
          this.loadSignMap();
        }
      } catch (e) {
        console.error("加载流程日志失败", e);
      } finally {
        this.loading = false;
      }
    },
    async loadSignMap() {
      const userIds = this.logs
        .map((log) => log.createUserId)
        .filter(Boolean);
      if (!userIds.length) return;
      try {
        const res = await getSignMapByIdList(userIds);
        if (res && res.success) {
          this.signMap = res.data || {};
        }
      } catch (e) {
        console.error("加载签名失败", e);
      }
    },
    // 格式化操作类型
    formatBtnKey(btnKey, optionKey) {
      let action = BTN_KEY_MAP[btnKey] || btnKey || "";
      if (optionKey && OPTION_KEY_MAP[optionKey]) {
        action = OPTION_KEY_MAP[optionKey];
      }
      return action;
    },
    // 格式化时间戳
    formatTime(timestamp) {
      if (!timestamp) return "";
      return dayjs(Number(timestamp)).format("YYYY-MM-DD HH:mm:ss");
    },
    // 获取签名图片地址
    getSignSrc(userId) {
      if (!userId) return "";
      const key = String(userId).trim();
      const url = this.signMap[key] || this.signMap[userId] || "";
      if (!url) return "";
      try {
        const urlObj = new URL(url);
        return urlObj.pathname + urlObj.search;
      } catch (e) {
        return url;
      }
    },
    refresh() {
      this.loadLogs();
    },
  },
};
</script>

<style scoped lang="scss">
.process-logs {
  padding: 8px 0;

  :deep(.el-timeline) {
    padding-left: 0;
  }

  :deep(.el-timeline-item) {
    padding-bottom: 12px;
  }

  :deep(.el-timeline-item__wrapper) {
    padding-left: 20px;
  }

  .log-header {
    font-size: 13px;
    color: var(--el-color-primary);
    margin-bottom: 6px;
    line-height: 1.4;
  }

  .log-user {
    font-weight: 500;
  }

  .log-action {
    color: var(--el-color-primary);
  }

  .log-card {
    :deep(.el-card__body) {
      padding: 12px 16px;
    }
  }

  .log-content {
    color: #606266;
    font-size: 14px;
    line-height: 1.5;
    min-height: 20px;
    word-break: break-all;
  }

  .log-sign {
    text-align: right;
    margin-top: 8px;
    
    img {
      width: 100px;
      height: 45px;
      object-fit: contain;
      border-radius: 4px;
    }
  }
}
</style>
