<template>
  <el-dialog
    v-draggable
    class="user-select"
    :visible.sync="visible"
    width="960px"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
  >
    <div slot="title" class="select-title">
      <i class="el-icon-s-custom" />
      <span>人员选择器</span>
    </div>
    <div class="select-main">
      <div class="title">
        <el-tabs v-model="group" type="card">
          <el-tab-pane label="最近" name="recent" />
          <el-tab-pane label="组织结构" name="depart" />
        </el-tabs>
      </div>
      <table class="box" cellpadding="0" cellspacing="0">
        <tr>
          <td class="lt">
            <component
              :is="group"
              v-if="visible"
              ref="userList"
              :multi-enable="multiEnable"
              :org-id="orgId"
              :selected-list="checkedList"
              @dbclickItem="onDbclickItem"
            />
          </td>
          <td class="md">
            <div class="arrow rt-arrow">
              <span title="单个添加" @click="addUser" />
            </div>
            <div v-if="multiEnable" class="arrow rt-arrow-all">
              <span title="全部添加" @click="addAllUser" />
            </div>
            <div class="arrow lt-arrow">
              <span title="单个移除" @click="removeUser" />
            </div>
            <div v-if="multiEnable" class="arrow lt-arrow-all">
              <span title="全部移除" @click="removeAllUser" />
            </div>
          </td>
          <td class="rt">
            <div class="box-item">
              <el-input
                v-model="searchText"
                prefix-icon="el-icon-search"
                placeholder="请输入搜索内容"
                size="mini"
                @input="searchEvt"
              />
            </div>
            <div class="user-list">
              <el-checkbox-group v-model="rtCheckList">
                <div
                  v-for="(item, index) in showList"
                  :key="index"
                  class="user-item-full"
                  @dblclick.prevent="handelRtCheckListDbclick(index)"
                >
                  <el-checkbox
                    :label="item"
                    :title="
                      item.realName + '---' + item.corpName + item.departName
                    "
                  >
                    <span class="user">{{ item.realName }}</span>
                    <span class="corp">{{ item.corpName }}</span>
                    <div class="clear" />
                    <div class="depart">{{ item.departName }}</div>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getUserListByIds, addRecentUserList, trim } from "./api";
import DepartUserList from "./UserList/DepartUserList";
import RecentUserList from "./UserList/RecentUserList";
import { getCookie } from "@szgc/plt-core";
import request from "@/utils/request";

export default {
  name: "UserSelect",
  components: {
    depart: DepartUserList,
    recent: RecentUserList,
  },
  props: {
    orgId: {
      type: [String, Number],
      default() {
        return "";
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
    multiEnable: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    users: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: this.show,
      group: "recent",
      userList: [],
      rtCheckList: [],
      checkedList: [],
      prefix: "",
      searchText: "",
      showList: [],
    };
  },
  watch: {
    show: {
      async handler(newValue) {
        this.rtCheckList = [];
        this.checkedList = [];
        this.userList = [];
        this.showList = [];
        if (newValue === true) {
          this.visible = newValue;
        }
        this.renderCheckedList();
      },
      immediate: true,
    },
    visible: {
      handler(newValue) {
        if (newValue === false) {
          this.$emit("update:show", newValue);
        }
      },
      immediate: true,
    },
  },
  methods: {
    /* 最近人员搜索*/
    searchEvt() {
      const searchText = trim(this.searchText);
      this.showList = this.checkedList.filter((item) => {
        if (searchText === "") {
          return item;
        } else {
          if (item.realName && item.realName.indexOf(searchText) > -1) {
            return item;
          } else if (item.corpName && item.corpName.indexOf(searchText) > -1) {
            return item;
          } else if (
            item.departName &&
            item.departName.indexOf(searchText) > -1
          ) {
            return item;
          } else if (item.mobile && item.mobile.indexOf(searchText) > -1) {
            return item;
          }
        }
      });
    },
    /* 单个添加*/
    addUser() {
      const userList = this.$refs.userList.getUserData();
      if (userList.length === 0) return;
      if (this.multiEnable) {
        userList.map((d) => {
          const index = this.checkedList.findIndex(
            (x) => d.userId === x.userId
          );
          if (index < 0) {
            this.checkedList.push(d);
          }
        });
      } else {
        this.checkedList = [userList[0]];
      }
      this.searchText = "";
      this.searchEvt();
    },
    /* 全部添加*/
    addAllUser() {
      const userList = this.$refs.userList.getAllUser();
      if (userList.length === 0) return;
      userList.map((d) => {
        const index = this.checkedList.findIndex((x) => d.userId === x.userId);
        if (index < 0) {
          this.checkedList.push(d);
        }
      });
      this.searchText = "";
      this.searchEvt();
    },
    /* 单个/多个移出*/
    removeUser() {
      if (this.rtCheckList.length === 0) return;
      const result = [];
      this.checkedList.map((d) => {
        const index = this.rtCheckList.findIndex((x) => x.userId === d.userId);
        if (index < 0) {
          result.push(d);
        }
      });
      this.checkedList = result;
      this.rtCheckList = [];
      this.searchText = "";
      this.searchEvt();
    },
    /* 全部移除*/
    removeAllUser() {
      this.checkedList = [];
      this.rtCheckList = [];
      this.searchText = "";
      this.searchEvt();
    },
    /**
     * 存储最近选择的用户
     */
    async addRecentUserList(userList) {
      this.prefix = getCookie("plt-api-route") || "";
      try {
        await request({
          url: this.prefix + addRecentUserList(),
          method: "put",
          data: {
            data: userList.map((d) => d.userId),
          },
        });
      } catch (e) {
        this.$message.error(e);
      }
    },
    /* 确定*/
    submit() {
      const valueArr = [];
      const textArr = [];
      const sourceArr = [];
      const result = [];
      this.checkedList.map((item) => {
        valueArr.push(item.userId);
        textArr.push(item.realName);
        const source = JSON.parse(JSON.stringify(item));
        sourceArr.push(source);
        result.push({
          realName: item.realName,
          userId: item.userId,
        });
      });
      if (this.required) {
        if (sourceArr.length === 0) {
          return this.$message.error("请选择人员");
        }
      }
      let data = {
        valueText: sourceArr.length > 0 ? valueArr.join(",") : "",
        text: textArr.join(","),
        source: sourceArr,
      };
      this.$emit("user-checked", data);
      this.visible = false;
      if (result.length > 0) {
        this.addRecentUserList(result);
      }
    },
    /* 获取并渲染已选用户*/
    async renderCheckedList() {
      let users = this.users.filter((x) => x);
      if (users.length === 0) return;
      this.prefix = getCookie("plt-api-route") || "";
      const { success, message, data } = await request({
        url: this.prefix + getUserListByIds(),
        method: "post",
        data: {
          data: users,
        },
      });
      if (!success) {
        return this.$message.error("获取已选择用户信息失败：" + message);
      }
      if (data && data.length > 0) {
        this.checkedList = data;
        this.searchEvt();
      }
    },
    onDbclickItem(item) {
      if (
        !this.checkedList.some((listItem) => listItem.userId === item.userId)
      ) {
        if (this.multiEnable) {
          this.checkedList.push(item);
        } else {
          this.checkedList = [item];
        }
        this.searchEvt();
      }
    },
    handelRtCheckListDbclick(index) {
      this.checkedList.splice(index, 1);
      this.searchEvt();
    },
  },
};
</script>
<style lang="scss" scoped>
.user-select {
  ::v-deep .el-dialog {
    padding: 0;
  }
  .select-title {
    font-size: 16px;
    color: #fff;
    line-height: 28px;

    span {
      margin-left: 5px;
    }
  }

  .title {
    height: 40px;
    line-height: 30px;
  }

  .box {
    margin-top: 10px;
    table-layout: fixed;
    width: 100%;

    td {
      height: 450px;
      border: 1px solid #d8d8d8;
      padding: 10px;

      &.md {
        width: 50px;
        border: none;
      }

      &.ex {
        width: 45px;
        border: none;
        padding: 0 0 0 7px;
      }

      &.lt {
        padding: 0;
        vertical-align: top;

        .corp-box {
          cursor: pointer;
        }

        .divider {
          height: 40px;
          background-color: #f6f9f9;
          border-top: 1px solid #d8d8d8;
          border-bottom: 1px solid #d8d8d8;
          box-sizing: border-box;
        }

        .depart-box {
          height: calc((100% - 90px) / 2);
          padding: 10px;
          box-sizing: border-box;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .user-box {
          height: calc((100% - 90px) / 2);
          padding: 10px;
          overflow-x: hidden;
          overflow-y: auto;
          box-sizing: border-box;
        }
      }

      &.rt {
        padding: 0;
        vertical-align: top;

        .box-item {
          line-height: 36px;
        }

        .user-list {
          height: calc(100% - 56px);
          overflow-x: hidden;
          overflow-y: auto;
          box-sizing: border-box;
        }
      }
    }

    .arrow {
      text-align: center;
      line-height: 32px;
      height: 32px;
      margin: 10px 0;

      span {
        display: inline-block;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid #66b1ff;
      }

      &.rt-arrow {
        span {
          background-image: url("./image/right_1.png");
          background-repeat: no-repeat;
          background-size: 60%;
          background-position: center;
        }
      }

      &.rt-arrow-all {
        span {
          background-image: url("./image/right_2.png");
          background-repeat: no-repeat;
          background-size: 60%;
          background-position: center;
        }
      }

      &.lt-arrow {
        span {
          background-image: url("./image/left_1.png");
          background-repeat: no-repeat;
          background-size: 60%;
          background-position: center;
        }
      }

      &.lt-arrow-all {
        span {
          background-image: url("./image/left_2.png");
          background-repeat: no-repeat;
          background-size: 60%;
          background-position: center;
        }
      }
    }

    .box-item {
      background-color: #f6f9f9;
      padding: 10px;
      height: 56px;
      box-sizing: border-box;
      border-bottom: 1px solid #d8d8d8;
    }
  }
}
</style>

<style lang="scss">
.user-select {
  .el-dialog__body {
    padding: 15px;
  }

  .user-item-full {
    padding: 5px 10px 2px;
    overflow: hidden;
    border-bottom: 1px solid #d8d8d8;

    .el-checkbox {
      width: 100%;

      .el-checkbox__input {
        position: relative;
        top: 3px;
        vertical-align: top;
      }

      .el-checkbox__label {
        display: inline-block;
        width: 90%;
        font-size: 13px;

        &:after {
          display: block;
          width: 0;
          height: 0;
          content: "";
          overflow: hidden;
          clear: both;
        }

        .clear {
          &:after {
            display: block;
            width: 0;
            height: 0;
            content: "";
            overflow: hidden;
            clear: both;
          }
        }

        .user {
          display: inline-block;
          float: left;
        }

        .corp {
          display: inline-block;
          float: right;
          width: calc(100% - 100px);
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .depart {
          margin-top: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
