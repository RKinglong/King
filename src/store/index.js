import { createStore } from 'vuex';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state = {
  user:{
    isLogin: window.localStorage.getItem('token') ? true : false
  },
  cartCount:0,
}

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {
  }
})
