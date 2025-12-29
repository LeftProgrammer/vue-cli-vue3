<template>
  <el-dialog
    class="user-select modal-defined"
    :visible.sync="visible"
    width="820px"
    append-to-body
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div slot="title" class="select-title">
      <i class="el-icon-s-custom" />
      <span>人员选择</span>
    </div>
    <div class="select-main">
      <div class="title">
        <el-tabs v-model="group" type="card">
          <el-tab-pane label="最近" name="recent" />
          <el-tab-pane label="部门" name="depart" />
          <!-- v-if="managerEnable" -->
          <el-tab-pane v-if="managerEnable" label="管理员" name="manager" />
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
              :selected-list="checkedList"
            />
          </td>
          <td class="md">
            <div class="arrow rt-arrow">
              <span title="添加" @click="addUser" />
            </div>
            <div class="arrow lt-arrow">
              <span title="移除" @click="removeUser" />
            </div>
          </td>
          <td class="rt">
            <div class="box-item">
              <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="16" :offset="1">
                  <span>已选择人员</span>
                </el-col>
                <el-col :span="5" :offset="2">
                  <el-checkbox
                    v-if="multiEnable"
                    v-model="checkAll"
                    :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange"
                    >全选</el-checkbox
                  >
                </el-col>
              </el-row>
            </div>
            <div class="user-list">
              <!-- <el-checkbox-group v-model="rtCheckList">
                <div
                  v-for="(item, index) in checkedList"
                  :key="index"
                  class="user-item"
                >
                  <el-checkbox :label="item">{{ item.realName }}</el-checkbox>
                </div>
              </el-checkbox-group> -->
              <virtual-scroll
                v-if="checkedList.length > 0"
                :items="checkedList"
                :item-height="24"
                key-name="userId"
              >
                <template #default="slotProps">
                  <el-checkbox
                    v-model="slotProps.item.checked"
                    :label="slotProps.item.realName"
                    @change="handelCheckedChange($event, slotProps.item)"
                  />
                </template>
              </virtual-scroll>
            </div>
          </td>
          <td class="ex">
            <div class="arrow up-arrow">
              <span title="上移" />
            </div>
            <div class="arrow dn-arrow">
              <span title="下移" />
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div slot="footer" class="dialog-footer">
      <div class="btn-defined btn-default" @click="visible = false">取消</div>
      <div class="btn-defined btn-primary" @click="submit">确定</div>
    </div>
  </el-dialog>
</template>
<script>
import { getUserListByIds, addRecentUserList } from "./api";
import DepartUserList from "./UserList/DepartUserList";
import RecentUserList from "./UserList/RecentUserList";
import ManagerList from "./UserList/ManagerList";
import VirtualScroll from "./VirtualScroll";
export default {
  name: "UserSelect",
  components: {
    depart: DepartUserList,
    recent: RecentUserList,
    manager: ManagerList,
    VirtualScroll,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    multiEnable: {
      type: Boolean,
      default: false,
    },
    users: {
      type: Array,
      default: () => [],
    },
    managerEnable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: this.show,
      group: "depart",
      corpVisible: false,
      userList: [],
      departList: [],
      corpList: [],
      rtCheckList: [],
      checkedList: [],
      corpId: "",
      departId: "",
      corpName: "",
      checkAll: false,
    };
  },
  computed: {
    isIndeterminate() {
      if (
        this.rtCheckList.length < this.checkedList.length &&
        this.rtCheckList.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    show(newValue) {
      if (newValue === true) {
        this.visible = newValue;
      } else {
        this.rtCheckList = [];
        // this.ltCheckList = [];
        this.checkedList = [];
        this.userList = [];

        this.corpId = "";
        this.departId = "";
        this.visible = newValue;
      }
    },
    visible(newValue) {
      if (newValue === false) {
        this.$emit("update:show", newValue);
      }
    },
    corpId(newValue) {
      if (!newValue) return;
      this.getDepartList();
    },
    departId(newValue) {
      if (!newValue) return;
      this.getUserList();
    },
    users: {
      handler() {
        this.renderCheckedList();
      },
      immediate: true,
    },
  },
  methods: {
    renderDefault() {},

    removeUser() {
      if (this.rtCheckList.length === 0) return;

      const result = [];
      const rtCheckListMap = this.rtCheckList.reduce((prev, item) => {
        prev[item.userId] = true;
        return prev;
      }, {});
      this.checkedList.forEach((d) => {
        // const index = this.rtCheckList.findIndex(x => x.userId === d.userId)
        if (!rtCheckListMap[d.userId]) {
          result.push(d);
        }
      });

      this.checkedList = result;
      this.rtCheckList = [];
      this.checkAll =
        this.rtCheckList.length === this.checkedList.length &&
        this.rtCheckList.length !== 0;
    },

    addUser() {
      const userList = this.$refs.userList.getUserData();
      if (userList.length === 0) return;

      if (this.multiEnable) {
        const checkedListMap = this.checkedList.reduce((prev, item) => {
          prev[item.userId] = true;
          return prev;
        }, {});
        userList.map((d) => {
          // const index = this.checkedList.findIndex(x => d.userId === x.userId)
          if (!checkedListMap[d.userId]) {
            this.checkedList.push({
              realName: d.realName,
              userId: d.userId,
              username: d.username,
              departId: d.departId,
              departName: d.departName,
              leaderId: d.leaderId,
              leaderName: d.leaderName,
              corpId: d.corpId,
              corpName: d.corpName,
              mobile: d.mobile,
              checked: false,
            });
          }
        });
      } else {
        this.checkedList = [
          {
            realName: userList[0].realName,
            userId: userList[0].userId,
            username: userList[0].username,
            departId: userList[0].departId,
            departName: userList[0].departName,
            leaderId: userList[0].leaderId,
            leaderName: userList[0].leaderName,
            corpId: userList[0].corpId,
            corpName: userList[0].corpName,
            mobile: userList[0].mobile,
          },
        ];
      }
    },

    onDepartClick(data) {
      this.departId = data.departId;
    },

    onCorpClick(data) {
      this.corpId = data.corpId;
      this.corpName = data.corpName;
      if (!data.children || data.children.length === 0) {
        this.corpVisible = false;
      }
    },

    getCorpNodeClass(data) {
      return data.corpId === this.corpId ? "custom-tree-node-selected" : "";
    },

    getDepartNodeClass(data) {
      return data.departId === this.departId ? "custom-tree-node-selected" : "";
    },

    getTreeIconClass(data) {
      return data.children && data.children.length > 0
        ? "el-icon-folder"
        : "el-icon-document";
    },

    getCorp(corpList, id) {
      let result = null;
      for (let i = 0; i < corpList.length; i++) {
        const corp = corpList[i];
        if (corp.corpId === id) {
          result = {
            corpName: corp.corpName,
            corpId: corp.corpId,
          };
        }

        if (corp.children && corp.children.length > 0) {
          result = this.getCorp(corp.children, id);
        }

        if (result) {
          return result;
        }
      }

      return result;
    },

    /**
     * 存储最近选择的用户
     */
    async addRecentUserList(userList) {
      try {
        await addRecentUserList({
          data: userList.map((d) => d.userId),
        });
      } catch (e) {
        this.$message.error(e);
      }
    },

    submit() {
      const result = this.checkedList.map((d) => ({
        realName: d.realName,
        userId: d.userId,
        username: d.username,
        departId: d.departId,
        departName: d.departName,
        leaderId: d.leaderId,
        leaderName: d.leaderName,
        corpId: d.corpId,
        corpName: d.corpName,
        mobile: d.mobile,
      }));
      // this.visible = false;
      if (result.length === 0) {
        this.$emit("user-checked", result);
        return false;
      }
      if (this.checkedList[0].mobile) {
        this.addRecentUserList(result);
        this.$emit("user-checked", result);
      } else {
        this.$message.error("所选用户未填写手机号，请重新选择");
      }
    },

    async renderCheckedList() {
      if (this.users.length === 0) return;
      const temp = [];
      this.users.map((item) => {
        if (item.userId) temp.push(item.userId);
      });
      const { success, message, data } = await getUserListByIds(temp); // this.users
      if (!success) {
        return this.$message.error("获取已选择用户信息失败：" + message);
      }
      if (data && data.length > 0) {
        this.checkedList = data.map((d) => ({
          realName: d.realName,
          userId: d.userId,
          username: d.username,
          departId: d.departId,
          departName: d.departName,
          leaderId: d.leaderId,
          leaderName: d.leaderName,
          corpId: d.corpId,
          corpName: d.corpName,
          mobile: d.mobile,
          checked: false,
        }));
      }
    },
    handelCheckedChange(val, item) {
      if (val) {
        if (!this.multiEnable && this.rtCheckList.length > 0) {
          const popItem = this.rtCheckList.pop();
          popItem.checked = false;
        }
        this.rtCheckList.push(item);
      } else {
        this.rtCheckList = this.rtCheckList.filter((item_) => item_ !== item);
      }
      this.checkAll = this.rtCheckList.length === this.checkedList.length;
    },
    handleCheckAllChange(type) {
      if (type) {
        this.rtCheckList = this.checkedList;
        this.checkedList.forEach((item) => {
          item.checked = true;
        });
      } else {
        this.rtCheckList = [];
        this.checkedList.forEach((item) => {
          item.checked = false;
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.user-select {
  /deep/ .el-dialog__header {
    margin-bottom: 0;
  }

  /deep/ .el-dialog__body {
    padding: 0 20px;
  }

  .dialog-footer {
    margin-top: 10px;

    .btn-defined {
      width: 60px;
      text-align: center;
      margin-left: 15px;
      margin-right: 0;
      cursor: pointer;
    }
  }

  .select-title {
    font-size: 18px;
    color: #fff;
    span {
      margin-left: 5px;
    }
    i {
      color: #fff;
    }
  }
  .title {
    width: 100%;
    height: 40px;
    line-height: 30px;

    .el-tabs {
      width: 100%;
    }
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
          padding: 10px;
          box-sizing: border-box;
        }
      }
    }
    .arrow {
      text-align: center;
      line-height: 32px;
      height: 32px;
      &:first-child {
        margin-bottom: 10px;
      }
      span {
        display: inline-block;
        width: 32px;
        height: 32px;
        background-image: url("./img/icon32.png");
        background-repeat: no-repeat;
        cursor: pointer;
      }
      &.rt-arrow {
        span {
          background-position: 0 -256px;
          &:hover {
            background-position: -128px -256px;
          }
        }
      }
      &.lt-arrow {
        span {
          background-position: -32px -256px;
          &:hover {
            background-position: -160px -256px;
          }
        }
      }
      &.up-arrow {
        span {
          background-position: -64px -256px;
          &:hover {
            background-position: -192px -256px;
          }
        }
      }
      &.dn-arrow {
        span {
          background-position: -96px -256px;
          &:hover {
            background-position: -224px -256px;
          }
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

    div.user-item {
      margin-bottom: 5px;
    }
  }
}
</style>

<style lang="scss">
.user-select {
  .el-dialog__body {
    padding: 15px;
  }
}
</style>
<style lang="scss" scoped>
.btn-defined {
  margin-right: 15px;
}
</style>
