<template>
  <div class="trays">
    <h1>This is the trays page</h1>
    <div v-for="(tray, trayNum) in trays" class="container box notification" :key="trayNum">
        <CourseBar v-for="(groups, barNum) in tray" :key="barNum" :name="barNum" :groups='groups'/>
    </div>
  </div>
</template>

<script>
import CourseBar from '@/components/Tray/CourseBar.vue'
import store from '@/store.js'

export default {
  components: {
    CourseBar
  },
  data () {
    return {
      trays: store.trays
    }
  }
}
</script>
