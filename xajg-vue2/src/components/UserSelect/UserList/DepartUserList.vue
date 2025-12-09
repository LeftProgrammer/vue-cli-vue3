<template>
  <div class="list-box">
    <div class="box-item">
      <el-popover
        v-model="visible"
        popper-class="user-select-pop-box"
        placement="bottom"
        :visible-arrow="false"
        trigger="click"
      >
        <div class="user-select-corp-tree">
          <el-tree
            ref="tree"
            :data="list"
            node-key="id"
            :default-expanded-keys="opens"
            icon-class="user-select-custom-tree-icon"
            @node-click="onCorpClick"
          >
            <span
              slot-scope="{ data }"
              class="custom-tree-node"
              :class="getCorpNodeClass(data)"
            >
              <i :class="getTreeIconClass(data)" />
              <span v-text="data.label" />
            </span>
          </el-tree>
        </div>
        <el-input
          slot="reference"
          v-model="corpName"
          class="corp-box"
          readonly
          placeholder="请选择单位"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-caret-bottom"
            style="font-size:20px;"
          />
        </el-input>
      </el-popover>
    </div>
    <div class="depart-box user-select-corp-tree">
      <el-tree
        ref="departTree"
        :data="departList"
        node-key="id"
        :default-expanded-keys="departOpens"
        icon-class="user-select-custom-tree-icon"
        @node-click="onDepartClick"
      >
        <span
          slot-scope="{ data }"
          class="custom-tree-node"
          :class="getDepartNodeClass(data)"
        >
          <i :class="getTreeIconClass(data)" />
          <span v-text="data.label" />
        </span>
      </el-tree>
    </div>
    <div class="divider">
      <div class="menu">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="16" :offset="1">
            <el-input
              v-model="searchStr"
              placeholder="请输入搜索内容"
              clearable
              size="mini"
            />
          </el-col>
          <el-col :span="5" :offset="2">
            <el-checkbox
              v-if="multiEnable"
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
          </el-col>
        </el-row>

      </div>

    </div>
    <div class="user-box">
      <virtual-scroll
        v-if="computedUserList.length > 0"
        :items="computedUserList"
        :item-height="24"
        key-name="userId"
      >
        <template #default="slotProps">
          <el-checkbox
            v-model="slotProps.item.checked"
            :label="slotProps.item.realName"
            @change="handelCheckedChange($event,slotProps.item)"
          />
        </template>
      </virtual-scroll>
      <div
        v-else
        class="user-no-data"
      >暂无数据</div>
      <!-- <el-checkbox-group
        v-if="userList.length > 0"
        v-model="checkList"
        @change="onChange"
      >
        <div v-for="(item, index) in userList" :key="index" class="user-item">
          <el-checkbox :label="item">{{ item.realName }}</el-checkbox>
        </div>
      </el-checkbox-group> -->
      <!-- <div v-else class="user-no-data">暂无数据</div> -->
    </div>
  </div>
</template>
<script>
import { getCorpList, getDepartList, getUserList } from '../api'
import VirtualScroll from '../VirtualScroll'
import store from '@/store'
export default {
  name: 'DepartUserList',
  components: {
    VirtualScroll
  },
  props: {
    multiEnable: {
      type: Boolean,
      default: false
    },
    selectedList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      list: [],
      visible: false,
      corpName: '',
      corpId: store.getters.loginInfo.corpId,
      departId: store.getters.loginInfo.departId,
      departList: [],
      userList: [],
      checkList: [],
      checkAll: false,
      searchStr: '',
      userListCopy: []
    }
  },
  computed: {
    opens() {
      return this.corpId === '0' ? [] : [this.corpId]
    },
    departOpens() {
      return this.departId === '0' ? [] : [this.departId]
    },
    isIndeterminate() {
      if (
        this.checkList.length < this.computedUserList.length &&
        this.checkList.length > 0
      ) {
        return true
      } else {
        return false
      }
    },
    computedSelectedMap() {
      return this.selectedList.reduce((prev, item) => {
        prev[item.userId] = true
        return prev
      }, {})
    },
    computedUserList() {
      return this.userList.filter(item => !this.computedSelectedMap[item.userId])
    }
  },
  watch: {
    corpId(newValue) {
      if (newValue === '') return
      this.departId = ''
      this.getDepartList()
    },

    departId(newValue) {
      if (newValue === '') return
      this.getUserList()
    },
    searchStr(newVal, oldVal) {
      if (newVal === '' && newVal === undefined && newVal === null) {
        this.userList = this.userListCopy
      } else {
        if (oldVal === '' || oldVal === undefined || oldVal === null) {
          this.userListCopy = this.userList
        }
        this.userList = (this.userListCopy || []).filter(item => item.realName.includes(newVal)) || []
      }
    }
  },
  async mounted() {
    await this.getCorpList()
    await this.getDepartList()
    await this.getUserList()
  },
  methods: {
    getUserData() {
      this.checkList.forEach(item => {
        item.checked = false
      })
      const result = [...this.checkList]
      this.checkList = []
      this.checkAll = false
      return result
    },

    onChange(list) {
      if (!this.multiEnable) {
        this.checkList = [list[list.length - 1]]
      }
    },

    onDepartClick(data) {
      this.departId = data.departId
    },

    getDepartNodeClass(data) {
      return data.departId === this.departId ? 'custom-tree-node-selected' : ''
    },

    getCorpNodeClass(data) {
      return data.corpId === this.corpId ? 'custom-tree-node-selected' : ''
    },

    getTreeIconClass(data) {
      return data.children && data.children.length > 0
        ? 'el-icon-folder'
        : 'el-icon-document'
    },

    onCorpClick(data) {
      this.corpId = data.corpId
      this.corpName = data.corpName
      if (!data.children || data.children.length === 0) {
        this.visible = false
      }
    },

    async getCorpList() {
      this.list = []
      this.departList = []
      this.userList = []
      try {
        const { success, message, data } = await getCorpList()
        if (!success) {
          return this.$message.error('获取单位数据失败：' + message)
        }
        this.list = data

        this.$nextTick(() => {
          const node = this.$refs.tree.getNode(store.getters.loginInfo.corpId)
          if (node) {
            this.corpId = node.data.corpId
            this.corpName = node.data.corpName
          } else {
            this.corpId = this.list[0].corpId
            this.corpName = this.list[0].corpName
          }
        })
      } catch (error) {
        this.$message.error('获取单位数据失败')
      }
    },

    async getDepartList() {
      this.departList = []
      this.userList = []

      try {
        const { success, message, data } = await getDepartList(this.corpId)
        if (!success) {
          return this.$message.error('获取部门列表失败：' + message)
        }
        this.departList = data

        if (data.length === 0) return

        this.$nextTick(() => {
          const node = this.$refs.departTree.getNode(
            store.getters.loginInfo.departId
          )
          if (node) {
            this.departId = node.data.departId
          } else {
            this.departId = this.departList[0].departId
          }
        })
      } catch (error) {
        this.$message.error('获取部门列表失败')
      }
    },

    async getUserList() {
      try {
        const { success, message, data } = await getUserList(
          this.corpId,
          this.departId
        )
        if (!success) {
          return this.$message.error('获取成员列表失败：' + message)
        }
        this.userList = data.map((item) => {
          item.checked = false
          return item
        })
      } catch (e) {
        this.$message.error('获取成员列表失败')
      }
    },
    handelCheckedChange(val, item) {
      if (val) {
        if (!this.multiEnable && this.checkList.length > 0) {
          const popItem = this.checkList.pop()
          popItem.checked = false
        }
        this.checkList.push(item)
      } else {
        this.checkList = this.checkList.filter((item_) => item_ !== item)
      }
      this.checkAll = this.checkList.length === this.computedUserList.length
    },
    handleCheckAllChange(type) {
      if (type) {
        this.checkList = this.userList
        this.userList.forEach((item) => {
          item.checked = true
        })
      } else {
        this.checkList = []
        this.userList.forEach((item) => {
          item.checked = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.list-box {
  width: 100%;
  height: 470px;
  overflow: hidden;
  .box-item {
    background-color: #f6f9f9;
    padding: 10px;
    height: 56px;
    box-sizing: border-box;
    border-bottom: 1px solid #d8d8d8;
  }
  .depart-box {
    height: calc((100% - 90px) / 2);
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .divider {
    height: 40px;
    background-color: #f6f9f9;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    box-sizing: border-box;

    .menu {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
    }
  }
  .user-box {
    height: calc((100% - 90px) / 2);
    padding: 10px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    position: relative;
    div.user-item {
      margin-bottom: 5px;
    }
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

.user-select-custom-tree-icon {
  display: none;
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
