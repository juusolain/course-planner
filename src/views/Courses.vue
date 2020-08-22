<template>
  <div class="courselist">
    <h1>This is the courses page</h1>
    <CourseBar v-for="(groups, barNum) in bars" :key="barNum" :name="barNum" :groups='groups'/>
    <CourseList />
  </div>
</template>

<script>
import CourseList from '@/components/CourseList.vue'
import CourseBar from '@/components/Tray/CourseBar.vue'
import store from '@/store.js'

export default {
  components: {
    CourseList,
    CourseBar
  },
  data () {
    return {
      bars: store.trays['1']
    }
  }
}
</script>
