<template>
  <section class="section trays container">
    <div v-for="(tray, trayNum) in trays" class="container box notification" :key="trayNum">
        <GroupBar v-for="(groups, barNum) in tray" :activeYear="activeYear" :key="barNum" :name="barNum" :groups='groups'/>
    </div>
  </section>
</template>

<script>
import GroupBar from '@/components/Tray/GroupBar.vue'
import CourseManager from '@/scripts/courses.js'

export default {
  components: {
    GroupBar
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
