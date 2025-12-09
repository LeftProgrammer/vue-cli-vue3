<template>
  <el-card>
    <template #header>
      <div
        style="height: 100%; width: 100%; display: flex; align-items: center"
      >
        <div class="title-line mr-5"></div>
        <div class="item-title">{{ title }}</div>
      </div>
      <div class="divider-line mt-10"></div>
    </template>
    <slot> <div style="height: 280px"></div> </slot>
  </el-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "工程面貌",
    },
  },
  name: "commonCard",
};
</script>
<style scoped>
.title-line {
  width: 3px;
  height: 10px;
  background: linear-gradient(322deg, #1298fa 0%, #6fcbff 100%);
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
}

.item-title {
  font-size: 16px;
  color: #1d2129;
  font-weight: 700;
}

.divider-line {
  background: #e5e6eb;
  height: 1px;
}

::v-deep .el-card__header {
  padding: 16px 20px 0 20px;
  border-bottom: none;
}
::v-deep .el-card__body {
  padding: 10px;
  height: calc(100% - 45px);
}
</style>