<template>
  <div class="list-button-container">
    <template v-if="showMore">
      <el-link
        v-for="(item, idx) in visibleBtns.slice(0, 2)"
        :key="item.method || idx"
        :type="item.method === 'delete' ? 'danger' : item.type || 'primary'"
        :underline="false"
        :disabled="isBtnDisabled(item)"
        @click="handleClick(item)"
      >
        {{ item.title }}
      </el-link>

      <el-dropdown @command="handleCommand">
        <span class="more-trigger">更多</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, idx) in visibleBtns.slice(2)"
              :key="item.method || idx"
              :command="item.method"
              :disabled="isBtnDisabled(item)"
            >
              {{ item.title }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>

    <template v-else>
      <el-link
        v-for="(item, idx) in visibleBtns"
        :key="item.method || idx"
        :type="item.method === 'delete' ? 'danger' : item.type || 'primary'"
        :underline="false"
        :disabled="isBtnDisabled(item)"
        @click="handleClick(item)"
      >
        {{ item.title }}
      </el-link>
    </template>
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
      default: () => [
        {
          title: "编辑",
          method: "edit",
        },
        {
          title: "删除",
          method: "delete",
          confirm: true,
        },
      ],
    },
    fromParent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    userId() {
      const fromGetter = this.$store && this.$store.getters && this.$store.getters.loginInfo && this.$store.getters.loginInfo.userId;
      if (fromGetter) return fromGetter;
      try {
        const raw = localStorage.getItem("userInfo");
        const info = raw ? JSON.parse(raw) : null;
        return info && info.userId;
      } catch (e) {
        return undefined;
      }
    },
    normalizedBtns() {
      return (this.btns || []).map((item) => {
        if (typeof item === "string") {
          if (item === "view") return { method: "view", title: "查看" };
          if (item === "edit") return { method: "edit", title: "编辑" };
          if (item === "delete") return { method: "delete", title: "删除", confirm: true };
          return { method: item, title: item };
        }
        return item || {};
      });
    },
    visibleBtns() {
      return this.normalizedBtns.filter((x) => (typeof x.visible === "boolean" ? x.visible : true));
    },
    showMore() {
      return this.visibleBtns.length > 3;
    },
  },
  methods: {
    isBtnDisabled(btn) {
      if (!btn) return false;
      if (typeof btn.disabled === "boolean") return btn.disabled;

      const row = this.data || {};
      const disabledBtns = Array.isArray(row.disabledBtns) ? row.disabledBtns : [];
      if (btn.method && disabledBtns.includes(btn.method)) {
        return true;
      }

      if ((btn.method === "edit" || btn.method === "delete") && row.createUser && this.userId) {
        return row.createUser !== this.userId;
      }

      return false;
    },
    async handleClick(btn) {
      if (!btn || this.isBtnDisabled(btn)) return;

      const payload = {
        ...(this.data || {}),
        $index: this.index,
      };

      if (btn.method === "delete" || btn.confirm) {
        try {
          await ElMessageBox.confirm(`确认${btn.title || "操作"}吗?`, "提示", {
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
    handleCommand(command) {
      const btn = this.visibleBtns.find((item) => item.method === command);
      this.handleClick(btn);
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

.more-trigger {
  cursor: pointer;
  color: var(--el-color-primary);
}
</style>
