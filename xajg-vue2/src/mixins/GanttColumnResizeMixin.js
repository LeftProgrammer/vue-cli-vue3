/**
 * 甘特图列宽拖拽调整 Mixin
 * 用于免费版 DHTMLX Gantt 实现列宽调整功能
 *
 * 使用方式:
 * 1. import { GanttColumnResizeMixin } from "@/mixins/GanttColumnResizeMixin"
 * 2. mixins: [GanttColumnResizeMixin]
 * 3. 在 gantt.render() 后调用 this.$nextTick(() => { this.initColumnResize() })
 */
import { gantt } from "dhtmlx-gantt";

export const GanttColumnResizeMixin = {
  methods: {
    /**
     * 初始化列宽调整功能
     * 在 gantt.render() 后调用
     */
    initColumnResize() {
      const gridHeader = document.querySelector(".gantt_grid_scale");
      if (!gridHeader) return;

      // 清除已有的调整手柄，避免重复添加
      const existingResizers = gridHeader.querySelectorAll(".custom-column-resizer");
      existingResizers.forEach((resizer) => resizer.remove());

      const headerCells = gridHeader.querySelectorAll(".gantt_grid_head_cell");

      headerCells.forEach((cell, index) => {
        // 跳过最后一列（操作列）
        if (index >= headerCells.length - 1) return;

        // 创建调整手柄
        const resizer = document.createElement("div");
        resizer.className = "custom-column-resizer";
        resizer.style.cssText = `
          position: absolute;
          right: 0;
          top: 0;
          width: 3px;
          height: 100%;
          cursor: col-resize;
          z-index: 10;
        `;
        cell.style.position = "relative";
        cell.appendChild(resizer);

        let startX, startWidth, columnIndex;

        resizer.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          startX = e.pageX;
          startWidth = cell.offsetWidth;
          columnIndex = index;

          const onMouseMove = (e) => {
            const diff = e.pageX - startX;
            const newWidth = Math.max(60, startWidth + diff);

            // 更新表头宽度
            cell.style.width = newWidth + "px";

            // 更新 gantt 配置
            if (gantt.config.columns[columnIndex]) {
              gantt.config.columns[columnIndex].width = newWidth;
            }

            // 更新数据行对应列的宽度
            const dataCells = document.querySelectorAll(
              `.gantt_row .gantt_cell:nth-child(${columnIndex + 1})`
            );
            dataCells.forEach((dataCell) => {
              dataCell.style.width = newWidth + "px";
            });
          };

          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            // 重新渲染甘特图以应用新宽度
            gantt.render();
            // 重新初始化调整手柄（因为 render 会清除 DOM）
            this.$nextTick(() => {
              this.initColumnResize();
            });
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });
      });
    },
  },
};
