import { MOUSE_MOVE_TYPE, FRONT_MOUSE_MOVE_TYPE, MOUSE_MOVE_CALLBACKS, MOUSE_MOVE_POSITION, } from '@/store/mutation-types'

const mouseMove = {
  state: {
    mouse_move_type: 1, //1选择建筑 2选择楼层 10拾取坐标
    front_mouse_move_type: 1,//当前操作之前的操作类型
    mouse_move_position: undefined, //鼠标悬浮事件位置
    callbacks: {}, //回调事件
  },
  mutations: {
    [MOUSE_MOVE_TYPE]: (state, move_type) => {
      state.mouse_move_type = move_type
    },
    [FRONT_MOUSE_MOVE_TYPE]: (state, move_type) => {
      state.front_mouse_move_type = move_type
    },
    [MOUSE_MOVE_CALLBACKS]: (state, { move_type, callback }) => {
      if (typeof callback === 'function')
        state.callbacks[move_type] = callback
    },
    [MOUSE_MOVE_POSITION]: (state, position) => {
      state.mouse_move_position = position
    },
  },
  actions: {
    ResetMouseMove ({ commit, state }, move_type) {//设置当前鼠标悬浮事件
      commit(MOUSE_MOVE_TYPE, move_type || state.front_mouse_move_type)
    },
    SetMouseMoveType ({ commit, state }, { move_type, callback }) {//设置鼠标悬浮事件类型
      commit(FRONT_MOUSE_MOVE_TYPE, state.mouse_move_type)//记录上一步事件类型
      commit(MOUSE_MOVE_TYPE, move_type)
      commit(MOUSE_MOVE_CALLBACKS, { move_type, callback })
    },
    SetMouseMove ({ commit, state }, $api) {//初始化鼠标悬浮事件
      $api.Public.Event('MOUSE_MOVE', (click) => {
        commit(MOUSE_MOVE_POSITION, click)
        if (typeof state.callbacks[state.mouse_move_type] === 'function')
          state.callbacks[state.mouse_move_type](click)
      })
    },
  }
}

export default mouseMove
