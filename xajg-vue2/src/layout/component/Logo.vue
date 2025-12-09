<template>
  <div class="sidebar-logo-container" @click="handelClick">
<!--      雄安调蓄工程建设管理系统-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      title: "雄安调蓄工程建设管理系统",
      logo: "https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png",
    };
  },
  computed: {
    ...mapGetters(["selectedStation"]),
    computedTitle() {
      if (this.$route.name !== "start-up") {
        return `雄安调蓄工程建设管理系统`;
      } else {
        return "雄安调蓄工程建设管理系统";
      }
    },
  },
  methods: {
    handelClick() {
      // if (this.$route.name !== 'start-up') {
      //   this.$router.push('/home')
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-logo-container {
  margin-left: 16px;
  font-size: 24px;
  position: relative;
  // width: 300px;
  // height: 100px;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  color: white;
  height: 40px;
  width: 134px;
  //todo 换成目标公司的logo
  background-image: url(@/assets/img/system/logo.png);
  background-position: center;
  background-size: 100%;
}
// 1080p以下自适应样式
@media screen and (max-width: 1440px) {
  .logo-top {
    height: 40px !important;
  }
}
// 1080p自适应样式
@media screen and (min-width: 1441px) and (max-width: 1920px) {
  .logo-top {
    height: 36px !important;
  }
}
@media screen and (min-width: 1920px) {
  .logo-top {
    height: 65px !important;
  }
}
</style>
