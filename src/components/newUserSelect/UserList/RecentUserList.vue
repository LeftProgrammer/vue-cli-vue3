<template>
  <div class="list-box">
    <div class="search">
      <el-input v-model="searchText" placeholder="请输入搜索内容" size="small" @input="searchEvt">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="main">
      <el-checkbox-group v-if="userList.length > 0" v-model="checkList" @change="onChange">
        <template v-for="item in showList" :key="item.userId">
          <div v-if="!selectedListMap[item.userId]" class="user-item-full" @dblclick.prevent="ondblclick(item)">
            <el-checkbox :label="item" :title="item.realName + '---' + item.corpName + item.departName">
              <span class="user">{{ item.realName }}</span>
              <span class="corp">{{ item.corpName }}</span>
              <div class="clear" />
              <div class="depart">{{ item.departName }}</div>
            </el-checkbox>
          </div>
        </template>
      </el-checkbox-group>
      <div v-else class="user-no-data">暂无数据</div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { Search } from "@element-plus/icons-vue";
import { getRecentUserList, trim } from "../api";
import request from "@/utils/request";

export default {
  name: "RecentUserList",
  components: { Search },
  props: {
    multiEnable: {
      type: Boolean,
      default: false,
    },
    selectedList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  emits: ["dbclickItem"],
  data() {
    return {
      userList: [],
      showList: [],
      checkList: [],
      prefix: "",
      searchText: "",
    };
  },
  computed: {
    selectedListMap() {
      return this.selectedList.reduce((prev, item) => {
        if (item.userId) {
          prev[item.userId] = true;
        }
        return prev;
      }, {});
    },
  },
  mounted() {
    this.getRecentUserList();
  },
  methods: {
    searchEvt() {
      const searchText = trim(this.searchText);
      this.showList = this.userList.filter((item) => {
        if (searchText === "") {
          return item;
        }
        if (item.realName && item.realName.indexOf(searchText) > -1) {
          return item;
        }
        if (item.corpName && item.corpName.indexOf(searchText) > -1) {
          return item;
        }
        if (item.departName && item.departName.indexOf(searchText) > -1) {
          return item;
        }
        if (item.mobile && item.mobile.indexOf(searchText) > -1) {
          return item;
        }
        return false;
      });
    },

    getUserData() {
      const result = [...this.checkList];
      this.checkList = [];
      return result;
    },

    onChange(list) {
      if (!this.multiEnable) {
        this.checkList = [list[list.length - 1]];
      }
    },

    async getRecentUserList() {
      this.prefix = Cookies.get("plt-api-route") || "";
      try {
        const { success, message, data } = await request({
          url: this.prefix + getRecentUserList(),
          method: "get",
        });
        if (!success) {
          return this.$message.error("获取最近选择用户失败：" + message);
        }
        this.userList = data;
        this.showList = data;
      } catch (e) {
        this.$message.error("获取最近选择用户失败");
      }
    },

    getAllUser() {
      return this.showList;
    },

    ondblclick(item) {
      this.$emit("dbclickItem", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.list-box {
  width: 100%;
  height: 500px;
  box-sizing: border-box;

  > .search {
    padding: 0 10px;
    height: 55px;
    background-color: #f6f9f9;
    border-bottom: 1px solid #d8d8d8;

    > .el-input {
      margin-top: 14px;
    }
  }

  > .main {
    width: 100%;
    height: calc(100% - 55px);
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .user-no-data {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #909399;
  }
}
</style>
