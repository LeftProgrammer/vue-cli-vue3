<template>
  <div
    ref="line"
    class="drag-line"
    :style="dragStyle"
    @mousedown="handelMouseDown"
    @mouseup="handelMouseUp"
  ></div>
</template>

<script>
export default {
  name: "DragLine",
  props: {
    minMoveX: {
      type: Number,
      default: undefined,
    },
    useTransform: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["move-start", "moving", "move-end"],
  data() {
    return {
      moveX: 0,
      enableMove: false,
      hasMovedX: 0,
      clientX: 0,
      rafId: 0,
    };
  },
  computed: {
    dragStyle() {
      return this.useTransform ? { transform: `translateX(${this.moveX}px)` } : undefined;
    },
  },
  mounted() {
    this.hasMovedX = this.minMoveX || 0;
  },
  beforeUnmount() {
    document.body.classList.remove("drag-line--ondrag");
    document.removeEventListener("mousemove", this.handelMouseMove);
    document.removeEventListener("mouseup", this.handelMouseUp);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  },
  methods: {
    handelMouseDown(event) {
      this.enableMove = true;
      this.clientX = event.clientX;
      document.body.classList.add("drag-line--ondrag");
      this.$emit("move-start");
      document.addEventListener("mousemove", this.handelMouseMove);
      document.addEventListener("mouseup", this.handelMouseUp);
    },
    handelMouseUp() {
      if (!this.enableMove) {
        return;
      }
      this.enableMove = false;
      document.body.classList.remove("drag-line--ondrag");
      document.removeEventListener("mousemove", this.handelMouseMove);
      document.removeEventListener("mouseup", this.handelMouseUp);
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
      this.$emit("move-end", this.moveX);
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
      if (this.minMoveX !== undefined && this.minMoveX !== null) {
        if (this.hasMovedX + moveX < this.minMoveX) {
          moveX = this.minMoveX - this.hasMovedX;
        }
      }
      this.moveX = moveX;

      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => {
          this.rafId = 0;
          this.$emit("moving", this.moveX);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.drag-line {
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  background: transparent;
  height: 100%;
  z-index: 10;
  cursor: col-resize;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    background: rgba(var(--el-color-primary-rgb), 0.35);
    transition: background 0.15s ease;
  }
}
</style>

<style>
.drag-line--ondrag {
  user-select: none;
  cursor: col-resize;
}

.drag-line--ondrag .drag-line::before {
  background: rgba(var(--el-color-primary-rgb), 0.8) !important;
  width: 2px !important;
}
</style>
