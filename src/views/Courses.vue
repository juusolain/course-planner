<template>
  <div class="courselist">
    <h1>This is the courses page</h1>
    <CourseList />
  </div>
</template>

<script>
import CourseList from '@/components/CourseList.vue'
import store from '@/store.js'

export default {
  components: {
    CourseList
  },
  data () {
    return {
      test: 'test'
    }
  }
}
</script>
