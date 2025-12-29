/**
 * @param {string} watermarkText 水印文本
 * @returns {HTMLDivElement} 水印 DOM 元素
 */
function createWatermark(watermarkText) {
  const can = document.createElement("canvas");
  const ctx = can.getContext("2d");
  can.width = 400;
  can.height = 250;

  ctx.font = "16px Microsoft YaHei";
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.rotate((-20 * Math.PI) / 180);

  // 获取当前日期
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const currentDateString = `${year}-${month}-${day}`;
  ctx.fillText(
    `${watermarkText} ${currentDateString}`,
    can.width / 10,
    can.height / 2
  );

  const div = document.createElement("div");
  div.style.pointerEvents = "none";
  div.style.top = "0px";
  div.style.left = "0px";
  div.style.position = "fixed";
  div.style.zIndex = "100000";
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.background = `url(${can.toDataURL("image/png")}) repeat`;
  return div;
}

// 自定义水印指令
export default {
  bind(el, binding) {
    const { watermarkText } = binding.value;

    const watermarkDiv = createWatermark(watermarkText);
    el.__watermark__ = watermarkDiv;
    document.body.appendChild(watermarkDiv);
  },
  unbind(el) {
    if (el.__watermark__) {
      document.body.removeChild(el.__watermark__);
      delete el.__watermark__;
    }
  },
};
