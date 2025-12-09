<template>
  <section class="app-main">
    <div class="content">
      <router-view />
    </div>
  </section>
</template>

<script>
export default {
  name: "LayoutAppMain",
};
</script>

<style scoped lang="scss">
.app-main {
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #cae6ff !important;
}

.content {
  background: #f0f4f8;
  padding: 16px;
  height: 100%;
}

.content > div {
  background-color: #fff;
}
</style>
