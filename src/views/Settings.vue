<template>
  <div>
    <div>
      Hidden courses:
      <div v-for="key in hiddenKeys" :key="key">
        <b-button type="is-small" icon-right="eye" @click="unHideCourses(key)">{{key}}</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import CourseManager from '@/scripts/courses'

export default {
  data () {
    return {
      hiddenKeys: CourseManager.hiddenCourseBaseKeys
    }
  },
  methods: {
    unHideCourses (courseBaseKey) {
      CourseManager.unHideCourses(courseBaseKey)
    }
  }
}
</script>
