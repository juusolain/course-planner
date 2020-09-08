<template>
  <div class="container">
    <div class="columns box notification" v-for="(courseNumbers, courseName) in visibileCourses" :key="courseName">
      <div class="column is-narrow is-flex basecoursediv">
        <p class="is-size-5 coursetext">{{courseName}}</p>
        <b-button type="is-primary is-light" size="is-small" class="coursebutton" @click="hideCourses(courseName)" icon-right="eye-off"></b-button>
      </div>
      <div class="column">
        <div class="is-flex courselist">
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
      hiddenCourseBaseKeys: CourseManager.hiddenCourseBaseKeys
    }
  },
  computed: {
    visibileCourses () {
      const res = {}
      const query = CourseManager.courses.find()
      query.$.subscribe(results => {
        results.forEach(course => {
          res[course.courseBaseKey] = res[course.courseBaseKey] || []
          res[course.courseBaseKey].push(course)
        })
      })
      return res
    }
  },
  methods: {
    hideCourses (courseBaseKey) {
      CourseManager.hideCourses(courseBaseKey)
    }
  }
}
</script>

<style lang="scss" scoped>
.courselist{
  flex-wrap: wrap;
}
.coursetext{
  margin: 1em;
}
.columns{
  margin: 1em;
}
.coursebutton{
  margin: auto 0.5em;
}
.basecoursediv{
  justify-content: space-evenly;
}
</style>
