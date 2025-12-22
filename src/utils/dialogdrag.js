const getComputedStyleValue = (dom) => {
  if (!dom) return null;
  return dom.currentStyle || window.getComputedStyle(dom, null);
};

const parsePx = (val) => {
  if (!val) return 0;
  return Number(String(val).replace(/px/g, "")) || 0;
};

const draggable = {
  mounted(el) {
    const dialogHeaderEl = el.querySelector(".el-dialog__header");
    const dragDom = el.querySelector(".el-dialog");

    if (!dialogHeaderEl || !dragDom) {
      return;
    }

    const parentDom = dragDom.parentElement;

    dragDom.style.zIndex = 9999;
    dialogHeaderEl.style.cursor = "move";

    const sty = getComputedStyleValue(dragDom);

    const onMouseDown = (e) => {
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      let styL = 0;
      let styT = 0;

      if (sty && String(sty.left || "").includes("%")) {
        styL =
          document.body.clientWidth *
          (Number(String(sty.left).replace(/%/g, "")) / 100);
        styT =
          document.body.clientHeight *
          (Number(String(sty.top).replace(/%/g, "")) / 100);
      } else {
        styL = parsePx(sty && sty.left);
        styT = parsePx(sty && sty.top);
      }

      const onMouseMove = (moveEvent) => {
        const l = moveEvent.clientX - disX;
        const t = moveEvent.clientY - disY;

        let cl = l + styL;
        let ct = t + styT;

        if (parentDom) {
          const cWidth = dragDom.clientWidth;
          const cHeight = dragDom.clientHeight;
          const pWidth = parentDom.clientWidth;
          const pHeight = parentDom.clientHeight;

          const minLeft = (cWidth - pWidth) / 2;
          const maxLeft = (pWidth - cWidth) / 2;
          if (cl < minLeft) cl = minLeft;
          if (cl > maxLeft) cl = maxLeft;

          let mt = 0;
          const marginTop = dragDom.style.marginTop;
          if (marginTop && marginTop.endsWith("vh")) {
            const vh = Number(marginTop.replace(/vh/g, "")) || 0;
            mt = (-1 * pHeight * vh) / 100;
          }

          if (ct < mt) ct = mt;
          if (ct > pHeight - cHeight + mt) ct = pHeight - cHeight + mt;
        }

        dragDom.style.left = `${cl}px`;
        dragDom.style.top = `${ct}px`;
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    dialogHeaderEl.addEventListener("mousedown", onMouseDown);

    el.__dialogDragCleanup__ = () => {
      dialogHeaderEl.removeEventListener("mousedown", onMouseDown);
    };
  },
  updated(el) {
    const dialogHeaderEl = el.querySelector(".el-dialog__header");
    const dragDom = el.querySelector(".el-dialog");
    if (dialogHeaderEl && dragDom && !el.__dialogDragCleanup__) {
      draggable.mounted(el);
    }
  },
  unmounted(el) {
    if (el.__dialogDragCleanup__) {
      el.__dialogDragCleanup__();
      delete el.__dialogDragCleanup__;
    }
  },
};

export default draggable;
