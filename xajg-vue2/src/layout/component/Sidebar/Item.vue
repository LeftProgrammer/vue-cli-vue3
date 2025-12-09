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
      default: ""
    },
    isRoot: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    iconPic: {
      type: String,
      default: ""
    },
    todoCount: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
/* 在这里添加你的CSS样式 */
.icon-pic {
  /* ... */
}
.is_root_icon {
  /* ... */
}
.icon-leaf {
  /* ... */
}
.title_span {
  /* ... */
}
.title_todo {
  /* ... */
}

.menu-item {
  position: relative;
  font-weight: 500;
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
