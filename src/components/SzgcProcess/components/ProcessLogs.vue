<template>
  <div class="process-logs">
    <el-timeline v-if="logs.length">
      <el-timeline-item
        v-for="(log, index) in logs"
        :key="index"
        :timestamp="log.createTime"
        placement="top"
      >
        <el-card shadow="hover">
          <div class="log-header">
            <span class="log-user">【{{ log.createUserName }}】</span>
            <span class="log-action">- {{ log.nodeName }} - {{ log.createTime }}</span>
          </div>
          <div class="log-content">{{ log.opinion || log.idea || '' }}</div>
          <div v-if="signMap[log.createUserId]" class="log-sign">
            <img :src="getSignUrl(signMap[log.createUserId])" width="100" height="45" />
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暂无流程日志" />
  </div>
</template>

<script>
import { alllogs, getSignMapByIdList } from "@/api/flow";

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
    getSignUrl(url) {
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
  .log-header {
    font-size: 12px;
    color: #409eff;
  }

  .log-user {
    font-weight: 500;
  }

  .log-action {
    color: #909399;
  }

  .log-content {
    margin-top: 8px;
    color: #606266;
    min-height: 20px;
  }

  .log-sign {
    text-align: right;
    margin-top: 8px;
    
    img {
      object-fit: contain;
    }
  }
}
</style>
