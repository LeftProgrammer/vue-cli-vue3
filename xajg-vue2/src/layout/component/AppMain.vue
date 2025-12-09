<template>
  <section class="app-main">
    <div class="tagsBg">
      <tagsView v-if="intoSyster" class="tagsView" />
    </div>
    <div class="content">
      <transition name="fade-transform" mode="out-in" class="fade-test">
        <keep-alive :include="cachedViews">
          <router-view :key="key"></router-view>
        </keep-alive>
      </transition>
    </div>
    <i
      v-if="
        $route.query &&
        $route.query.permCode &&
        whiteList[$route.query.permCode]
      "
      class="el-icon-question help"
      title="帮助文档"
      @click="handleHelpBtnClick(whiteList[$route.query.permCode])"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppMain',
  components: {
    TagsView: () => import('./TagsView')
  },
  data() {
    return {
      isRouterActive: false,
      whiteList: {}
    }
  },
  computed: {
    cachedViews() {
      console.log(
        '🚀 ~ cachedViews ~ this.$store.state.tagsView.cachedViews:',
        this.$store.state.tagsView.cachedViews
      )
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    ...mapGetters(['userInfo']),
    intoSyster() {
      return true
    }
  },
  watch: {
    'selectedStation.id'(val) {
      if (val) {
        this.reload()
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('user/getInfo')
    // await this.$store.dispatch('app/setAppSocket')
    this.isRouterActive = true
  },
  methods: {
    reload() {
      this.isRouterActive = false
      this.$nextTick(() => {
        this.isRouterActive = true
      })
    },
    handleHelpBtnClick(href) {
      if (href) {
        window.open(href, '_blank')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: 100%;
  position: relative;
  overflow: hidden;
  // padding: 10px;
  // background: #ededed;
  background: #cae6ff !important;

  .tagsBg {
    // background: #fff;
    // border-top-right-radius: 4px;
    // border-top-left-radius: 4px;
  }
  .tagsView {
    // background: linear-gradient( 90deg, #105EE8 0%, #197DEC 100%);
    // border-top-left-radius: 4px;
    // border-top-right-radius: 4px;
  }
  .content {
    background: #f0f4f8;
    // background: #f7f8fa;
    padding: 16px;
    height: calc(100% - 48px);
    // border-bottom-left-radius: 5px;
    // border-bottom-right-radius: 5px;
    > div {
      background-color: #fff;
    }
  }
  .help {
    position: absolute;
    top: 24px;
    right: 24px;
    font-size: 22px;
    cursor: pointer;
    color: #909399;
  }
}
</style>
