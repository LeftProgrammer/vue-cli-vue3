<template>
  <div class="app-wrapper">
    <AppNavbar />
    <div class="app-content">
      <div class="sidebar-div">
        <div v-if="!$route?.meta?.hiddenSidebar" class="sidebar-container">
          <AppSidebar />
        </div>
      </div>
      <AppMain />
    </div>
  </div>
</template>

<script>
import AppNavbar from "./component/Navbar.vue";
import AppMain from "./component/AppMain.vue";
import AppSidebar from "./component/Sidebar/index.vue";

export default {
  name: "LayoutIndex",
  components: {
    AppNavbar,
    AppMain,
    AppSidebar,
  },
};
</script>

<style lang="scss">
@import "@/styles/mixin.scss";
@import "@/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background: none;

  .app-content {
    height: 94.44%;
    max-height: calc(100% - 54px);
    width: 100%;
    display: flex;

    .sidebar-div {
      background: #fff;
      width: 9%;
      min-width: 157px;
    }

    .sidebar-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .app-main {
      width: 0;
      flex: 1;
      height: 100%;
      background: none;
    }
  }

  .sidebar-container {
    .scrollbar-wrapper {
      margin-right: 0 !important;
      margin-bottom: 0 !important;
    }
  }
}
</style>
