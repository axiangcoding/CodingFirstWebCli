import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    avatarUrl: '',
    isLogin: false,
    isAdmin: false,
    isClockIn: false,
    unReadMsgCount: 0,
    token: '',
    activeIndex: ''
  },
  mutations: {
    LOGOUT (state) {
      sessionStorage.clear()
      state.username = ''
      state.avatarUrl = ''
      state.isLogin = false
      state.isAdmin = false
      state.isClockIn = false
      state.unReadMsgCount = 0
      state.token = ''
    },
    setUsername (state, username) {
      state.username = username
    },
    setAvatarUrl (state, avatarUrl) {
      state.avatarUrl = avatarUrl
    },
    setIsLogin (state, isLogin) {
      state.isLogin = isLogin
    },
    setIsAdmin (state, isAdmin) {
      state.isAdmin = isAdmin
    },
    setIsClockIn (state, isClockIn) {
      state.isClockIn = isClockIn
    },
    setUnReadMsgCount (state, unReadMsgCount) {
      state.unReadMsgCount = unReadMsgCount
    },
    setToken (state, token) {
      state.token = token
    },
    setActiveIndex (state, activeIndex) {
      state.activeIndex = activeIndex
    }
  },
  getters: {
    getUsername: state => state.username,
    getAvatarUrl: state => state.avatarUrl,
    getIsLogin: state => state.isLogin,
    getIsAdmin: state => state.isAdmin,
    getIsClockIn: state => state.isClockIn,
    getUnReadMsgCount: state => state.unReadMsgCount,
    getToken: state => state.token,
    getActiveIndex: state => state.activeIndex
  },
  actions: {
  },
  modules: {
  }

})
