import Vue from 'vue'
import App from './App.vue'
import router from './router'
import NProgress from 'vue-nprogress'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.config.productionTip = false

Vue.use(NProgress)
Vue.use(Buefy)

const nprogress = new NProgress({ latencyThreshold: 25 })

const app = new Vue({
  nprogress,
  router,
  render: h => h(App)
}).$mount('#app')

export default app
