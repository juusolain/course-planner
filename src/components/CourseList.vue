<template>
  <div class="container">
    <div class="columns" v-for="(courseNumbers, courseName) in courses" :key="courseName">
      <div class="column is-1">
        <p>{{courseName}}</p>
      </div>
      <div class="column">
        <div class="is-flex">
          <div v-for="(courseNumber, index) of courseNumbers" :key="courseName+courseNumber+index">
            <b-button size="is-small">{{courseNumber}}</b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CourseManager from '@/scripts/courses.js'

export default {
  name: 'CourseList',
  data () {
    return {
      courses: CourseManager.allCourses,
      columns: [{ field: 'name', label: 'name' }]
    }
  }
}
</script>
