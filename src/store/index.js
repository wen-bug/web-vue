import { createStore } from 'vuex'

const store = createStore({
  state: {
    cookied: 30,
    socketPath: "http://47.103.147.250/socket/chat",
    socket: '',
    host: ['http://127.0.0.1:80', 'http://47.103.147.250/api'],

    //查询数据
    finds: '',
    blogID:'',
    // 编辑文章
    get_blog:'',
    //登录状态
    lives:false,
    //当前博客数据
  },
  mutations: {
  },
  actions: {

  },
  modules: {
  }
})
export function myStore() {
  return store;
}
export default store
