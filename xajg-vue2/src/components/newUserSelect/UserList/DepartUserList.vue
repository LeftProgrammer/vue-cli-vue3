<template>
  <div class="list-box">
    <div class="box-item">
      <div class="user-select-corp-tree">
        <el-form
          inline
          size="mini"
        >
          <el-form-item>
            <el-input
              v-model="searchText"
              prefix-icon="el-icon-search"
              placeholder="请输入搜索内容"
              @keydown.enter.native="searchEvt"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="searchEvt"
            >搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="allChecked"
              @click.native="allCheckEvt"
            >全项目部搜索</el-checkbox>
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
        <span
          slot-scope="{ data }"
          class="custom-tree-node wbench-tree-node-defined"
          :data-key="data.id"
        >
          <span v-text="data.label" />
        </span>
      </el-tree>
    </div>
    <div class="divider" />
    <div class="user-box">
      <el-checkbox-group
        v-if="userList.length > 0"
        v-model="checkList"
        @change="onChange"
      >
        <template v-for="item in userList">
          <div
            v-if="!selectedListMap[item.userId]"
            :key="item.userId"
            class="user-item-full"
            @dblclick.prevent="ondblclick(item)"
          >
            <el-checkbox
              :label="item"
              :title="item.realName+'---'+item.corpName+item.departName"
            >
              <span class="user">{{ item.realName }}</span>
              <span class="corp">{{ item.corpName }}</span>
              <div class="clear" />
              <div class="depart">{{ item.departName }}</div>
            </el-checkbox>
          </div>
        </template>

      </el-checkbox-group>
      <div
        v-else
        class="user-no-data"
      >暂无数据</div>
    </div>
  </div>
</template>
<script>
import { getOrgList, getCurrent, trim, systemSearchUser } from '../api'
import { getCookie } from '@szgc/plt-core'
import request from '@/utils/request'

export default {
  name: 'DepartUserList',
  props: {
    orgId: {
      type: [String, Number],
      default() {
        return ''
      }
    },
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
      searchText: '',
      list: [],
      current: {
        corpId: ''
      },
      allChecked: false,
      nowCheckedKeys: [],
      currentNodeKey: '',
      userList: [],
      checkList: [],
      prefix: ''
    }
  },
  computed: {
    selectedListMap() {
      return this.selectedList.reduce((prev, item) => {
        if (item.userId) {
          prev[item.userId] = true
        }
        return prev
      }, {})
    }
  },
  watch: {
    orgIds: {
      async handler() {
        await this.getCurrent()
        await this.getOrgList()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    /* 搜索人员*/
    async searchEvt() {
      this.getUserList()
    },
    /* 勾选全项目部搜索*/
    allCheckEvt() {
      this.$refs.orgTree.setCheckedKeys([])
      this.$refs.orgTree.setCurrentKey(null)
    },
    /* 返回已选人员*/
    getUserData() {
      const result = [...this.checkList]
      this.checkList = []
      return result
    },
    /* 返回当前部门所有人员*/
    getAllUser() {
      return this.userList
    },
    /* 控制单选多选*/
    onChange(list) {
      if (!this.multiEnable) {
        this.checkList = [list[list.length - 1]]
      }
    },
    /* 点击组织树某一行，查询相关人员*/
    onOrgClick(data) {
      this.allChecked = false
      this.$refs.orgTree.setCheckedKeys([])
      setTimeout(() => {
        this.$refs.orgTree.setCheckedKeys([data.id])
        this.searchEvt()
      }, 30)
    },
    /* 勾选某一单位/部门*/
    onCheckClick() {
      this.allChecked = false
      this.nowCheckedKeys = this.$refs.orgTree.getCheckedKeys()
    },
    /* 获取组织树*/
    async getOrgList() {
      this.list = []
      this.userList = []
      this.prefix = getCookie('plt-api-route') || ''
      try {
        const { success, message, data } = await request({
          url: this.prefix + getOrgList(),
          method: 'get'
        })
        if (!success) {
          return this.$message.error('获取单位部门数据失败:' + message)
        }
        this.list = data
        this.$nextTick(() => {
          // 设置树选中
          const nodes = document.querySelectorAll('.wbench-tree-node-defined')
          if (this.orgId) {
            // 如果传入了设置的组织
            this.currentNodeKey = this.orgId
          } else {
            // 没传入则设置为当前登录人组织部门或单位
            this.currentNodeKey = this.current.departId || this.current.corpId
          }
          let flag = false
          if (this.currentNodeKey) {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].getAttribute('data-key') === this.currentNodeKey) {
                nodes[i].click()
                flag = true
                break
              }
            }
          }
          if (!flag) {
            nodes[0].click()
          }
        })
      } catch (error) {
        this.$message.error('获取单位部门数据失败:' + error)
      }
    },
    /* 获取可选人员列表*/
    async getUserList() {
      this.prefix = getCookie('plt-api-route') || ''
      const belongIds = this.$refs.orgTree.getCheckedKeys()
      try {
        const { success, message, data } = await request({
          url: this.prefix + systemSearchUser(),
          method: 'post',
          data: {
            all: this.allChecked,
            belongIds: belongIds,
            fuCondition: trim(this.searchText)
          }
        })
        if (!success) {
          return this.$message.error('获取成员列表失败:' + message)
        }
        this.userList = data
      } catch (e) {
        this.$message.error('获取成员列表失败:' + e)
      }
    },
    /* 获取当前登录人信息*/
    async getCurrent() {
      this.prefix = getCookie('plt-api-route') || ''
      try {
        const { success, message, data } = await request({
          url: this.prefix + getCurrent(),
          method: 'get'
        })
        if (!success) {
          return this.$message.error('获取当前用户信息失败:' + message)
        }
        if (data) {
          this.current = data
        }
      } catch (e) {
        this.$message.error('获取当前用户信息失败:' + e)
      }
    },
    ondblclick(item) {
      this.$emit('dbclickItem', item)
    }
  }
}
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
