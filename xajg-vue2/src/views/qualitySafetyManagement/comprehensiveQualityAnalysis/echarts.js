import * as echarts from "echarts";

export function init(id, option) {
  const dom = echarts.init(document.getElementById(id));
  const zoom = document.getElementById("QualitySafetyManagementHome").style.zoom;
  dom.setOption(option, true);
  const canvas = dom.getDom().getElementsByTagName("canvas")[0];
  canvas.style.zoom = 1 / zoom;
  canvas.style.transform = `scale(${zoom})`;
  canvas.style.transformOrigin = "0 0";
  return dom;
}
