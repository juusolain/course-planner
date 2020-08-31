<template>
  <div id="app">
    <nprogress-container></nprogress-container>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/courses">Courses</router-link> |
      <router-link to="/trays">Trays</router-link> |
      <router-link to="/settings">Settings</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'

export default {
  components: {
    NprogressContainer
  },
  created () {
    try {
      // NOTE: 45min refresh policy is what google recommends
      window.setInterval(this.$refreshToken(), 45 * 60 * 1000)
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
