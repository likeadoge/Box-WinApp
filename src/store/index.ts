import Vue from 'vue'
import Vuex from 'vuex'
import { user } from '../api/index'
import store from 'store'
import { notification } from 'ant-design-vue'

Vue.use(Vuex)

export default new Vuex.Store<{
  user: {
    token: null | string;
  };
  loading: null | string;
}>({
  state: {
    user: {
      token: null,
    },
    loading: null
  },
  getters: {
    loginStatus(state) { return state.user.token === null ? false : true },
    globeLoading(state) {
      return state.loading === null ? { status: false, text: '' } : { status: true, text: state.loading }
    },
    userToken(state) { return state.user.token }
  },
  mutations: {
    SET_TOKEN: (state, token: string) => {
      state.user.token = token
    },
    DEL_TOKEN: (state) => {
      state.user.token = null
    },
    LOGIN_BEGIN: (state, text: string) => {
      state.loading = text
    },
    LOGIN_END: (state) => {
      state.loading = null
    },
  },
  actions: {
    // 登录
    Login({ commit }, data: { username: string; password: string }) {
      return user.login(data).then((res) => {
        const { token, userInfo } = res
        store.set('ACCESS_TOKEN', token)
        store.set('USER_NAME', userInfo.username)
        store.set('USER_INFO', userInfo)
        console.log('level-------', userInfo)
        commit('SET_TOKEN', token)
        const hour = new Date().getHours()
        notification.success({
          message: '欢迎', description: `${hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'}，欢迎回来`, duration: 4
        });
      }).catch(msg => {
        notification.error({ message: '登录失败', description: msg, duration: 4 })
      })
    },
    Logout({ commit }) { commit('DEL_TOKEN') },
    // 全局 loading
    LoadingBegin({ commit }, loadingText: string) { commit('LOGIN_BEGIN', loadingText) },
    LoadingEnd({ commit }) { commit("LOGIN_END") }
  },
  modules: {
  }
})
