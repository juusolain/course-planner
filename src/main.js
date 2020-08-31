import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import NProgress from 'vue-nprogress'
import VueGAPI from 'vue-gapi'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import SyncManager from './scripts/sync'

Vue.config.productionTip = false

Vue.use(NProgress)
Vue.use(Buefy)
Vue.use(VueGAPI, SyncManager.googleConfig)

window.sync = SyncManager

const nprogress = new NProgress({ latencyThreshold: 25 })

const app = new Vue({
  nprogress,
  router,
  render: h => h(App)
}).$mount('#app')

export default app
