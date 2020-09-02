import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () =>
      import(/* webpackChunkName: "courses" */ '../views/Courses.vue')
  },
  {
    path: '/trays',
    name: 'Trays',
    component: () =>
      import(/* webpackChunkName: "trays" */ '../views/Trays.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () =>
      import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  },
  {
    path: '/privacy',
    name: 'Settings',
    component: () =>
      import(/* webpackChunkName: "privacy" */ '../views/Privacy.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
