<template>
  <div class="list-box">
    <div class="main">
      <el-checkbox-group
        v-if="userList.length > 0"
        v-model="checkList"
        @change="onChange"
      >
        <div v-for="item in userList" :key="item.userId" class="user-item">
          <el-checkbox :label="item">{{ item.realName }}</el-checkbox>
        </div>
      </el-checkbox-group>
      <div v-else class="user-no-data">暂无数据</div>
    </div>
  </div>
</template>
<script>
import { getRecentUserList } from '../api'
export default {
  name: 'RecentUserList',
  props: {
    multiEnable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userList: [],
      checkList: []
    }
  },
  mounted() {
    this.getRecentUserList()
  },
  methods: {
    getUserData() {
      const result = [...this.checkList]
      this.checkList = []
      return result
    },

    onChange(list) {
      if (!this.multiEnable) {
        this.checkList = [list[list.length - 1]]
      }
    },

    async getRecentUserList() {
      try {
        const { success, message, data } = await getRecentUserList()
        if (!success) {
          return this.$message.error('获取最近选择用户失败：' + message)
        }
        this.userList = data
      } catch (e) {
        this.$message.error('获取最近选择用户失败')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.list-box {
  width: 100%;
  height: 470px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;

  .user-no-data {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #909399;
  }

  .user-item {
    margin-bottom: 5px;
  }
}
</style>
