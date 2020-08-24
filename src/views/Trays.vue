<template>
  <div class="trays">
    <h1>This is the trays page</h1>
    <div class="courselist-buttons box notification is-primary is-light">
      <b-button :type="getButtonStyle('1', 'is-danger')" @click="setActive('1')">1</b-button>
      <b-button :type="getButtonStyle('2', 'is-warning')" @click="setActive('2')">2</b-button>
      <b-button :type="getButtonStyle('3', 'is-success')" @click="setActive('3')">3</b-button>
    </div>
    <div v-for="(tray, trayNum) in trays" class="container box notification" :key="trayNum">
        <CourseBar v-for="(groups, barNum) in tray" :activeYear="activeYear" :key="barNum" :name="barNum" :groups='groups'/>
    </div>
  </div>
</template>

<script>
import CourseBar from '@/components/Tray/CourseBar.vue'
import CourseManager from '@/scripts/courses.js'

export default {
  components: {
    CourseBar
  },
  data () {
    return {
      trays: CourseManager.trays,
      activeYear: '1'
    }
  },
  methods: {
    getButtonStyle (year, baseStyle) {
      if (year === this.activeYear) {
        return baseStyle
      } else {
        return ''
      }
    },
    setActive (year) {
      this.activeYear = year
    }
  }
}
</script>

<style lang="scss" scoped>
  button{
    margin: 0.1em
  }
</style>
