<template>
  <!-- v-watermark="{ watermarkText: '测试水印' }" -->
  <div class="app-wrapper">
    <app-header />
    <div class="app-content">
      <div class="sidebar-div">
        <div v-if="!$route.meta.hiddenSidebar" class="sidebar-container">
          <Sidebar />
        </div>
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {
    appHeader: () => import('./component/Navbar'),
    AppMain: () => import('./component/AppMain'),
    Sidebar: () => import('./component/Sidebar'),
    TagsView: () => import('./component/TagsView')
  },
  methods: {}
}
</script>

<style lang="scss">
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.module.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background: none;
  //background-image: url("~@/assets/img/layout/bg.png");
  //background-position: center center;
  //background-size: cover;
  //background-repeat: no-repeat;

  .app-content {
    // height: calc(100% - 100px);
    height: 94.44%;
    max-height: calc(100% - 65px);
    width: 100%;
    display: flex;

    .sidebar-div {
      // background-color: #0A6CD8; /* HEX 值 */
      background: #fff;
      width: 9%;
      min-width: 150px;
    }
    .sidebar-container {
      // width: 300px;
      width: 100%;
      height: 100%;
    }
    .app-main {
      // width: calc(100% - 300px);
      width: 0;
      flex: 1;
      height: 100%;
      background: none;

      & > .content {
        & > div {
          padding: 15px;
        }
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

.wbench-el-dialog
  .el-dialog__body
  .el-form
  .el-form-item__content
  :not(.el-input__validateIcon):not(
    .el-range__close-icon
  ).el-icon-circle-close {
  right: 0px !important;
  top: 0px !important;
}

.el-form {
  .el-form-item {
    margin-bottom: 16px !important;
  }
}

.el-table {
  .el-table__row {
    .el-form-item {
      margin-bottom: 0px !important;

      .el-form-item__content {
        top: 0px !important;
      }
    }

    .is-error {
      .el-form-item__content {
        margin-bottom: 16px !important;
      }
    }
  }

  .el-table__row td:not(.is-hidden):last-child {
    /*left:1px;  */
    right: -1px;
  }
}

.el-form-item__content {
  /**
   * 去掉 催办 的按钮
   */
  .wbench-button:nth-last-child(2).wbench-button-urge {
    // .wbench-button-urge:first-child {
    // .wbench-button-urge:first-of-type {
    display: none !important;
  }
}

.el-input__suffix {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wbench-process-page {
  .wbench-process-main {
    .wbench-form-container {
      margin-top: 0px;
    }
  }
}

// 1080p以下自适应样式
@media screen and (max-width: 1440px) {
  .app-wrapper {
    // .app-content {
    //   height: calc(100% - 65px);
    // }
    @include clearfix;
    .app-content {
      //.sidebar-div {
      //  background-image: url("~@/assets/img/system/hehua_1080.png"),
      //    url("~@/assets/img/system/leftNavi_1080.png");
      //}

      // .sidebar-container {
      //   width: 190px;
      // }
    }
  }
}
// 1080p自适应样式
@media screen and (min-width: 1441px) and (max-width: 1920px) {
  .app-wrapper {
    // .app-content {
    //   height: calc(100% - 85px);
    // }
    @include clearfix;
    .app-content {
      //.sidebar-div {
      //  background-image: url("~@/assets/img/system/hehua_1080.png"),
      //    url("~@/assets/img/system/leftNavi_1080.png");
      //
      //  // width: 168px;
      //}

      // .sidebar-container {
      //   width: 220px;
      // }
    }
  }
}
</style>
