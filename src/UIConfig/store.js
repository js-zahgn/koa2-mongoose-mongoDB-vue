import Vue from 'vue';
import {Http, Url} from './api'
import Vuex from 'vuex';
Vue.use(Vuex);

export const SUBMIT_ORDER = 'SUBMIT_ORDER';
export const INIT_SHIP_ADDRESS = 'INIT_SHIP_ADDRESS'
export const CHANGE_SHIP_ADDRESS = 'CHANGE_SHIP_ADDRESS'
export const CHANGE_SEARCH_WORD = 'CHANGE_SEARCH_WORD'

const state = {
  shipAddress: null,
  balanceOrder: {},
}

const mutations = {
  [SUBMIT_ORDER](state, data) {
    state.balanceOrder = data
  },
  [INIT_SHIP_ADDRESS](state, data) {
    state.shipAddress = data
  },
  [CHANGE_SHIP_ADDRESS](state, data) {
    state.shipAddress = data
  }
}

const actions = {
  submitOrder({commit}, data) {
    commit(SUBMIT_ORDER, data)
  },
  initShipAddress({commit}) {
    Http.get(Url.getDefaultAddress).then(res => {
      commit(CHANGE_SHIP_ADDRESS, res.data.data)
    })
  },
  changeShipAddress({commit}, data) {
    commit(CHANGE_SHIP_ADDRESS, data)
  }
}

export default new Vuex.Store(
  {
    state,
    mutations,
    actions
  }
)
