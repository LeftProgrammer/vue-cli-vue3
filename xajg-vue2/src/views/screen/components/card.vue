<template>
  <div class="screen-card" :style="{ height: h + '%' }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    h: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
  .screen-card{
    width: 100%;
    border-radius: 10px;
    border: 1px solid transparent;
    border-image: linear-gradient(360deg, rgba(255, 255, 255, 0), rgba(0, 164, 156, 0.65)) 1 1;
    clip-path: inset(0 0 round 2px);
    padding: 10px;
  }
</style>
