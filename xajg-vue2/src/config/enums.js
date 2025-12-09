const FLOW_STATUS_ENUM = {
  /**未提交 */
  SAVE: {
    value: 0,
    name: "未提交",
  },
  /**进行中 */
  SENT: {
    value: 1,
    name: "流转中",
  },
  /**已完成 */
  DONE: {
    value: 2,
    name: "已完成",
  },
};

/**层级 */
const PBS_LAYER_ENUM = [
  {
    value: "001",
    name: "建筑物",
  },
  {
    value: "002",
    name: "分部结构",
  },
  {
    value: "003",
    name: "细部结构",
  },
  {
    value: "004",
    name: "分类",
  },
];

/**类型 */
const PBS_TYPE_ENUM = {
  "001": [
    {
      value: "10001",
      name: "建筑物",
    },
    {
      value: "10002",
      name: "分类",
    },
    {
      value: "10003",
      name: "结构物",
    },
    {
      value: "10004",
      name: "其它",
    },
  ],
  "002": [
    {
      value: "20001",
      name: "导流洞洞身段",
    },
    {
      value: "20002",
      name: "公路段",
    },
    {
      value: "20003",
      name: "其它",
    },
  ],
  "003": [
    {
      value: "30001",
      name: "洞室开挖",
    },
    {
      value: "30002",
      name: "洞室支护",
    },
    {
      value: "30003",
      name: "洞室衬砌",
    },
    {
      value: "30004",
      name: "其它",
    },
  ],
  "004": [
    {
      value: "40001",
      name: "分类",
    },
  ],
  99999: [
    {
      value: "40001",
      name: "分类",
    },
  ],
};

/**
 * 流程状态
 * mine我的模板(初始) todo待办 done已办 wait待发 sent已发 fine办结 term终止 cc抄送
 */
const FLOW_PAGE_ENUM = {
  mine: "mine",
  todo: "todo",
  done: "done",
  wait: "wait",
  sent: "sent",
  fine: "fine",
  term: "term",
  cc: "cc",
};

/**
 * 修改类型
 * 1已修改 2 已删除 3 新增项
 */
const PLAN_EDIT_TYPE2 = [
  {
    value: 1,
    name: "已修改",
  },
  {
    value: 2,
    name: "已删除",
  },
  {
    value: 3,
    name: "新增项",
  },
  //代表供应计划修改已发起但未完成的数据
  {
    value: 4,
    name: "",
  },
];
/**
 * 项目划分分类
 */
const PROJECT_TYPE_ENUM = [
  {
    value: "dwgc",
    name: "单位工程",
  },
  {
    value: "fbgc",
    name: "分部工程",
  },
];

/**
 * 修改类型
 * 1修改任务项 2 删除任务 3 新增任务
 */
const PLAN_EDIT_TYPE = [
  {
    value: 1,
    name: "修改任务项",
  },
  {
    value: 2,
    name: "删除任务",
  },
  {
    value: 3,
    name: "新增任务",
  },
];

/**
 * 档案门类
 */
const ARCHIVE_CATEGORY_ENUM = [
  { value: "JJ", name: "基本建设类" },
  { value: "SB", name: "设备物资类" },
  { value: "KY", name: "科学研究类" },
  { value: "FW", name: "服务类" },
  { value: "CK", name: "穿跨临接类" },
  { value: "QT", name: "其他类" },
];

/**
 * 档案项目状态
 */
const ARCHIVE_PROJECT_STATUS_ENUM = [
  { value: 0, name: "未完成" },
  { value: 1, name: "已完成" },
];

/**
 * 案卷类别
 */
const VOLUME_CATEGORY_ENUM = [
  { value: "G", name: "项目管理" },
  { value: "S", name: "施工（实施）" },
  { value: "J", name: "监理文件" },
];

/**
 * 案卷状态
 */
const VOLUME_STATUS_ENUM = [
  { value: 0, name: "未提交" },
  { value: 1, name: "已提交" },
  { value: 2, name: "已归档" },
];

/**
 * 保管期限
 */
const RETENTION_PERIOD_ENUM = [
  { value: "永久", name: "永久" },
  { value: "长期", name: "长期" },
  { value: "短期", name: "短期" },
];

/**
 * 密级
 */
const SECURITY_LEVEL_ENUM = [
  { value: "绝密", name: "绝密" },
  { value: "机密", name: "机密" },
  { value: "秘密", name: "秘密" },
  { value: "无", name: "无" },
];

export default {
  PLAN_EDIT_TYPE2,
  FLOW_STATUS_ENUM,
  PBS_LAYER_ENUM,
  PBS_TYPE_ENUM,
  FLOW_PAGE_ENUM,
  PLAN_EDIT_TYPE,
  PROJECT_TYPE_ENUM,
  // 档案管理枚举
  ARCHIVE_CATEGORY_ENUM,
  ARCHIVE_PROJECT_STATUS_ENUM,
  VOLUME_CATEGORY_ENUM,
  VOLUME_STATUS_ENUM,
  RETENTION_PERIOD_ENUM,
  SECURITY_LEVEL_ENUM,
};
