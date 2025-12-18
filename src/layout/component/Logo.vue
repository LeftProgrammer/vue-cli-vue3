<template>
  <div class="sidebar-logo-container" @click="handelClick"></div>
</template>

<script>
export default {
  name: "SidebarLogo",
  methods: {
    // 点击 Logo 返回首页，并设置 permCode 以保持菜单高亮在“工作中心”
    handelClick() {
      this.$router.push({
        path: "/homeIndex/index",
        query: {
          permCode: "home",
          name: "工作中心",
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.sidebar-logo-container {
  margin-left: 16px;
  font-size: 24px;
  position: relative;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  color: #ffffff;
  height: 40px;
  width: 134px;
  background-image: url("@/assets/img/system/logo.png");
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
}
</style>
