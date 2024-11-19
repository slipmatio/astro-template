import axios from 'axios'
import { acceptHMRUpdate, defineStore } from 'pinia'

const API_URL = import.meta.env.DEV ? '/api' : 'https://api.slipmat.io'
const api = axios.create({
  baseURL: API_URL,
})

const versionString =
  import.meta.env.MODE === 'development' ? import.meta.env.VITE_APP_VERSION + '-dev' : import.meta.env.VITE_APP_VERSION

export const useStore = defineStore('main', {
  state: () => ({
    debug: import.meta.env.DEV,
    version: versionString,
    isInitialized: false,
  }),

  actions: {
    initApp() {
      if (this.isInitialized) {
        if (this.debug) {
          console.log('App already initialized')
        }
        return
      } else {
        if (this.debug) {
          console.log('Initing store')
        }
      }
      this.isInitialized = true
    },
  },

  getters: {
    isReady: (state) => {
      return state.isInitialized
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
