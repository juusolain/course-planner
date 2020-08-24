<template>
    <b-button size="is-small" :type="type" @click="toggleWanted">{{courseNum}}</b-button>
</template>

<script>
import CourseManager from '@/scripts/courses.js'

export default {
  props: ['courseNum', 'courseName', 'activeYear'],
  data () {
    return {
      wantedCourses: CourseManager.wantedCourses
    }
  },
  computed: {
    type () {
      const year = this.getSelectionYear()
      if (year === null) {
        return ''
      } else {
        let val = ''
        switch (year) {
          case '1':
            val = 'is-danger'
            break
          case '2':
            val = 'is-warning'
            break
          case '3':
            val = 'is-success'
            break
          default:
            break
        }
        return val
      }
    }
  },
  methods: {
    getSelectionYear () {
      return CourseManager.getCourseWantedYear(this.courseName + this.courseNum)
    },
    toggleWanted () {
      if (!CourseManager.isCourseWanted(this.courseName + this.courseNum)) {
        CourseManager.addWantedCourse(this.courseName + this.courseNum, this.activeYear)
      } else {
        CourseManager.removeWantedCourse(this.courseName + this.courseNum, this.activeYear)
      }
    }
  }
}
</script>
