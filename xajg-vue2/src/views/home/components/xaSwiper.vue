<template>
  <div style="height: 100%">
    <el-carousel ref="swiper" style="height: 100%">
      <el-carousel-item
        style="height: 100%"
        v-for="item in swiperList"
        :key="item.id"
      >
        <el-image style="width: 100%; height: 100%" :src="item.url" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import { getPictures } from "./api.js";
import { getFilePath } from "@/api/user";
export default {
  data() {
    return {
      swiperList: [],
    };
  },

  async mounted() {
    await this.getSwiperList();
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  },
  methods: {
    async getSwiperList() {
      let res = await getPictures();
      const data = res.data || [];
      data.forEach(async (x, i) => {
        const res = await getFilePath({ fileInfoId: x.file, isDownload: 0 });
        const url = new URL(res.data);
        x.url = url.pathname + url.search;
        if (i === data.length - 1) this.swiperList = data;
      });
    },
  },
};
</script>
<style scoped lang="scss">
/deep/ .el-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/deep/ .el-carousel__container {
  height: 100%;
}

/deep/ .el-card__body {
  flex: 1;
}
</style>
