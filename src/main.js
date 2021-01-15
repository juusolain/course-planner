import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import App from './App.vue'

import router from './router'

import NProgress from 'vue-nprogress'

import AsyncComputed from 'vue-async-computed'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

// remove in prod
import SyncManager from './scripts/sync'
import CourseManager from './scripts/courses'
import Exporter from './scripts/export'
import GoogleApi from './scripts/googleapi'
import db from './scripts/database'

Vue.config.productionTip = false

Vue.use(NProgress)
Vue.use(Buefy)
Vue.use(AsyncComputed)

window.sync = SyncManager
window.db = db
window.courses = CourseManager
window.export = Exporter
window.google = GoogleApi

const nprogress = new NProgress({ latencyThreshold: 25 })

const app = new Vue({
  nprogress,
  router,
  render: h => h(App)
}).$mount('#app')

export default app
