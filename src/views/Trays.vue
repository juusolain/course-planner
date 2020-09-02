<template>
  <section class="section trays container">
    <div v-for="(tray, trayNum) in trays" class="container box notification" :key="trayNum">
        <CourseBar v-for="(groups, barNum) in tray" :activeYear="activeYear" :key="barNum" :name="barNum" :groups='groups'/>
    </div>
  </section>
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
      activeYear: CourseManager.currentYear
    }
  }
}
</script>

<style lang="scss" scoped>
  button{
    margin: 0.1em
  }
</style>
