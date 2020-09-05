import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import GoogleApi from '../scripts/googleapi'

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
    name: 'Privacy',
    component: () =>
      import(/* webpackChunkName: "privacy" */ '../views/Privacy.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'hash'
})

router.beforeResolve(async (to, from, next) => {
  const actualPath = window.location.href
  const url = new URL(actualPath)

  console.log(to)

  if (url.searchParams.get('state') === 'return_from_google') { // it's google
    await googleCode(url.searchParams.get('code'))
    window.location.href = `${url.protocol}//${url.host}/#/settings` // again so stupid code, but working around restrictions...
  } else {
    next()
  }
})

async function googleCode (code) {
  await GoogleApi.returnedCode(code)
  return true
}

export default router
