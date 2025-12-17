<template>
  <iframe id="myFrame" class="iframe" :src="url" frameborder="0"></iframe>
</template>

<script>
export default {
  name: "CommonView",
  data() {
    return {
      url: "",
    };
  },
  watch: {
    "$route.query.url": {
      handler(newUrl) {
        this.init(newUrl);
      },
    },
  },
  created() {
    const queryUrl = this.$route && this.$route.query && this.$route.query.url;
    this.init(queryUrl);
  },
  methods: {
    init(url) {
      this.url = url || "";
    },
  },
};
</script>

<style scoped lang="scss">
.iframe {
  height: 100%;
  width: 100%;
}
</style>
