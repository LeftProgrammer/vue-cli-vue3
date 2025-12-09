import Cookies from 'js-cookie'
import Socket from '@/socket'
// import { getConfigList } from '@/api/system'
import { getUserList } from '@/api/user'

const state = {
  sidebar: {
    opened: true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  socket: null,
  config: { RefreshTime: 3100 },
  userList: []
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_APP_SOCKET: (state, socket) => {
    state.socket = socket
  },
  SET_APP_CONFIG: (state, config) => {
    state.config = config
  },
  SET_USER_LIST: (state, userList) => {
    state.userList = userList
  }
}

const actions = {
  async setUserList({ commit }) {
    const { data } = await getUserList({
      corpIdNotNull: 1,
      roleId: 'b3c3e32e-1a09-4d37-840a-363d5e3c'
    })
    data.forEach(item => {
      !item.realName && (item.realName = item.nickName)
    })
    commit('SET_USER_LIST', data)
  },
  setAppSocket({ commit, state }) {
    // console.log(getters, this, 'setAppSocket')
    if (state.socket) return
    commit('SET_APP_SOCKET', new Socket(location.hostname, location.port, '', this.getters.loginInfo.id))
  },
  async setAppConfig({ commit }) {},
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
