<template>
  <div class="app-wrapper">
    <app-header />

    <div class="app-content">
      <div v-if="!$route.meta.hiddenSidebar" class="sidebar-container">
        <Sidebar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  components: {
    appHeader: () => import("./component/Navbar"),
    AppMain: () => import("./component/AppMain"),
    Sidebar: () => import("./component/Sidebar"),
  },
  methods: {},
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background:none;
  //background-image: url("~@/assets/img/layout/bg.png");
  //background-position: center center;
  //background-size: cover;
  //background-repeat: no-repeat;

  .app-content {
    height: calc(100% - 100px);
    width: 100%;
    display: flex;
    .sidebar-container {
      width: 300px;
      height: 100%;

      //background-image: url("~@/assets/img/system/leftNavi.png");
      //background-position: center center;
      //background-size: cover;
      //background-repeat: no-repeat;
    }
    .app-main {
      // width: calc(100% - 300px);
      width: 0;
      flex: 1;
      height: 100%;
      background: none;

      & > div {
        width: 100%;
        // height: 100%;
        padding: 15px;
        border-radius: 4px;
      }
    }
  }

  .sidebar-container {
    .scrollbar-wrapper {
      margin-right: 0px !important;
      /* overflow: auto; */
      margin-bottom: 0px !important;
    }
  }
}
</style>
