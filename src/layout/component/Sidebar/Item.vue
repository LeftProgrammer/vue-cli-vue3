<template>
  <div class="menu-item">
    <img
      v-if="icon && icon.indexOf('.') > -1"
      class="icon-pic icon-pic-h"
      :class="{ is_root_icon: isRoot }"
      :src="icon"
    />
    <img
      v-if="icon && icon.indexOf('.') > -1"
      class="icon-pic icon-pic-s"
      :class="{ is_root_icon: isRoot }"
      :src="icon.split('.')[0] + '-a.' + icon.split('.')[1]"
    />
    <i v-else-if="icon" class="iconfont" :class="icon"></i>
    <div v-else class="icon-leaf"></div>

    <span v-if="title" :class="{ is_root: isRoot, title_span: true }">
      {{ title }}
    </span>
    <div v-if="title && todoCount > 0" class="title_todo">
      {{ todoCount > 99 ? 99 : todoCount }}
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    icon: {
      type: String,
      default: "",
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    iconPic: {
      type: String,
      default: "",
    },
    todoCount: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped lang="scss">
.menu-item {
  position: relative;
  font-weight: 500;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
}

.title_span {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title_todo {
  margin-left: auto;
  margin-top: 2px;
  margin-right: 24px;
  background: var(--el-color-danger);
  width: 18px;
  height: 18px;
  font-size: 12px;
  line-height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex: 0 0 auto;
}
</style>
