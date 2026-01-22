<template>
  <div class="list-box">
    <div class="box-item">
      <div class="user-select-corp-tree">
        <el-form inline>
          <el-form-item style="margin-right: 8px;">
            <el-input 
              v-model="searchText" 
              placeholder="请输入搜索内容" 
              style="width: 180px;"
              @keydown.enter="searchEvt"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item style="margin-right: 8px;">
            <el-button type="primary" @click="searchEvt">搜索</el-button>
          </el-form-item>
          <el-form-item style="margin-right: 0;">
            <el-checkbox :model-value="allChecked" @click="toggleAllCheck">全项目部搜索</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="depart-box user-select-corp-tree">
      <el-tree
        ref="orgTree"
        :data="list"
        show-checkbox
        default-expand-all
        node-key="id"
        check-strictly
        class="wbench-tree-defined-special"
        :current-node-key="currentNodeKey"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :highlight-current="true"
        @node-click="onOrgClick"
        @check-change="onCheckClick"
      >
        <template #default="{ data }">
          <span class="custom-tree-node wbench-tree-node-defined" :data-key="data.id">
            <span v-text="data.label" />
          </span>
        </template>
      </el-tree>
    </div>

    <div class="divider" />

    <div class="user-box">
      <el-checkbox-group v-if="userList.length > 0" v-model="checkList" @change="onChange">
        <template v-for="item in userList" :key="item.userId">
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
import { getOrgList, getCurrent, trim, systemSearchUser } from "../api";
import request from "@/utils/request";

export default {
  name: "DepartUserList",
  components: { Search },
  props: {
    orgId: {
      type: [String, Number],
      default() {
        return "";
      },
    },
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
      searchText: "",
      list: [],
      current: {
        corpId: "",
      },
      allChecked: false,
      nowCheckedKeys: [],
      currentNodeKey: "",
      userList: [],
      checkList: [],
      prefix: "",
      isTogglingAllCheck: false, // 防止事件冲突的标志
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
  watch: {
    orgId: {
      async handler() {
        await this.getCurrent();
        await this.getOrgList();
      },
      immediate: true,
    },
  },
  methods: {
    async searchEvt() {
      this.getUserList();
    },

    toggleAllCheck() {
      const newValue = !this.allChecked;
      
      // 设置防冲突标志
      this.isTogglingAllCheck = true;
      this.allChecked = newValue;
      
      if (newValue) {
        // 勾选全项目部搜索：清空树的选择
        this.$refs.orgTree.setCheckedKeys([]);
        this.$refs.orgTree.setCurrentKey(null);
        this.nowCheckedKeys = [];
        this.currentNodeKey = null;
      }
      
      // 重新获取用户列表
      this.getUserList();
      
      // 重置防冲突标志（使用 nextTick 确保事件处理完成）
      this.$nextTick(() => {
        this.isTogglingAllCheck = false;
      });
    },

    getUserData() {
      const result = [...this.checkList];
      this.checkList = [];
      return result;
    },

    getAllUser() {
      return this.userList;
    },

    onChange(list) {
      if (!this.multiEnable) {
        this.checkList = [list[list.length - 1]];
      }
    },

    onOrgClick(data) {
      this.allChecked = false;
      this.$refs.orgTree.setCheckedKeys([]);
      setTimeout(() => {
        this.$refs.orgTree.setCheckedKeys([data.id]);
        this.searchEvt();
      }, 30);
    },

    onCheckClick() {
      // 如果正在切换全项目部搜索，不处理
      if (this.isTogglingAllCheck) {
        return;
      }
      
      // 用户手动选择树节点，清空全部搜索状态
      this.allChecked = false;
      this.nowCheckedKeys = this.$refs.orgTree.getCheckedKeys();
      this.getUserList();
    },

    async getOrgList() {
      this.list = [];
      this.userList = [];
      this.prefix = Cookies.get("plt-api-route") || "";
      
      const response = await request({
        url: this.prefix + getOrgList(),
        method: "get",
      });
      
      const { success, message, data } = response;
      if (!success) {
        return this.$message.error("获取单位部门数据失败:" + message);
      }
      
      this.list = data;
      this.$nextTick(() => {
        const nodes = document.querySelectorAll(".wbench-tree-node-defined");
        if (this.orgId) {
          this.currentNodeKey = this.orgId;
        } else {
          this.currentNodeKey = this.current.departId || this.current.corpId;
        }
        let flag = false;
        if (this.currentNodeKey && nodes && nodes.length) {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].getAttribute("data-key") === this.currentNodeKey) {
              nodes[i].click();
              flag = true;
              break;
            }
          }
        }
        if (!flag && nodes && nodes.length) {
          nodes[0].click();
        }
      });
    },

    async getUserList() {
      this.prefix = Cookies.get("plt-api-route") || "";
      const belongIds = this.$refs.orgTree.getCheckedKeys();
      
      const response = await request({
        url: this.prefix + systemSearchUser(),
        method: "post",
        data: {
          all: this.allChecked,
          belongIds: belongIds,
          fuCondition: trim(this.searchText),
        },
      });
      
      const { success, message, data } = response;
      if (!success) {
        return this.$message.error("获取成员列表失败:" + message);
      }
      
      this.userList = data;
    },

    async getCurrent() {
      this.prefix = Cookies.get("plt-api-route") || "";
      
      const response = await request({
        url: this.prefix + getCurrent(),
        method: "get",
      });
      
      const { success, message, data } = response;
      if (!success) {
        return this.$message.error("获取当前用户信息失败:" + message);
      }
      
      if (data) {
        this.current = data;
      }
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
  overflow: hidden;

  .box-item {
    background-color: #f6f9f9;
    padding: 10px;
    height: 56px;
    box-sizing: border-box;
    border-bottom: 1px solid #d8d8d8;
    
    :deep(.el-form) {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      
      .el-form-item {
        margin-bottom: 0;
        margin-right: 10px;
        
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .depart-box {
    height: calc((100% - 80px) / 2);
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .divider {
    height: 20px;
    background-color: #f6f9f9;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    box-sizing: border-box;
  }

  .user-box {
    height: calc((100% - 60px) / 2);
    overflow-x: hidden;
    overflow-y: auto;

    .user-no-data {
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #909399;
    }
  }
}
</style>

<style lang="scss">
.custom-tree-node {
  i {
    margin-right: 5px;
  }
}

.user-select-pop-box {
  width: 330px;
  height: 410px;
  padding: 10px;
  border-radius: 0;
  box-shadow: none;
  border: none;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}

.user-select-corp-tree {
  span.expanded + span.custom-tree-node {
    i.el-icon-folder::before {
      content: "\e784";
    }
  }

  span.custom-tree-node-selected {
    color: #409eff;
  }
}
</style>
