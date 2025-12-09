<template>
  <div>
    <a-card size="small" :bordered="false" class="card-custom-style">
      <div v-if="featureId" class="show-box">
        <div>当前构件：</div>
        <div class="parameter-value">{{ featureId }}</div>
      </div>
      <a-space v-else>左键点击拾取构件！</a-space>
    </a-card>
  </div>
</template>

<script>
export default {
  props: {
    projectMessage: {
      type: Object,
      default: null,
    }, 
  },
  data() {
    return {
      featureId: undefined
    }
  },
  mounted() {
    const that = this;
    api.Public.event("LEFT_CLICK", function (click) {
      api.Feature.getByEvent(click.position, function (json) {
        if (json != undefined) {
          that.featureId = json.id.split("^")[1];
        } else {
          that.featureId = undefined;
        }
      });
    });
  },
  destroyed(){
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  }
}
</script>

<style lang="scss" scoped>
.show-box {
  display: flex;

  .parameter-value {
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

</style>