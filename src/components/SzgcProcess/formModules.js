/**
 * 流程表单模块映射配置
 * 将接口返回的iframe路径映射到实际的Vue组件
 * 
 * 路径格式: /#/diy/{module}/{submodule}/dataform
 * 映射key: diy/{module}/{submodule}/dataform
 * 
 * 注意：diy路由仍保留用于单独测试表单页面
 */

const formModules = {
  // 设计管理 - 计划
  "diy/design/plan/dataform": () => import("@/views/design/center/plan/dataform.vue"),
  // "diy/design/planEdit/dataform": () => import("@/views/design/center/planEdit/dataform.vue"),
  // "diy/design/drawingSupply/dataform": () => import("@/views/design/center/drawingSupply/dataform.vue"),
  // "diy/design/report2/dataform": () => import("@/views/design/center/report2/dataform.vue"),
  // "diy/design/drawingSend/dataform": () => import("@/views/design/center/drawingSend/dataform.vue"),
  // "diy/design/DesignDisclosure/dataform": () => import("@/views/design/DesignDisclosure/dataform.vue"),
  
  // // 设计变更
  // "diy/designChanges/changeApply/dataform": () => import("@/views/designChanges/changeApply/dataform.vue"),
  // "diy/designChanges/projectChange/dataform": () => import("@/views/designChanges/projectChange/dataform.vue"),
  
  // 可继续添加其他模块...
};

/**
 * 路由路径到表单模块的映射
 * 用于add模式下根据当前路由路径加载对应的表单组件
 * key: 路由路径 (如 /design/center/plan)
 * value: 对应的formModules key
 */
const routeToFormMap = {
  "/design/center/plan": "diy/design/plan/dataform",
  // 可继续添加其他路由映射...
};

/**
 * 解析iframe配置中的路径
 * @param {Object|string} iframeConfig - 接口返回的iframe配置
 * @returns {string} 解析后的模块路径key
 */
export function parseIframePath(iframeConfig) {
  if (!iframeConfig) return "";
  
  try {
    let pathValue = "";
    
    if (typeof iframeConfig === "string") {
      pathValue = iframeConfig;
    } else if (iframeConfig.value) {
      const parsed = typeof iframeConfig.value === "string" 
        ? JSON.parse(iframeConfig.value) 
        : iframeConfig.value;
      pathValue = parsed.web || parsed.app || "";
    } else if (iframeConfig.object?.iframePath) {
      const parsed = typeof iframeConfig.object.iframePath === "string"
        ? JSON.parse(iframeConfig.object.iframePath)
        : iframeConfig.object.iframePath;
      pathValue = parsed.web || parsed.app || "";
    }
    
    // 移除 /#/ 前缀，得到纯路径 key
    // 例如: "/#/diy/design/plan/dataform" -> "diy/design/plan/dataform"
    return pathValue.replace(/^[/#]+/, "").trim();
  } catch (e) {
    console.error("[formModules] 解析iframe路径失败:", e, iframeConfig);
    return "";
  }
}

/**
 * 根据路径获取对应的组件加载器
 * @param {string} path - 模块路径key
 * @returns {Function|null} 组件的动态导入函数
 */
export function getFormModule(path) {
  return formModules[path] || null;
}

/**
 * 检查路径是否有对应的组件映射
 * @param {string} path - 模块路径key
 * @returns {boolean}
 */
export function hasFormModule(path) {
  return !!formModules[path];
}

/**
 * 根据路由路径获取对应的表单模块key
 * @param {string} routePath - 路由路径
 * @returns {string} 对应的formModules key
 */
export function getFormKeyByRoute(routePath) {
  if (!routePath) return "";
  // 标准化路径
  const normalizedPath = routePath.replace(/^\/+|\/+$/g, "");
  // 直接匹配
  if (routeToFormMap["/" + normalizedPath]) {
    return routeToFormMap["/" + normalizedPath];
  }
  // 尝试匹配
  for (const key in routeToFormMap) {
    if (normalizedPath.includes(key.replace(/^\/+/, ""))) {
      return routeToFormMap[key];
    }
  }
  return "";
}

/**
 * 根据路由路径获取表单组件加载器
 * @param {string} routePath - 路由路径
 * @returns {Function|null} 组件的动态导入函数
 */
export function getFormModuleByRoute(routePath) {
  const formKey = getFormKeyByRoute(routePath);
  return formKey ? getFormModule(formKey) : null;
}

export default formModules;
