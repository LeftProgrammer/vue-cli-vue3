<template>
  <div class="notice-bar" @click="showNotice = true">
    <el-badge
      :value="noticeCount || ''"
      :is-dot="!!!noticeCount || noticeCount === 0"
      :hidden="!!!noticeCount || noticeCount === 0"
      class="badge-item"
      title="通知"
    >
      <slot v-if="$slots.icon" name="icon" />
      <img
        class="icon-topBar"
        :src="require('@/assets/img/system/remind.png')"
      />
    </el-badge>
    <span class="font-topBar">消息</span>
    <!--消息列表-->
    <el-drawer
      class="notice-drawer"
      :title="`${title}(${noticeCount})`"
      :size="size"
      :visible.sync="showNotice"
      direction="rtl"
      :modal="false"
      :append-to-body="true"
      @closed="closeEvt"
    >
      <NoticeDrawer
        v-if="showNotice"
        ref="NoticList"
        :notice-count.sync="noticeCount"
        @childEvt="noticeChildEvt"
        @delAllAndReadAll="delAllAndReadAll"
      />
    </el-drawer>
    <!--消息详情-->
    <!-- <el-dialog
      title="通知详情"
      class="notice-dialog"
      :visible.sync="noticeShow"
      fullscreen
      append-to-body
    >
      <notice-detail
        v-if="noticeShow"
        :data-all="noticeData"
        @goBack="noticeShow = false"
      />
    </el-dialog> -->
    <dataform
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="closedHandle"
    ></dataform>
  </div>
</template>

<script>
import * as plt from "@szgc/plt-core";
import * as api from "./api";
import { socket } from "@szgc/plt-core";
export default {
  components: {
    NoticeDrawer: () => import("./NoticeDrawer/index"),
    NoticeDetail: () => import("./NoticeDetail/index.vue"),
    dataform: () => import("@/views/common/message/dataform"),
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
    noticeEvent: {
      type: Function,
      default: function () {},
    },
  },
  data() {
    return {
      showNotice: false,
      //抽屉模式的消息的顺序号
      noticeIndex: 0,
      noticeCount: 0,
      noticeShow: false,
      noticeData: null,
      oprateRow: {
        dialogShow: false,
        data: {},
        isView: true,
      },
    };
  },
  created() {
    // 绑定更新未读消息数量事件总线
    // this.$bus.off("noticeNotReadCount", () => console.log("$offsuccess"));
    // this.$bus.on("noticeNotReadCount", (val) => {
    //   this.getNoticeReadedCount();
    // });
  },
  mounted() {
    this.$bus.on("noticeNotReadCount", (val) => {
      this.getNoticeReadedCount();
    });
    this.getNoticeReadedCount();
    console.log('页面')
    socket.on("NOTICE", (data) => {
      console.error("监听到ws------------", data);
      if (data.noticeType == "20") {
        // this.$bus.emit("updateTodoNum"); // 触发更新待办事项数量事件
        // this.$bus.emit("noticeNotReadCount"); // 触发更新待办事项数量事件
        this.getNoticeReadedCount();
      }
    });
  },
  beforeDestroy() {
    // 解绑更新未读消息数量事件总线
    // this.$bus.off("noticeNotReadCount", () => console.log("$offsuccess"));
  },
  methods: {
    // 一键已读   一键删除 回调
    delAllAndReadAll() {
      this.getNoticeReadedCount();
    },
    // 详情关闭回调
    closedHandle() {
      console.log("关闭弹窗");
      this.oprateRow.data = {};
      this.oprateRow.dialogShow = false;
      this.noticeCount--;
      this.$refs.NoticList.seRead(this.noticeIndex);
    },

    // 获取消息数量
    async getNoticeReadedCount() {
      try {
        const res = await api.getNoticeReadedCount();
        if (!res.success) {
          return this.$message.error(res.message);
        }
        this.noticeCount = res.data;
        console.log("获取待办事项", res, this.noticeCount);
      } catch (error) {
        this.$message.error(error);
      }
    },
    onWsNotice() {
      // console.log("onWsNotice");
      this.noticeCount += 1;
    },
    /* 查询单条通知详情*/
    async getNoticeDetail(params) {
      try {
        const { data, success, message } = await api.getNoticeDetail({
          noticeId: params.noticeId,
        });
        if (!success) {
          return this.$message.error("获取通知详情失败：" + message);
        }
        // this.noticeData = data;
        this.oprateRow.data = data;
        this.oprateRow.dialogShow = true;
      } catch (error) {
        this.$message.error(error);
      }
    },
    /* 点击单条通知*/
    async noticeChildEvt(data) {
      if (data.type === "detail") {
        this.noticeIndex = data.index;
        await this.getNoticeDetail(data.data);
        return;
        this.noticeData = null;
        await this.getNoticeDetail(data.data);
        if (this.noticeData) {
          this.noticeShow = true;
        }
      }
      if (data.type === "data") {
        this.noticeData = null;
        await this.getNoticeDetail(data.data);
        this.$emit("childEvt", { type: "sure", data: this.noticeData }); // 回吐数据单独抛出一个事件。
      }
    },
    /* 关闭事件*/
    closeEvt() {
      // 更新未读消息数量
      // this.$bus.emit('noticeNotReadCount');
      this.getNoticeReadedCount();
      this.$emit("childEvt", { type: "close" });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-message-solid {
  font-size: 17px;
}

.notice-bar {
  cursor: pointer;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .badge-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep .badge-item .el-badge__content.is-fixed {
    padding: 3px;
    height: 22px;
    line-height: 14px;
    width: 22px;
    top: 2px;
    right: 20px;
  }
}

.notice-drawer {
  ::v-deep .el-drawer__header {
    padding: 10px 20px;
    margin-bottom: 5px;
    border-bottom: 1px solid #eee;
  }
}

.notice-dialog {
  ::v-deep .el-dialog__header {
    padding: 0 10px;
    height: 45px;
    line-height: 45px;
    background-color: #00c0ff;
  }

  ::v-deep .el-dialog__body {
    width: 100% !important;
    height: calc(100% - 45px);
    padding: 0;
  }
}
.icon-topBar {
  position: relative;
  right: 8px;
  width: 22px;
}
.font-topBar {
  font-weight: 500;
  font-size: 16px;
  margin-left: 7px;
  margin-right: 10px;
  line-height: 46px;
  color: white;
}
::v-deep .el-badge__content {
  border: 0;
}

// 1080p以下自适应样式
@media screen and (max-width: 1440px) {
  .font-topBar {
    font-size: 16px;
    margin-right: 0;
  }
  .icon-topBar {
    width: 22px;
    margin-right: 0;
  }
}
// 1080p自适应样式
@media screen and (min-width: 1441px) and (max-width: 1920px) {
  .font-topBar {
    font-size: 16px;
    margin-right: 0;
  }
  .icon-topBar {
    width: 22px;
    margin-right: 0;
  }
}
</style>
