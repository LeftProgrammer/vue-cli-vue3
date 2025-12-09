/**
 * 车辆管理模块常量
 */

// 车辆类型枚举
export const VEHICLE_TYPE = {
  TRUCK: "TRUCK", // 卡车
  EXCAVATOR: "EXCAVATOR", // 挖掘机
  BULLDOZER: "BULLDOZER", // 推土机
  LOADER: "LOADER", // 装载机
  CRANE: "CRANE", // 起重机
  CONCRETE_MIXER: "CONCRETE_MIXER", // 混凝土搅拌车
  ROLLER: "ROLLER", // 压路机
  OTHER: "OTHER", // 其他
};

// 车辆类型名称映射
export const VEHICLE_TYPE_NAME = {
  [VEHICLE_TYPE.TRUCK]: "卡车",
  [VEHICLE_TYPE.EXCAVATOR]: "挖掘机",
  [VEHICLE_TYPE.BULLDOZER]: "推土机",
  [VEHICLE_TYPE.LOADER]: "装载机",
  [VEHICLE_TYPE.CRANE]: "起重机",
  [VEHICLE_TYPE.CONCRETE_MIXER]: "混凝土搅拌车",
  [VEHICLE_TYPE.ROLLER]: "压路机",
  [VEHICLE_TYPE.OTHER]: "其他",
};
