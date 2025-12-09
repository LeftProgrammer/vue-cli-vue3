<template>
  <div class="h-352 position-relative" style="overflow-x: hidden; overflow-y: auto">
    <!-- <div class="mb-30">
      <el-image
        class="w-100pre h-104"
        :src="require('../assets/entry.png')"
      ></el-image>
    </div> -->
    <div>
      <el-row :gutter="16">
        <el-col v-for="config in configs" :key="config.key" :span="12" class="text-center p-8">
          <div @click="goTo(config)" :title="config.title">
            <el-image class="w-58 h-58" :src="config.icon"></el-image>
            <div class="link text-ellipsis">
              {{ config.title }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as UrlUtil from "@/utils/url";

export default {
  data() {
    return {};
  },
  methods: {
    goTo(config) {
      let { url, tips } = config;
      if (!url) {
        this.$message(tips);
        return;
      }
      url = UrlUtil.computeUrl(url);
      window.open(url);
    },
  },
  mounted() {
  },
  computed: {
    userInfo() {
      return this.$getStorage("userInfo");
    },
    configs() {
      let config = this.$store.state.webUrlConfig;
      let configs = [];
      for (let k in config) {
        let item = config[k];
        if (typeof item === "object") {
          configs.push({
            key: k,
            url: item.url,
            icon: item.icon,
            title: item.title,
            tips: item.tips || "当前系统链接不支持跳转！"
          });
        }
      }
      return configs;
    },
  },
};
</script>

<style>
.link {
  color: #1298fa;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;
}

/* .link:hover {
  color: #1298f1;
} */
</style>
