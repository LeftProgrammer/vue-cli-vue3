<template>
  <div class="notice-bar" @click="showNotice = true">
    <el-badge
      :value="noticeCount || ''"
      :is-dot="!noticeCount || noticeCount === 0"
      :hidden="!noticeCount || noticeCount === 0"
      class="badge-item"
      title="通知"
    >
      <img class="icon-topBar" :src="remindIcon" />
    </el-badge>
    <span class="font-topBar">消息</span>

    <el-drawer
      v-model="showNotice"
      class="notice-drawer"
      :title="`${title}(${noticeCount})`"
      :size="size"
      direction="rtl"
      :modal="false"
      :append-to-body="true"
      @closed="closeEvt"
    >
      <NoticeDrawer
        v-if="showNotice"
        ref="noticeListRef"
        @child-evt="noticeChildEvt"
        @del-all-and-read-all="delAllAndReadAll"
        @close="showNotice = false"
      />
    </el-drawer>

    <MessageDataform
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="closedHandle"
    />
  </div>
</template>

<script>
import { socket } from "@/utils/socket";
import NoticeDrawer from "./NoticeDrawer/index.vue";
import MessageDataform from "@/views/common/message/dataform.vue";
import { getNoticeReadedCount, getNoticeDetail, notices } from "@/views/common/message/api";

export default {
  name: "NoticeBar",
  components: {
    NoticeDrawer,
    MessageDataform,
  },
  props: {
    title: {
      type: String,
      default: "消息列表",
    },
    size: {
      type: String,
      default: "25%",
    },
  },
  data() {
    return {
      showNotice: false,
      noticeCount: 0,
      noticeIndex: 0,
      noticeId: null,
      oprateRow: {
        dialogShow: false,
        data: {},
        isView: true,
      },
      onSocketNoticeHandler: null,
      onBusHandler: null,
      remindIcon: require("@/assets/img/system/remind.png"),
    };
  },
  mounted() {
    this.onBusHandler = () => {
      this.getNoticeReadedCount();
    };
    this.$bus && this.$bus.on && this.$bus.on("noticeNotReadCount", this.onBusHandler);

    this.onSocketNoticeHandler = data => {
      if (data && data.noticeType == "20") {
        this.getNoticeReadedCount();
      }
    };
    socket.on && socket.on("NOTICE", this.onSocketNoticeHandler);

    this.getNoticeReadedCount();
  },
  beforeUnmount() {
    if (this.$bus && this.$bus.off && this.onBusHandler) {
      this.$bus.off("noticeNotReadCount", this.onBusHandler);
    }
    if (socket.off && this.onSocketNoticeHandler) {
      socket.off("NOTICE", this.onSocketNoticeHandler);
    }
  },
  methods: {
    async getNoticeReadedCount() {
      try {
        const res = await getNoticeReadedCount();
        if (res && res.success) {
          this.noticeCount = res.data || 0;
        }
      } catch (e) {
        void e;
      }
    },
    delAllAndReadAll() {
      this.getNoticeReadedCount();
    },
    async noticeChildEvt(payload) {
      if (!payload || payload.type !== "detail") {
        return;
      }
      const row = payload.data;
      const index = payload.index;
      if (!row || !row.noticeId) {
        return;
      }
      this.noticeIndex = typeof index === "number" ? index : 0;
      this.noticeId = row.noticeId;
      try {
        const res = await getNoticeDetail(row.noticeId);
        if (res && res.success) {
          this.oprateRow.data = res.data || row;
          this.oprateRow.dialogShow = true;
          this.oprateRow.isView = true;
        }
      } catch (e) {
        void e;
      }
    },
    async closedHandle(row) {
      this.oprateRow.data = {};
      this.oprateRow.dialogShow = false;

      const noticeId = (this.noticeId || (row && row.noticeId)) ?? null;
      if (noticeId) {
        try {
          const res = await notices(noticeId);
          if (res && res.success) {
            if (this.noticeCount > 0) {
              this.noticeCount -= 1;
            }
            const list = this.$refs.noticeListRef;
            if (list && list.removeById) {
              list.removeById(noticeId);
            } else if (list && list.seRead) {
              list.seRead(this.noticeIndex);
            }
            if (list && list.refresh) {
              list.refresh();
            }
          }
        } catch (e) {
          void e;
        }
      }

      this.getNoticeReadedCount();
      this.noticeId = null;
    },
    closeEvt() {
      this.getNoticeReadedCount();
    },
  },
};
</script>

<style lang="scss" scoped>
.notice-bar {
  cursor: pointer;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.badge-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.badge-item .el-badge__content.is-fixed) {
  padding: 3px;
  height: 22px;
  line-height: 14px;
  width: 22px;
  top: 2px;
  right: 20px;
}

.icon-topBar {
  position: relative;
  right: 8px;
  width: 22px;
  height: 22px;
}

.font-topBar {
  font-weight: 500;
  font-size: 16px;
  margin-left: 7px;
  margin-right: 10px;
  line-height: 46px;
  color: #ffffff;
}

:deep(.el-badge__content) {
  border: 0;
}
</style>
