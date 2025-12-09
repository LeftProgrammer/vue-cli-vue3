<template>
  <div
    class="drag-line"
    @mousedown="handelMouseDown"
    @mouseup="handelMouseUp"
    :style="{ transform: 'translateX(' + moveX + 'px)' }"
    ref="line"
  ></div>
</template>

<script>
export default {
  name: "DragLine",
  props: {
    minMoveX: {
      type: Number,
    },
  },
  data() {
    return {
      moveX: 0,
      enableMove: false,
      hasMovedX: 0,
    };
  },
  mounted() {
    this.hasMovedX = this.minMoveX || 0;
  },
  beforeDestroy() {},
  methods: {
    handelMouseDown(event) {
      this.enableMove = true;
      this.clientX = event.clientX;
      document.body.classList.add("drag-line--ondrag");
      document.addEventListener("mousemove", this.handelMouseMove);
      document.addEventListener("mouseup", this.handelMouseUp);
    },
    handelMouseUp(event) {
      this.enableMove = false;
      document.body.classList.remove("drag-line--ondrag");
      document.removeEventListener("mousemove", this.handelMouseMove);
      document.removeEventListener("mouseup", this.handelMouseUp);
      this.$emit("moveEnd", this.moveX);
      this.hasMovedX = this.moveX + this.hasMovedX;
      this.$nextTick(() => {
        this.moveX = 0;
      });
    },
    handelMouseMove(event) {
      if (!this.enableMove) {
        return;
      }
      let moveX = event.clientX - this.clientX;
      if (this.minMoveX !== undefined || this.minMoveX !== null) {
        if (this.hasMovedX + moveX < this.minMoveX) {
          moveX = this.minMoveX - this.hasMovedX;
        }
      }
      this.moveX = moveX;
    },
  },
};
</script>

<style lang="scss" scoped>
.drag-line {
  position: absolute;
  top: 0;
  right: 0;
  width: 0px;
  background-color: #e4e1e1;
  height: 100%;
  //   background-color: transparent;
  z-index: 10;
  cursor: col-resize;
  transition: width 0.3s;
}
</style>
<style>
.drag-line--ondrag {
  user-select: none;
  cursor: col-resize;
}
</style>
