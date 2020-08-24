<template>
    <b-button size="is-small" :type="type" @click="toggleWanted">{{courseObj.courseNumber}}{{selectionYear}}</b-button>
</template>

<script>
import CourseManager from '@/scripts/courses.js'

export default {
  props: ['courseObj', 'courseName', 'activeYear'],
  data () {
    return {
      wantedCourses: CourseManager.wantedCourses
    }
  },
  computed: {
    type () {
      const year = this.getSelectionYear()
      let val = ''
      switch (this.courseObj.courseType) {
        case 'P':
          val = 'is-success'
          break
        case 'VS':
          val = 'is-danger'
          break
        case 'K':
          val = 'is-primary'
          break
        default:
          break
      }
      if (year === null) {
        val += 'is-light'
      }
      return val
    },
    selectionYear () {
      const year = this.getSelectionYear()
      if (year !== null) {
        return ` (${year})`
      } else {
        return ''
      }
    }
  },
  methods: {
    getSelectionYear () {
      return CourseManager.getCourseWantedYear(this.courseObj.courseKey)
    },
    toggleWanted () {
      if (!CourseManager.isCourseWanted(this.courseObj.courseKey)) {
        CourseManager.addWantedCourse(this.courseObj.courseKey, this.activeYear)
      } else {
        CourseManager.removeWantedCourse(this.courseObj.courseKey, this.activeYear)
      }
    }
  }
}
</script>
