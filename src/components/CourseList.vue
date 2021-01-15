<template>
  <div class="container">
    <CourseBar v-for="courseBaseKey in visibleBaseKeys" :key="courseBaseKey" :courseBaseKey="courseBaseKey" />
  </div>
</template>

<script>
import CourseManager from '@/scripts/courses.js'
import databasePromise from '@/scripts/database.js'
import CourseBar from '@/components/Courses/CourseBar.vue'

export default {
  name: 'CourseList',
  components: { CourseBar },
  props: ['activeYear'],
  data () {
    return {
      courses: CourseManager.allCourses,
      hiddenCourseBaseKeys: CourseManager.hiddenCourseBaseKeys,
      visibleBaseKeys: []
    }
  },
  mounted () {
    this.loadBaseKeys()
  },
  methods: {
    hideCourses (courseBaseKey) {
      CourseManager.hideCourses(courseBaseKey)
    },
    async loadBaseKeys () {
      const db = await databasePromise
      const query = db.courses.find()
      query.$.subscribe((rxReturn) => {
        console.log(rxReturn.toJSON())
      })
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
