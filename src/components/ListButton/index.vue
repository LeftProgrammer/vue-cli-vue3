<template>
  <div class="list-button-container">
    <el-link
      v-for="btn in normalizedBtns"
      :key="btn.method"
      :type="btn.method === 'delete' ? 'danger' : btn.type || 'primary'"
      :underline="false"
      @click="onClick(btn)"
    >
      {{ btn.title }}
    </el-link>
  </div>
</template>

<script>
import { ElMessageBox } from "element-plus";

export default {
  name: "ListButton",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: null,
    },
    // 可以是字符串数组，例如 ['view','delete']，也可以是对象数组
    btns: {
      type: Array,
      default: () => ["view", "delete"],
    },
  },
  computed: {
    normalizedBtns() {
      return this.btns.map((item) => {
        if (typeof item === "string") {
          if (item === "view") {
            return { method: "view", title: "查看" };
          }
          if (item === "delete") {
            return { method: "delete", title: "删除", confirm: true };
          }
          return { method: item, title: item };
        }
        return item;
      });
    },
  },
  methods: {
    async onClick(btn) {
      const payload = {
        ...(this.data || {}),
        $index: this.index,
      };

      if (btn.confirm) {
        try {
          await ElMessageBox.confirm("确认删除吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          });
        } catch (e) {
          return;
        }
      }

      this.$emit(btn.method, payload);
    },
  },
};
</script>

<style scoped lang="scss">
.list-button-container {
  display: flex;
  align-items: center;
  justify-content: center;

  > * {
    padding: 0 8px;
  }
}
</style>
