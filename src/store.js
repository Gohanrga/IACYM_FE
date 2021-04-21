import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    session:''
  },
  plugins: [new VuexPersistence().plugin],
  mutations: {
    login(state, paSession){
      state.session = paSession
    },
    logout(state){
      state.session = "";
    }
  },
  actions: {
    
  }
})
