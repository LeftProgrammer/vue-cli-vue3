<template>
  <iframe style="height: 100%; width: 100%" id="myFrame" :src="url"></iframe>
</template>

<script>
export default {
  created() {
    let url = this.$route.query.url;
    this.init(url);
  },
  data() {
    return {
      url: "",
    };
  },
  methods: {
    init(url) {
      let newurl = url;
      // if (url.indexOf("blob:") === 0) {
      //   // newurl = window.URL.createObjectURL(url);
      // } else {
      //   newurl = url;
      // }
      // document.getElementById("myFrame").src = newurl;
      this.url = newurl;
    },
  },
};
</script>

<style></style>
