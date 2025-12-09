<template>
  <dev>
    <iframe
      :src="url"
      style="width: 100%; height: 100%"
      frameborder="0"
    ></iframe>
  </dev>
</template>
<script>
export default {
  data() {
    return {
      url: "",
      historyLength: 0
    };
  },
  created() {
    // const queryStr = this.$route.query.queryStr;
    // this.url = "../../../ntko/officeTemplate/ntkoh5.html?" + queryStr;
    // window["closentko"] = (data) => {
    //   console.info("callBackData", data);
    //   let funName = "";
    //   if (data) funName = data.fun;
    //   this.$router.go(-1);
    //   var inter = setInterval(() => {
    //     console.info("关闭");
    //     if (this.$route.name === "ntko") {
    //       this.$router.go(-1);
    //     } else {
    //       //关闭时回调
    //       if (data) {
    //         window[funName](data.data);
    //       }
    //       clearInterval(inter);
    //     }
    //   }, 300);
    // };
  },
  mounted() {},
  methods: {}
};
</script>
<style></style>
