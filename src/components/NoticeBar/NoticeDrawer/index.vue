<template>
  <div class="notice-drawer-main">
    <div class="content">
      <ul class="infinite-list" :style="{ height: contentH + 'px' }">
        <li
          v-for="(i, index) in noticeList"
          :key="i.noticeId"
          class="infinite-list-item"
          :class="i.readStatus ? 'readed' : ''"
          @click.stop="sendData(i, 'detail', index)"
        >
          <span v-if="!i.readStatus" class="dot"></span>
          <div class="title">
            <span class="name">{{ i.noticeTitle }}</span>
          </div>
          <div class="time">{{ i.noticeDate ? dateFormat(i.noticeDate) : "--" }}</div>
        </li>
      </ul>

      <div class="btns">
        <el-button type="primary" @click="moreHandle">查看更多</el-button>
        <el-button type="primary" @click="readAllHandle">一键已读</el-button>
        <el-button type="danger" @click="clearAllHandle">一键清空</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import { dateFormat } from "@/utils";
import { page, noticesmulti, removeNoticeAll } from "@/views/common/message/api";

export default {
  name: "NoticeDrawer",
  emits: ["child-evt", "del-all-and-read-all", "close"],
  data() {
    return {
      contentH: 0,
      noticeList: [],
      query: {
        current: 1,
        pageSize: 200,
        readStatus: 0,
      },
    };
  },
  mounted() {
    this.contentH = window.innerHeight - 87 - 32 - 16;
    this.getNoticeList();
  },
  methods: {
    refresh() {
      return this.getNoticeList();
    },
    dateFormat(time) {
      return dateFormat(time, "YYYY-MM-DD HH:mm:ss");
    },
    async getNoticeList() {
      try {
        const res = await page(this.query);
        if (!res || !res.success) {
          ElMessage.error((res && res.message) || "获取通知列表失败");
          return;
        }
        const records = (res.data && res.data.records) || [];
        this.noticeList = records;
      } catch (e) {
        ElMessage.error("获取通知列表失败");
      }
    },
    moreHandle() {
      this.$emit("close");
      this.$router
        .push({
          path: "/common/message",
          query: { permCode: "common-message" },
        })
        .catch(() => {});
    },
    async readAllHandle() {
      const ids = this.noticeList
        .filter(x => !x.readStatus)
        .map(x => x.noticeId)
        .filter(Boolean);
      if (!ids.length) {
        return;
      }
      try {
        const confirm = await ElMessageBox.confirm("确认全部设置已读？", "提示");
        if (!confirm) return;
      } catch (e) {
        return;
      }

      try {
        const res = await noticesmulti(ids);
        if (!res || !res.success) {
          ElMessage.error((res && res.message) || "全部标记为已读失败");
          return;
        }
        await this.getNoticeList();
        this.$emit("del-all-and-read-all");
        this.$bus && this.$bus.emit && this.$bus.emit("noticeNotReadCount");
      } catch (e) {
        ElMessage.error("全部标记为已读失败");
      }
    },
    async clearAllHandle() {
      const ids = this.noticeList.map(x => x.noticeId).filter(Boolean);
      if (!ids.length) {
        return;
      }
      try {
        const confirm = await ElMessageBox.confirm("确认清空通知列表？", "提示");
        if (!confirm) return;
      } catch (e) {
        return;
      }

      try {
        const res = await removeNoticeAll({ data: ids });
        if (!res || !res.success) {
          ElMessage.error((res && res.message) || "清空通知列表失败");
          return;
        }
        await this.getNoticeList();
        this.$emit("del-all-and-read-all");
        this.$bus && this.$bus.emit && this.$bus.emit("noticeNotReadCount");
      } catch (e) {
        ElMessage.error("清空通知列表失败");
      }
    },
    sendData(item, type, index) {
      this.$emit("child-evt", { type, data: { ...item }, index });
    },
    seRead(index) {
      if (typeof index !== "number") return;
      if (index < 0 || index >= this.noticeList.length) return;
      this.noticeList.splice(index, 1);
    },
    removeById(noticeId) {
      if (!noticeId) return;
      const idx = this.noticeList.findIndex(x => x && x.noticeId === noticeId);
      if (idx > -1) {
        this.noticeList.splice(idx, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.notice-drawer-main {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #72767b;
}

.content {
  flex: 1;
  overflow: hidden;
}

.infinite-list {
  overflow: auto;
  padding: 0;
  margin: 0;
}

.infinite-list-item {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding: 10px 20px 10px 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
}

.infinite-list-item:hover {
  background-color: #f7f7f7;
}

.name {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  font-size: 12px;
  color: #909399;
}

.dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background: red;
  left: 15px;
  top: 25px;
}

.readed {
  background-color: #f7f7f7;
}

.btns {
  height: 35px;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: calc(100% - 20px);
}
</style>
