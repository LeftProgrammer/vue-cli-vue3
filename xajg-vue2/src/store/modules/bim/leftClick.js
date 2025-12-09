import { LEFT_CLICK_TYPE, FRONT_LEFT_CLICK_TYPE, LEFT_CLICK_CALLBACKS, LEFT_CLICK_POSITION, } from '@/store/mutation-types'

const leftClick = {
  state: {
    left_click_type: 1, //当前操作类型 1选择建筑 2选择楼层 10拾取坐标 3 设备设施
    front_left_click_type: 1,//当前操作之前的操作类型
    left_click_position: undefined, //点击事件位置
    callbacks: {}, //回调事件
  },
  mutations: {
    [LEFT_CLICK_TYPE]: (state, click_type) => {
      state.left_click_type = click_type
    },
    [FRONT_LEFT_CLICK_TYPE]: (state, click_type) => {
      state.front_left_click_type = click_type
    },
    [LEFT_CLICK_CALLBACKS]: (state, { click_type, callback }) => {
      if (typeof callback === 'function')
        state.callbacks[click_type] = callback
    },
    [LEFT_CLICK_POSITION]: (state, position) => {
      state.left_click_position = position
    },
  },
  actions: {
    ResetLeftClick ({ commit, state }, click_type) {//设置当前单击事件
      commit(LEFT_CLICK_TYPE, click_type || state.front_left_click_type)
    },
    SetLeftClickType ({ commit, state }, { click_type, callback }) {//设置单击事件类型
      commit(FRONT_LEFT_CLICK_TYPE, state.left_click_type)//记录上一步事件类型
      commit(LEFT_CLICK_TYPE, click_type)
      commit(LEFT_CLICK_CALLBACKS, { click_type, callback })
    },
    SetLeftClick ({ commit, state }, $api) {//初始化单击事件
      $api.Public.Event('LEFT_CLICK', (click) => {
        commit(LEFT_CLICK_POSITION, click.position)
        if (typeof state.callbacks[state.left_click_type] === 'function')
          state.callbacks[state.left_click_type](click.position)
      })
    },
  }
}

export default leftClick
