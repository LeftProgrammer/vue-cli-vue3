<template>
  <div class="h-100pre">
    <!-- 所有的待办事项 循环 -->
    <div class="overflow-y-scroll h-100pre">
      <div v-if="todoDataList && todoDataList.length !== 0">
        <div
          v-for="(item, index) in todoDataList"
          :key="index"
          class="flex align-center py-7 pl-14 pr-18 rounded-2 mb-10 pointer"
          style="background-color: #edfbff"
          @click="todoHandle(item)"
        >
          <div
            class="w-8 h-8 mr-16 shadow-dot"
            style="background-color: #ffb86c; border-radius: 50%"
          />
          <div class="line-25 font-14">{{ item.todoTitle }}--{{ item.procTaskName }}</div>
        </div>
      </div>
      <div v-else class="flex justify-center align-center text-center h-100pre">
        <el-empty
          class="todo-empty"
          :image-size="240"
          :description="''"
          :image="require('../assets/empty.png')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { todoList } from "./api.js";
import { socket } from "@szgc/plt-core";

export default {
  data() {
    return {
      todoDataList: [],
      todoList: [],
      todoTatol: 0,
      currentPermCode: 0,
      typeDictMap: [],
      typeOptions: [],
      treeNode: {}, //点击树节点传递给子组件使用
      node: {},
      type: ""
    };
  },
  created() {
    this.initData();
    socket.on("NOTICE", (data) => {
      if (data.noticeType == "20") {
        this.todoDataList = [];
        this.todoList = [];
        this.initData();
      }
    });
  },
  methods: {
    initData() {
      this.getTodoList();
    },
    async todoHandle(row) {
      this.todoPath(row.businessId);
    },
    // 跳转到待办页面
    todoPath(businessId) {
      this.$router.push({ path: "/common/flow", query: { businessId }});
    },
    // 获取待办
    async getTodoList() {
      const res = await todoList({
        current: 1,
        pageSize: 999,
        size: 999
      });
      this.todoDataList = res.data.records;
    }
  }
};
</script>

<style lang="scss" scoped>
.shadow-dot {
  box-shadow: 0px 4px 5px -1px #ffb86c;
}

.overflow-y-scroll {
  overflow: auto;
  height: calc(100% - 70px);
}

.todo-empty {
  /deep/ img {
    width: 100%;
    height: 100%;
  }

  /deep/ .el-empty__description {
    display: none;
    margin-top: 20px;
    color: #98a9ba;
    font-size: 12px;
  }
}
</style>
