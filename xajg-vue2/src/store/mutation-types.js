export const ACCESS_TOKEN = 'SZGC-SHIRO-TOKEN'
//导航页面路由
export const INDEX_MAIN_PAGE_PATH = '/mdgHome'
//工作中心路由
export const INDEX_HOMEPAGE_PATH = '/homeIndex/index'


export const LEFT_CLICK_TYPE = 'LEFT_CLICK_TYPE' //当前点击事件类型
export const FRONT_LEFT_CLICK_TYPE = 'FRONT_LEFT_CLICK_TYPE' //上一步点击事件类型
export const LEFT_CLICK_POSITION = 'LEFT_CLICK_POSITION' //点击事件位置
export const LEFT_CLICK_CALLBACKS = 'LEFT_CLICK_CALLBACKS' //点击事件回调列表
export const MOUSE_MOVE_TYPE = 'MOUSE_MOVE_TYPE' //鼠标悬浮事件类型
export const FRONT_MOUSE_MOVE_TYPE = 'FRONT_MOUSE_MOVE_TYPE' //上一步悬浮事件类型
export const MOUSE_MOVE_POSITION = 'MOUSE_MOVE_POSITION' //鼠标悬浮事件位置
export const MOUSE_MOVE_CALLBACKS = 'MOUSE_MOVE_CALLBACKS' //鼠标悬浮事件回调列表


/**
 * 定义菜单索引对象，用于标识不同类型的菜单项。
 * 
 * @constant
 * @type {Object}
 * @property {number} WEB - 表示网页类型的菜单项索引。
 * @property {number} APP - 表示应用类型的菜单项索引。
 * @property {number} BIM - 表示大屏类型的菜单项索引。
 * @exported
 */
export const MENU_INDEX_OBJ = {
  WEB: 0,
  APP: 1,
  LARGE: 2,
};

/**
 * 导出常量MENU_INDEX，其值为MENU_INDEX_OBJ对象中的BIM属性。
 * 这里的目的是为了在其他模块中使用MENU_INDEX_OBJ对象的BIM属性值，
 * 通过导出常量的方式，可以确保该值在应用程序中的一致性和不可变性。
 */
export const MENU_INDEX = MENU_INDEX_OBJ.WEB;
