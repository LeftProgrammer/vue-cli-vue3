import { Message } from 'element-ui'

const engineer = {
  state: {
    stationList: [], // 已存在的站点列表
    selectedStation: {
      id: '',
      stationName: ''
    } // 已选中工程
  },
  mutations: {

    SET_ENGINEER_LIST: (state, list) => {
      if (!state.selectedStation || !state.selectedStation.id) {
        state.selectedStation = list[0]
      }
      state.stationList = list
    },

    SET_SELECTED_ENGINEER: (state, engineer) => {
      // 
      state.selectedStation = engineer
    }
  },
  actions: {

    /**
     * 获取工程列表，方便系统顶部绘制快速选择菜单
     * 新增二级菜单 update 2019-07-02
     * @param {*} { commit }
     */
    async getStationList({ commit }) {
      try {
        // const res = await getStationList()
        // if (res.success) {
        //   commit('SET_ENGINEER_LIST', res.data)
        // } else {
        //   Message.error('获取工程列表失败:' + res.message)
        // }
      } catch (e) {
        Message.error('获取工程列表失败:' + e)
      }
    },

    /**
     * 快速选择工程
     * @param {*} { commit }
     * @param {*} engineer
     */
    setSelectedStation({ commit }, engineer) {
      commit('SET_SELECTED_ENGINEER', engineer)
    }
  }
}

export default engineer
