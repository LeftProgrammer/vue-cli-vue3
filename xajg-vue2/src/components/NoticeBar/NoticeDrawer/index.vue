<template>
  <div class="notice-drawer-main">
    <!--<div class="header">
      <el-dropdown @command="statusSelect">
        <span class="el-dropdown-link">
          {{ statusName }} ({{ count }} 条)
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="2">
            <span>全部</span>
            <i
              v-show="statusName === '全部'"
              class="el-icon-check"
              style="margin-left: 20px"
            />
          </el-dropdown-item>
          <el-dropdown-item command="1">
            <span>已读</span>
            <i
              v-show="statusName === '已读'"
              class="el-icon-check"
              style="margin-left: 20px"
            />
          </el-dropdown-item>
          <el-dropdown-item command="0">
            <span>未读</span>
            <i
              v-show="statusName === '未读'"
              class="el-icon-check"
              style="margin-left: 20px"
            />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    <!-- <el-dropdown @command="controlSelect">
        <span class="el-dropdown-link">
          <i class="el-icon-more" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="putNoticeStatusAll">
            <span>全部标记为已读</span>
          </el-dropdown-item>
          <el-dropdown-item command="removeNoticeRead">
            <span>删除已读的通知</span>
          </el-dropdown-item>
          <el-dropdown-item command="removeNoticeAll">
            <span>清空通知列表</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
    <div class="content">
      <!-- v-infinite-scroll="getMoreNoticeList" -->

      <ul
        class="infinite-list"
        style="overflow: auto"
        :infinite-scroll-distance="distance"
        :infinite-scroll-immediate="true"
        :infinite-scroll-disabled="disabled"
        :style="{ height: contentH + 'px' }"
      >
        <li
          v-for="(i, index) in noticeList"
          :key="i.noticeId"
          class="infinite-list-item"
          :title="i.readStatus ? '已读' : '未读'"
          :class="i.readStatus ? 'readed' : ''"
          :data-person="i.sendUserRealName.slice(0, 1)"
          @click.stop="sendData(i, 'detail', index)"
        >
          <span class="dot"></span>
          <!-- <i class="el-icon-warning-outline title-tag" /> -->
          <div class="title">
            <span class="name">{{ i.noticeTitle }}</span>
          </div>
          <!-- <div class="description">{{ i.noticeSchema }}</div> -->
          <div class="time">
            {{ i.noticeDate ? dateFormat(i.noticeDate) : "--" }}
          </div>
        </li>
      </ul>
      <div class="btns">
        <el-button type="primary" @click="moreHandle">查看更多</el-button>
        <!-- <el-button type="primary" @click="onceReadHandle">一键已读</el-button> -->
        <el-button type="primary" @click="controlSelect('putNoticeStatusAll')">
          一键已读
        </el-button>
        <el-button type="danger" @click="onceClearHandle">一键清空</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { dateFormat } from "@/utils";
import * as api from "../api.js";

export default {
  name: "NoticeDrawer",
  props: {
    noticeCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      statusName: "全部",
      count: 0,
      contentH: 0,
      noticeList: [],
      query: {
        current: 1,
        pageSize: 200, //后端限制在5-200范围内
        readStatus: 0,
      },
      loading: false,
    };
  },
  computed: {
    distance() {
      return 50;
    },
    immediate() {
      return false;
    },
    noMore() {
      return this.noticeList.length >= this.count;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  mounted() {
    this.contentH = window.innerHeight - 87 - 32 - 16;
    this.getNoticeList();
  },
  methods: {
    /**查看更多 */
    moreHandle() {
      let parent = this.$parent.$parent;
      if (parent.showNotice) {
        parent.showNotice = false;
      }
      this.$router.push({
        path: "/common/message",
        query: {
          //query是个配置项
          permCode: "common-message",
        },
      });
    },
    /**一键已读 */
    onceReadHandle() {
      this.controlSelect("putNoticeStatusAll");
    },
    /**一键清空 */
    onceClearHandle() {
      this.controlSelect("removeNoticeAll");
    },
    statusSelect(status) {
      const map = ["未读", "已读", "全部"];
      this.statusName = map[status];
      this.query.readStatus = status === "2" ? "" : status;
      this.getNoticeList();
    },
    async controlSelect(command) {
      try {
        let data = [];
        let msg = "";
        if (command === "putNoticeStatusAll") {
          data = this.noticeList
            .filter((i) => !i.readStatus)
            .map((i) => i.noticeId);
          msg = "全部标记为已读失败";
          let confirm = null;
          try {
            confirm = await this.$confirm(`确认全部设置已读？`, "提示");
          } catch (error) {
            confirm = null;
          }
          if (!confirm) return;
        } else if (command === "removeNoticeRead") {
          data = this.noticeList
            .filter((i) => i.readStatus)
            .map((i) => i.noticeId);
          msg = "删除已读的通知失败";
          let confirm = null;
          try {
            confirm = await this.$confirm(`确认删除所有已读通知？`, "提示");
          } catch (error) {
            confirm = null;
          }
          if (!confirm) return;
        } else if (command === "removeNoticeAll") {
          data = this.noticeList.map((i) => i.noticeId);
          msg = "清空通知列表失败";
          let confirm = null;
          try {
            confirm = await this.$confirm(`确认清空通知列表？`, "提示");
          } catch (error) {
            confirm = null;
          }
          if (!confirm) return;
        }
        const { success, message } = await api[command]({ data });
        if (!success) return this.$message.error(msg + message);
        this.getNoticeList();
        this.$emit("delAllAndReadAll");
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 获取的消息列表
    async getNoticeList() {
      try {
        const { data, success, message } = await api.getNoticeList(this.query);
        if (!success) {
          return this.$message.error("获取通知列表失败：" + message);
        }
        this.noticeList = data.records;
      } catch (error) {
        this.$message.error(error);
      }
    },
    dateFormat(date) {
      return dateFormat(date, "YYYY-MM-DD HH:mm:ss");
    },
    async setReadStatus(id) {
      try {
        const { success, message } = await api.putReadStatus(id);

        if (!success) {
          return this.$message.error("获取通知列表失败：" + message);
        }
        this.getNoticeList();
      } catch (error) {
        this.$message.error(error);
      }
    },

    /* 向父级传递数据*/
    async sendData(item, type, index) {
      let params = { type: type, data: { ...item }, index };
      // console.log("sendData", params);
      // console.log("sendData", item);
      // 通知消息阅读标记  这里本来是做ws 监听的 但是 底层平台说这个接口没有监听所以做不成
      // let res = await api.noticesSetRead(item.noticeId); 

      this.$emit("childEvt", params);
    },
    seRead(index) {
      this.noticeList.splice(index, 1);
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

  .header {
    padding: 5px 20px 10px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    .el-dropdown {
      cursor: pointer;
    }
  }

  .content {
    flex: 1;
    overflow: hidden;

    .btns {
      height: 35px;
      display: flex;
      justify-content: space-between;
      position: absolute;
      bottom: 10px;
      left: 10px;
      width: calc(100% - 20px);

      ::v-deep .el-button {
        cursor: pointer;
      }
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

      .title-tag {
        position: absolute;
        left: 10px;
        top: 10px;
        font-size: 20px;
        font-weight: 400;
        color: #999;
      }

      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        margin-bottom: 5px;

        .btns {
          display: none;

          i {
            margin-left: 5px;
            font-size: 18px;
          }
        }
      }

      .description {
        height: 55px;
        font-size: 12px;
        line-height: 1.3em;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }

      // &:after {
      //   content: attr(data-person);
      //   position: absolute;
      //   top: 38px;
      //   left: 6px;
      //   width: 30px;
      //   height: 30px;
      //   border-radius: 50%;
      //   background-color: #ced182;
      //   color: #fff;
      //   text-align: center;
      //   line-height: 30px;
      //   font-weight: 600;
      // }

      &:hover {
        background-color: #f7f7f7;

        .title .btns {
          display: flex;
        }
      }
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

      .dot {
        display: none;
      }
    }
  }
}
</style>
<style lang="scss">
.notice-drawer {
  .el-drawer__open .el-drawer.rtl:focus {
    outline: none;
  }
}
</style>
