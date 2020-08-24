<template>
  <div class="container">
    <div class="columns" v-for="(courseNumbers, courseName) in courses" :key="courseName">
      <div class="column is-1">
        <p>{{courseName}}</p>
      </div>
      <div class="column">
        <div class="is-flex">
          <div v-for="(courseObj, index) of courseNumbers" :key="courseObj.courseKey+index">
            <CourseButton :courseObj="courseObj" :courseName="courseName" :activeYear="activeYear" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CourseManager from '@/scripts/courses.js'
import CourseButton from '@/components/Courses/CourseButton.vue'

export default {
  name: 'CourseList',
  components: { CourseButton },
  props: ['activeYear'],
  data () {
    return {
      courses: CourseManager.allCourses,
      columns: [{ field: 'name', label: 'name' }]
    }
  }
}
</script>
